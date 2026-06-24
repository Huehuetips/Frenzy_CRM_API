import 'dotenv/config';

import bcrypt from 'bcryptjs';

import { prisma } from '../src/shared/prisma';

const main = async () => {
  const email = 'admin@example.com';
  const passwordHash = await bcrypt.hash('admin12345', 10);

  await prisma.user.upsert({
    where: { emailUser: email },
    update: {},
    create: {
      emailUser: email,
      passwordHashUser: passwordHash
    }
  });
};

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
