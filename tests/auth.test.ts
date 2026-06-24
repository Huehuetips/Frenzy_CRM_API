import 'dotenv/config';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import request from 'supertest';

import { createApp } from '../src/app';
import { env } from '../src/config/env';
import { authMiddleware } from '../src/middlewares/auth.middleware';
import { prisma } from '../src/shared/prisma';

const app = createApp();

app.get('/api/test/protected', authMiddleware, (_req, res) => {
  res.status(200).json({ success: true });
});

const testUser = {
  email: 'test@example.com',
  password: 'testpassword123'
};

describe('Auth module', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        emailUser: testUser.email
      }
    });

    const passwordHashUser = await bcrypt.hash(testUser.password, 10);

    await prisma.user.create({
      data: {
        emailUser: testUser.email,
        passwordHashUser
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        emailUser: testUser.email
      }
    });

    await prisma.$disconnect();
  });

  describe('Health Check', () => {
    it('GET /api/health retorna 200 con { success: true }', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ success: true });
    });
  });

  describe('POST /api/auth/login', () => {
    it('Login exitoso con credenciales validas retorna 200 y token JWT', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          token: expect.any(String)
        }
      });

      const payload = jwt.verify(response.body.data.token, env.JWT_SECRET);

      expect(payload).toMatchObject({
        emailUser: testUser.email
      });
    });

    it('Login con email inexistente retorna 401', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'missing@example.com',
        password: testUser.password
      });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: 'Credenciales invalidas'
      });
    });

    it('Login con password incorrecto retorna 401', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword'
      });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: 'Credenciales invalidas'
      });
    });

    it('Login sin body retorna 400 con errores de validacion', async () => {
      const response = await request(app).post('/api/auth/login').send();

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation error',
        errors: expect.any(Array)
      });
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('Login con email invalido retorna 400', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'not-an-email',
        password: testUser.password
      });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'email'
          })
        ])
      });
    });

    it('Login con password vacio retorna 400', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: ''
      });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'password'
          })
        ])
      });
    });
  });

  describe('Auth Middleware', () => {
    it('Acceso a ruta protegida sin token retorna 401', async () => {
      const response = await request(app).get('/api/test/protected');

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false
      });
    });

    it('Acceso con token invalido retorna 401', async () => {
      const response = await request(app)
        .get('/api/test/protected')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false
      });
    });

    it('Acceso con token expirado retorna 401', async () => {
      const expiredToken = jwt.sign(
        {
          idUser: 'expired-user-id',
          emailUser: testUser.email
        },
        env.JWT_SECRET,
        {
          expiresIn: '-1s'
        }
      );

      const response = await request(app)
        .get('/api/test/protected')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false
      });
    });

    it('Acceso con token valido retorna 200 con datos del usuario', async () => {
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          emailUser: testUser.email
        }
      });
    });
  });
});
