import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating super admin: badhonmondoldeveloper@gmail.com ...');

  const passwordHash = await bcrypt.hash('badhon#2006', 10);

  const user = await prisma.user.upsert({
    where: { email: 'badhonmondoldeveloper@gmail.com' },
    update: {
      passwordHash,
      role: 'SUPER_ADMIN',
      name: 'Badhon Mondol',
    },
    create: {
      name: 'Badhon Mondol',
      email: 'badhonmondoldeveloper@gmail.com',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Super admin created/updated:');
  console.log(`   ID:    ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role:  ${user.role}`);
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
