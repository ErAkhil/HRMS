const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'SUPER_ADMIN'
      },
      select: {
        email: true,
        org: {
          select: {
            name: true
          }
        }
      }
    });

    console.log('Count:', users.length);
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.\();
  }
}

main();
