import 'dotenv/config';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from '../src/shared/prisma';

const main = async () => {
  const email = 'admin@example.com';
  const passwordHash = await bcrypt.hash('admin12345', 10);

  const user = await prisma.user.upsert({
    where: { emailUser: email },
    update: {},
    create: {
      emailUser: email,
      passwordHashUser: passwordHash
    }
  });

  const expiredToken = jwt.sign(
    {
      idUser: user.idUser,
      emailUser: user.emailUser
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1s' }
  );

  console.log('\n========================================');
  console.log('  Usuario demo creado:');
  console.log('  Email: admin@example.com');
  console.log('  Password: admin12345');
  console.log('========================================');
  console.log('\n  Token expirado para pruebas:');
  console.log(`  ${expiredToken}`);
  console.log('========================================\n');
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
