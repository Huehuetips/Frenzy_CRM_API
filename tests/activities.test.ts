import "dotenv/config";

import { LeadActivityType, LeadStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import request from "supertest";

import { createApp } from "../src/app";
import { prisma } from "../src/shared/prisma";

const app = createApp();

const testRunId = `activities-${Date.now()}`;
const missingLeadId = randomUUID();

const testUser = {
  email: `${testRunId}@example.com`,
  password: "testpassword123",
};

let token: string;
let leadId: string;

const authHeader = () => ({
  Authorization: `Bearer ${token}`,
});

const buildLead = (suffix: string, overrides = {}) => ({
  nameLead: `Activity Lead ${suffix}`,
  emailLead: `${testRunId}-${suffix}@example.com`,
  phoneLead: `555-020-${suffix.slice(0, 1)}`,
  sourceLead: `${testRunId}-source`,
  ...overrides,
});

const buildActivity = (suffix: string, overrides = {}) => ({
  type: LeadActivityType.note,
  note: `Activity note ${testRunId} ${suffix}`,
  ...overrides,
});

describe("Lead activities", () => {
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

    const lead = await prisma.lead.create({
      data: buildLead("base"),
    });

    leadId = lead.idLead;
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

  describe("POST /api/leads/:id/activities", () => {
    it("Crear actividad con type y note validos retorna 201 con datos correctos", async () => {
      const activityData = buildActivity("created", {
        type: LeadActivityType.note,
      });

      const response = await request(app)
        .post(`/api/leads/${leadId}/activities`)
        .set(authHeader())
        .send(activityData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          idLeadActivity: expect.any(String),
          leadId,
          typeLeadActivity: activityData.type,
          noteLeadActivity: activityData.note,
          createdAtLeadActivity: expect.any(String),
        },
      });
    });

    it("Crear actividad sin type usa note por defecto, retorna 201", async () => {
      const activityData = {
        note: `Activity note ${testRunId} default-type`,
      };

      const response = await request(app)
        .post(`/api/leads/${leadId}/activities`)
        .set(authHeader())
        .send(activityData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          idLeadActivity: expect.any(String),
          leadId,
          typeLeadActivity: LeadActivityType.note,
          noteLeadActivity: activityData.note,
          createdAtLeadActivity: expect.any(String),
        },
      });
    });

    it("Crear actividad sin note retorna 400", async () => {
      const response = await request(app)
        .post(`/api/leads/${leadId}/activities`)
        .set(authHeader())
        .send({
          type: LeadActivityType.note,
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it('Crear actividad con note vacio ("") retorna 400', async () => {
      const response = await request(app)
        .post(`/api/leads/${leadId}/activities`)
        .set(authHeader())
        .send(buildActivity("empty-note", { note: "" }));

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Crear actividad con type invalido retorna 400", async () => {
      const response = await request(app)
        .post(`/api/leads/${leadId}/activities`)
        .set(authHeader())
        .send(buildActivity("invalid-type", { type: "invalid" }));

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Lead no encontrado retorna 404", async () => {
      const response = await request(app)
        .post(`/api/leads/${missingLeadId}/activities`)
        .set(authHeader())
        .send(buildActivity("missing-lead"));

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        message: "Lead no encontrado",
      });
    });

    it("UUID invalido en :id retorna 400", async () => {
      const response = await request(app)
        .post("/api/leads/invalid-id/activities")
        .set(authHeader())
        .send(buildActivity("invalid-id"));

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Sin token retorna 401", async () => {
      const response = await request(app)
        .post(`/api/leads/${leadId}/activities`)
        .send(buildActivity("no-token"));

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: "Token invalido o ausente",
      });
    });
  });

  describe("GET /api/leads/:id/activities", () => {
    beforeAll(async () => {
      await prisma.leadActivity.createMany({
        data: [
          {
            leadId,
            typeLeadActivity: LeadActivityType.note,
            noteLeadActivity: `Ordered activity ${testRunId} old`,
            createdAtLeadActivity: new Date("2026-01-01T10:00:00.000Z"),
          },
          {
            leadId,
            typeLeadActivity: LeadActivityType.note,
            noteLeadActivity: `Ordered activity ${testRunId} middle`,
            createdAtLeadActivity: new Date("2026-01-02T10:00:00.000Z"),
          },
          {
            leadId,
            typeLeadActivity: LeadActivityType.note,
            noteLeadActivity: `Ordered activity ${testRunId} newer`,
            createdAtLeadActivity: new Date("2026-01-03T10:00:00.000Z"),
          },
        ],
      });
    });

    it("Listar actividades retorna 200 con array", async () => {
      const response = await request(app)
        .get(`/api/leads/${leadId}/activities`)
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array),
      });
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("Actividades ordenadas por fecha descendente", async () => {
      const response = await request(app)
        .get(`/api/leads/${leadId}/activities`)
        .set(authHeader());

      expect(response.status).toBe(200);

      const createdAtValues = response.body.data.map(
        (activity: { createdAtLeadActivity: string }) =>
          new Date(activity.createdAtLeadActivity).getTime()
      );

      for (let index = 1; index < createdAtValues.length; index += 1) {
        expect(createdAtValues[index - 1]).toBeGreaterThanOrEqual(
          createdAtValues[index]
        );
      }
    });

    it("Lead no encontrado retorna 404", async () => {
      const response = await request(app)
        .get(`/api/leads/${missingLeadId}/activities`)
        .set(authHeader());

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        message: "Lead no encontrado",
      });
    });

    it("UUID invalido retorna 400", async () => {
      const response = await request(app)
        .get("/api/leads/invalid-id/activities")
        .set(authHeader());

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Sin token retorna 401", async () => {
      const response = await request(app).get(
        `/api/leads/${leadId}/activities`
      );

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: "Token invalido o ausente",
      });
    });
  });

  describe("Auto-registro al cambiar status", () => {
    it("Cambiar status crea actividad tipo status_change automaticamente", async () => {
      const previousStatusChangeCount = await prisma.leadActivity.count({
        where: {
          leadId,
          typeLeadActivity: LeadActivityType.status_change,
        },
      });

      const response = await request(app)
        .patch(`/api/leads/${leadId}/status`)
        .set(authHeader())
        .send({
          statusLead: LeadStatus.calificado,
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          idLead: leadId,
          statusLead: LeadStatus.calificado,
        },
      });

      const statusChangeActivities = await prisma.leadActivity.findMany({
        where: {
          leadId,
          typeLeadActivity: LeadActivityType.status_change,
        },
        orderBy: {
          createdAtLeadActivity: "desc",
        },
      });

      expect(statusChangeActivities).toHaveLength(
        previousStatusChangeCount + 1
      );
      expect(statusChangeActivities[0]).toMatchObject({
        leadId,
        typeLeadActivity: LeadActivityType.status_change,
        noteLeadActivity: `Estado cambiado a ${LeadStatus.calificado}`,
      });
    });
  });

  describe("Validaciones de QA", () => {
    it("note con mas de 2000 chars retorna 400", async () => {
      const response = await request(app)
        .post(`/api/leads/${leadId}/activities`)
        .set(authHeader())
        .send(buildActivity("qa-long-note", { note: "a".repeat(2001) }));

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("type status_change retorna 400", async () => {
      const response = await request(app)
        .post(`/api/leads/${leadId}/activities`)
        .set(authHeader())
        .send({ type: "status_change", note: "test" });

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("type webhook retorna 400", async () => {
      const response = await request(app)
        .post(`/api/leads/${leadId}/activities`)
        .set(authHeader())
        .send({ type: "webhook", note: "test" });

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("note con espacios se trimmea", async () => {
      const response = await request(app)
        .post(`/api/leads/${leadId}/activities`)
        .set(authHeader())
        .send(buildActivity("qa-trim-note", { note: "  nota test  " }));

      expect(response).toMatchObject({ status: 201 });
      expect(response.body).toMatchObject({
        success: true,
        data: {
          noteLeadActivity: "nota test",
        },
      });

      const activity = await prisma.leadActivity.findUnique({
        where: {
          idLeadActivity: response.body.data.idLeadActivity,
        },
      });

      expect(activity).toMatchObject({
        noteLeadActivity: "nota test",
      });
    });
  });
});
