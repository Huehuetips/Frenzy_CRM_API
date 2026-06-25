import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

import { env } from '../../config/env';
import { createAppError } from '../../shared/errors';
import { prisma } from '../../shared/prisma';

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      emailUser: email
    }
  });

  if (!user) {
    throw createAppError('Credenciales invalidas', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHashUser);

  if (!passwordMatches) {
    throw createAppError('Credenciales invalidas', 401);
  }

  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn']
  };

  const token = jwt.sign(
    {
      idUser: user.idUser,
      emailUser: user.emailUser
    },
    env.JWT_SECRET,
    signOptions
  );

  return { token };
};
