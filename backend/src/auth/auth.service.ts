import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import type { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        org: { select: { name: true, plan: true } },
        employee: { select: { id: true } },
      },
    });

    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
      orgName: user.org.name,
      plan: user.org.plan,
      employeeId: user.employee?.id ?? null,
    };

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

      if (!user || !user.isActive) throw new UnauthorizedException();

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        orgName: user.org.name,
        plan: user.org.plan,
        employeeId: user.employee?.id ?? null,
      };

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
