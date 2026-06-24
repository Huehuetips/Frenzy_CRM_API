import { RequestHandler } from 'express';

import { LoginInput } from './auth.schema';
import * as authService from './auth.service';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as LoginInput;
    const data = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = (req, res) => {
  const { idUser, emailUser } = req.user!;

  res.status(200).json({
    success: true,
    data: {
      idUser,
      emailUser
    }
  });
};
