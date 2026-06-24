import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

import { env } from '../../config/env';
import { prisma } from '../../shared/prisma';

type AuthError = Error & {
  statusCode?: number;
};

const createAuthError = () => {
  const error: AuthError = new Error('Credenciales invalidas');
  error.statusCode = 401;
  return error;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      emailUser: email
    }
  });

  if (!user) {
    throw createAuthError();
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHashUser);

  if (!passwordMatches) {
    throw createAuthError();
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
