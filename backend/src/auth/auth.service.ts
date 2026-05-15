import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { validatePasswordStrength } from '../common/utils/password-validator';
import type { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private buildPayload(
    user: { id: string; email: string; role: JwtPayload['role']; orgId: string },
    org: { name: string; plan: JwtPayload['plan'] },
    employeeId: string | null,
  ): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
      orgName: org.name,
      plan: org.plan,
      employeeId,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        org: { select: { name: true, plan: true } },
        employee: { select: { id: true } },
      },
    });

    if (!user?.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = this.buildPayload(user, user.org, user.employee?.id ?? null);

    return {
      accessToken: this.signAccess(payload),
      refreshToken: this.signRefresh(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        orgName: user.org.name,
        plan: user.org.plan,
        employeeId: user.employee?.id ?? null,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const secret = this.config.get<string>('JWT_REFRESH_SECRET');
      const payload = this.jwt.verify<JwtPayload>(refreshToken, { secret });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          org: { select: { name: true, plan: true } },
          employee: { select: { id: true } },
        },
      });

      if (!user?.isActive) throw new UnauthorizedException();

      const newPayload = this.buildPayload(user, user.org, user.employee?.id ?? null);

      return {
        accessToken: this.signAccess(newPayload),
        refreshToken: this.signRefresh(newPayload),
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        org: { select: { name: true, plan: true } },
        employee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, title: true } },
      },
    });

    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
      orgName: user.org.name,
      plan: user.org.plan,
      employee: user.employee ?? null,
    };
  }

  async googleSignIn(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        org: { select: { name: true, plan: true } },
        employee: { select: { id: true } },
      },
    });

    if (!user?.isActive) throw new UnauthorizedException('No account found for this Google email. Contact your HR admin.');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = this.buildPayload(user, user.org, user.employee?.id ?? null);

    return {
      accessToken: this.signAccess(payload),
      refreshToken: this.signRefresh(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        orgName: user.org.name,
        plan: user.org.plan,
        employeeId: user.employee?.id ?? null,
      },
    };
  }

  async registerOrg(data: {
    orgName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    // Validate password strength
    const passwordValidation = validatePasswordStrength(data.password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'Password does not meet strength requirements',
        errors: passwordValidation.errors,
      });
    }

    const existing = await this.prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) throw new ConflictException('Email already registered');

    const slug = data.orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const uniqueSlug = `${slug}-${Date.now().toString(36)}`;
    const passwordHash = await bcrypt.hash(data.password, 12);

    const result = await this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: data.orgName, slug: uniqueSlug, plan: 'BASIC' },
      });

      const user = await tx.user.create({
        data: { email: data.email.toLowerCase(), passwordHash, role: 'SUPER_ADMIN', orgId: org.id },
      });

      const employee = await tx.employee.create({
        data: {
          userId: user.id,
          orgId: org.id,
          employeeCode: `EMP-001`,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email.toLowerCase(),
          title: 'Administrator',
          salary: 0,
          startDate: new Date(),
          isActive: true,
        },
      });

      return { org, user, employee };
    });

    const payload = this.buildPayload(result.user, result.org, result.employee.id);

    return {
      accessToken: this.signAccess(payload),
      refreshToken: this.signRefresh(payload),
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        orgId: result.org.id,
        orgName: result.org.name,
        plan: result.org.plan,
        employeeId: result.employee.id,
      },
    };
  }

  private signAccess(payload: JwtPayload) {
    return this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES') ?? '15m',
    });
  }

  private signRefresh(payload: JwtPayload) {
    return this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES') ?? '7d',
    });
  }
}
