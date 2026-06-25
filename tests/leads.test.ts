import "dotenv/config";

import { LeadStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import request from "supertest";

import { createApp } from "../src/app";
import { prisma } from "../src/shared/prisma";

const app = createApp();

const testUser = {
  email: "test@example.com",
  password: "testpassword123",
};

const testRunId = `leads-crud-${Date.now()}`;
const missingLeadId = randomUUID();

let token: string;
let createdLeadId: string;

const authHeader = () => ({
  Authorization: `Bearer ${token}`,
});

const buildLead = (suffix: string, overrides = {}) => ({
  nameLead: `Lead Test ${suffix}`,
  emailLead: `${testRunId}-${suffix}@example.com`,
  phoneLead: "+52 55 1234 5678",
  sourceLead: `${testRunId}-web`,
  ...overrides,
});

describe("Leads CRUD", () => {
  beforeAll(async () => {
    await prisma.lead.deleteMany({
      where: {
        OR: [
          {
            emailLead: {
              contains: testRunId,
            },
          },
          {
            sourceLead: {
              contains: testRunId,
            },
          },
        ],
      },
    });

    await prisma.user.deleteMany({
      where: {
        emailUser: testUser.email,
      },
    });

    const passwordHashUser = await bcrypt.hash(testUser.password, 10);

    await prisma.user.create({
      data: {
        emailUser: testUser.email,
        passwordHashUser,
      },
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    token = loginResponse.body.data.token;
  });

  afterAll(async () => {
    await prisma.lead.deleteMany({
      where: {
        OR: [
          {
            emailLead: {
              contains: testRunId,
            },
          },
          {
            sourceLead: {
              contains: testRunId,
            },
          },
        ],
      },
    });

    await prisma.user.deleteMany({
      where: {
        emailUser: testUser.email,
      },
    });

    await prisma.$disconnect();
  });

  describe("POST /api/leads", () => {
    it("Crear lead con datos validos retorna 201 con el lead creado", async () => {
      const leadData = buildLead("created");

      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(leadData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          idLead: expect.any(String),
          nameLead: leadData.nameLead,
          emailLead: leadData.emailLead,
          phoneLead: leadData.phoneLead,
          sourceLead: leadData.sourceLead,
          statusLead: LeadStatus.nuevo,
          createdAtLead: expect.any(String),
          updatedAtLead: expect.any(String),
        },
      });

      createdLeadId = response.body.data.idLead;
    });

    it("Crear lead sin nameLead retorna 400", async () => {
      const { nameLead: _nameLead, ...leadData } = buildLead("missing-name");

      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(leadData);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Crear lead con emailLead invalido retorna 400", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(buildLead("invalid-email", { emailLead: "invalid-email" }));

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Crear lead con emailLead vacio retorna 400", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(buildLead("empty-email", { emailLead: "" }));

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Crear lead solo con campos obligatorios retorna 201 con campos opcionales null", async () => {
      const leadData = {
        nameLead: "Lead Test Required Only",
        emailLead: `${testRunId}-required-only@example.com`,
      };

      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(leadData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          idLead: expect.any(String),
          nameLead: leadData.nameLead,
          emailLead: leadData.emailLead,
          phoneLead: null,
          sourceLead: null,
          statusLead: LeadStatus.nuevo,
          createdAtLead: expect.any(String),
          updatedAtLead: expect.any(String),
        },
      });
    });

    it("Crear lead sin token retorna 401", async () => {
      const response = await request(app)
        .post("/api/leads")
        .send(buildLead("no-token"));

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: "Token invalido o ausente",
      });
    });
  });

  describe("GET /api/leads", () => {
    beforeAll(async () => {
      await prisma.lead.createMany({
        data: [
          buildLead("alpha-filter", {
            emailLead: `${testRunId}-alpha.match@example.com`,
            sourceLead: `${testRunId}-landing`,
            statusLead: LeadStatus.nuevo,
          }),
          buildLead("beta-filter", {
            emailLead: `${testRunId}-beta.match@example.com`,
            sourceLead: `${testRunId}-ads`,
            statusLead: LeadStatus.contactado,
          }),
          buildLead("gamma-filter", {
            emailLead: `${testRunId}-gamma@example.com`,
            sourceLead: `${testRunId}-landing`,
            statusLead: LeadStatus.calificado,
          }),
          buildLead("before-range", {
            emailLead: `${testRunId}-before-range@example.com`,
            sourceLead: `${testRunId}-date-range`,
            createdAtLead: new Date("2025-12-31T23:59:59.000Z"),
          }),
          buildLead("inside-range-a", {
            emailLead: `${testRunId}-inside-range-a@example.com`,
            sourceLead: `${testRunId}-date-range`,
            createdAtLead: new Date("2026-01-10T12:00:00.000Z"),
          }),
          buildLead("inside-range-b", {
            emailLead: `${testRunId}-inside-range-b@example.com`,
            sourceLead: `${testRunId}-date-range`,
            createdAtLead: new Date("2026-01-20T12:00:00.000Z"),
          }),
          buildLead("after-range", {
            emailLead: `${testRunId}-after-range@example.com`,
            sourceLead: `${testRunId}-date-range`,
            createdAtLead: new Date("2026-02-01T00:00:00.000Z"),
          }),
        ],
      });
    });

    it("Listar leads retorna 200 con data y meta de paginacion", async () => {
      const response = await request(app).get("/api/leads").set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          data: expect.any(Array),
          meta: {
            total: expect.any(Number),
            page: 1,
            limit: 20,
            totalPages: expect.any(Number),
          },
        },
      });
    });

    it("Filtrar por email parcial retorna leads que contienen el texto", async () => {
      const response = await request(app)
        .get("/api/leads")
        .query({ email: `${testRunId}-alpha` })
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          data: expect.arrayContaining([
            expect.objectContaining({
              emailLead: `${testRunId}-alpha.match@example.com`,
            }),
          ]),
          meta: {
            total: expect.any(Number),
          },
        },
      });

      response.body.data.data.forEach((lead: { emailLead: string }) => {
        expect(lead).toMatchObject({
          emailLead: expect.stringContaining(`${testRunId}-alpha`),
        });
      });
    });

    it("Filtrar por status retorna solo leads con ese estado", async () => {
      const response = await request(app)
        .get("/api/leads")
        .query({ status: LeadStatus.contactado })
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          data: expect.arrayContaining([
            expect.objectContaining({
              emailLead: `${testRunId}-beta.match@example.com`,
              statusLead: LeadStatus.contactado,
            }),
          ]),
          meta: {
            total: expect.any(Number),
          },
        },
      });

      response.body.data.data.forEach((lead: { statusLead: LeadStatus }) => {
        expect(lead).toMatchObject({
          statusLead: LeadStatus.contactado,
        });
      });
    });

    it("Filtrar por source retorna solo leads con esa fuente", async () => {
      const response = await request(app)
        .get("/api/leads")
        .query({ source: `${testRunId}-landing` })
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          data: expect.any(Array),
          meta: {
            total: expect.any(Number),
          },
        },
      });

      response.body.data.data.forEach((lead: { sourceLead: string }) => {
        expect(lead).toMatchObject({
          sourceLead: `${testRunId}-landing`,
        });
      });
    });

    it("Paginacion con page y limit funciona correctamente", async () => {
      const response = await request(app)
        .get("/api/leads")
        .query({ source: `${testRunId}-landing`, page: 2, limit: 1 })
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          data: expect.any(Array),
          meta: {
            total: 2,
            page: 2,
            limit: 1,
            totalPages: 2,
          },
        },
      });
      expect(response.body.data.data).toMatchObject([expect.any(Object)]);
    });

    it("Filtrar por rango de fechas retorna solo leads dentro de from y to", async () => {
      const from = "2026-01-01T00:00:00.000Z";
      const to = "2026-01-31T23:59:59.999Z";

      const response = await request(app)
        .get("/api/leads")
        .query({
          source: `${testRunId}-date-range`,
          from,
          to,
        })
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          data: expect.any(Array),
          meta: {
            total: 2,
            page: 1,
            limit: 20,
            totalPages: 1,
          },
        },
      });

      const emails = response.body.data.data.map(
        (lead: { emailLead: string }) => lead.emailLead,
      );

      expect(emails).toEqual(
        expect.arrayContaining([
          `${testRunId}-inside-range-a@example.com`,
          `${testRunId}-inside-range-b@example.com`,
        ]),
      );
      expect(emails).not.toContain(`${testRunId}-before-range@example.com`);
      expect(emails).not.toContain(`${testRunId}-after-range@example.com`);

      response.body.data.data.forEach(
        (lead: { sourceLead: string; createdAtLead: string }) => {
          const createdAt = new Date(lead.createdAtLead).getTime();

          expect(lead).toMatchObject({
            sourceLead: `${testRunId}-date-range`,
          });
          expect(createdAt).toBeGreaterThanOrEqual(new Date(from).getTime());
          expect(createdAt).toBeLessThanOrEqual(new Date(to).getTime());
        },
      );
    });

    it("Filtrar con from invalido retorna 400", async () => {
      const response = await request(app)
        .get("/api/leads")
        .query({ from: "fecha-invalida" })
        .set(authHeader());

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Filtrar con status invalido retorna 400", async () => {
      const response = await request(app)
        .get("/api/leads")
        .query({ status: "invalido" })
        .set(authHeader());

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Filtrar con limit mayor a 100 retorna 400", async () => {
      const response = await request(app)
        .get("/api/leads")
        .query({ limit: 101 })
        .set(authHeader());

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });
  });

  describe("GET /api/leads/:id", () => {
    it("Obtener lead existente retorna 200", async () => {
      const response = await request(app)
        .get(`/api/leads/${createdLeadId}`)
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          idLead: createdLeadId,
        },
      });
    });

    it("Lead no encontrado retorna 404", async () => {
      const response = await request(app)
        .get(`/api/leads/${missingLeadId}`)
        .set(authHeader());

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        message: "Lead no encontrado",
      });
    });

    it("UUID invalido retorna 400", async () => {
      const response = await request(app)
        .get("/api/leads/invalid-id")
        .set(authHeader());

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });
  });

  describe("PATCH /api/leads/:id", () => {
    it("Actualizar lead retorna 200 con datos actualizados", async () => {
      const updateData = {
        nameLead: "Lead Test Updated",
        phoneLead: "555-9999",
      };

      const response = await request(app)
        .patch(`/api/leads/${createdLeadId}`)
        .set(authHeader())
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          idLead: createdLeadId,
          nameLead: updateData.nameLead,
          phoneLead: updateData.phoneLead,
        },
      });
    });

    it("Actualizar con body vacio retorna 400", async () => {
      const response = await request(app)
        .patch(`/api/leads/${createdLeadId}`)
        .set(authHeader())
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Actualizar con emailLead invalido retorna 400", async () => {
      const response = await request(app)
        .patch(`/api/leads/${createdLeadId}`)
        .set(authHeader())
        .send({
          emailLead: "invalid-email",
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Lead no encontrado retorna 404", async () => {
      const response = await request(app)
        .patch(`/api/leads/${missingLeadId}`)
        .set(authHeader())
        .send({
          nameLead: "Missing Lead Updated",
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        message: "Lead no encontrado",
      });
    });
  });

  describe("PATCH /api/leads/:id/status", () => {
    it("Cambiar estado a contactado retorna 200", async () => {
      const response = await request(app)
        .patch(`/api/leads/${createdLeadId}/status`)
        .set(authHeader())
        .send({
          statusLead: LeadStatus.contactado,
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          idLead: createdLeadId,
          statusLead: LeadStatus.contactado,
        },
      });
    });

    it("Estado invalido retorna 400", async () => {
      const response = await request(app)
        .patch(`/api/leads/${createdLeadId}/status`)
        .set(authHeader())
        .send({
          statusLead: "invalido",
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Lead no encontrado retorna 404", async () => {
      const response = await request(app)
        .patch(`/api/leads/${missingLeadId}/status`)
        .set(authHeader())
        .send({
          statusLead: LeadStatus.contactado,
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        message: "Lead no encontrado",
      });
    });
  });

  describe("DELETE /api/leads/:id", () => {
    it("Eliminar lead retorna 200 con mensaje", async () => {
      const response = await request(app)
        .delete(`/api/leads/${createdLeadId}`)
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: "Lead eliminado",
      });
    });

    it("Lead no encontrado retorna 404", async () => {
      const response = await request(app)
        .delete(`/api/leads/${missingLeadId}`)
        .set(authHeader());

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        message: "Lead no encontrado",
      });
    });

    it("UUID invalido retorna 400", async () => {
      const response = await request(app)
        .delete("/api/leads/invalid-id")
        .set(authHeader());

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });
  });

  describe("Validaciones de QA", () => {
    it("nameLead con mas de 100 chars retorna 400", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(buildLead("qa-long-name", { nameLead: "a".repeat(101) }));

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("emailLead con mas de 255 chars retorna 400", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(
          buildLead("qa-long-email", {
            emailLead: `${"a".repeat(246)}@example.com`,
          }),
        );

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("phoneLead con letras retorna 400", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(buildLead("qa-phone-letters", { phoneLead: "abc123" }));

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("phoneLead con mas de 20 chars retorna 400", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(buildLead("qa-long-phone", { phoneLead: "1".repeat(21) }));

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("sourceLead con mas de 50 chars retorna 400", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(buildLead("qa-long-source", { sourceLead: "a".repeat(51) }));

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("nameLead con espacios se trimmea correctamente", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(buildLead("qa-trim-name", { nameLead: "  Juan  " }));

      expect(response).toMatchObject({ status: 201 });
      expect(response.body).toMatchObject({
        success: true,
        data: {
          nameLead: "Juan",
        },
      });

      const lead = await prisma.lead.findUnique({
        where: {
          idLead: response.body.data.idLead,
        },
      });

      expect(lead).toMatchObject({
        nameLead: "Juan",
      });

      await prisma.lead.deleteMany({
        where: {
          idLead: response.body.data.idLead,
        },
      });
    });

    it("sourceLead se normaliza a lowercase", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set(authHeader())
        .send(buildLead("qa-lowercase-source", { sourceLead: "GOOGLE" }));

      expect(response).toMatchObject({ status: 201 });
      expect(response.body).toMatchObject({
        success: true,
        data: {
          sourceLead: "google",
        },
      });

      const lead = await prisma.lead.findUnique({
        where: {
          idLead: response.body.data.idLead,
        },
      });

      expect(lead).toMatchObject({
        sourceLead: "google",
      });
    });

    it("from mayor que to retorna 400", async () => {
      const response = await request(app)
        .get("/api/leads")
        .query({
          from: "2025-12-31T00:00:00.000Z",
          to: "2025-01-01T00:00:00.000Z",
        })
        .set(authHeader());

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("UUID invalido en delete retorna 400", async () => {
      const response = await request(app)
        .delete("/api/leads/invalid-id")
        .set(authHeader());

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });
  });
});
