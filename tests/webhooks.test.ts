import "dotenv/config";

import { LeadActivityType, LeadStatus } from "@prisma/client";
import request from "supertest";

import { createApp } from "../src/app";
import { env } from "../src/config/env";
import { prisma } from "../src/shared/prisma";

const app = createApp();

const testRunId = `webhooks-${Date.now()}`;

const buildWebhookLead = (suffix: string, overrides = {}) => ({
  name: `Webhook Lead ${suffix}`,
  email: `${testRunId}-${suffix}@example.com`,
  phone: "+52 55 1234 5678",
  source: `${testRunId}-${suffix}`,
  ...overrides,
});

const cleanupWebhookLeads = async () => {
  const leads = await prisma.lead.findMany({
    where: {
      OR: [
        {
          sourceLead: {
            contains: testRunId,
          },
        },
        {
          emailLead: {
            contains: testRunId,
          },
        },
      ],
    },
    select: {
      idLead: true,
    },
  });

  const leadIds = leads.map((lead) => lead.idLead);

  if (leadIds.length === 0) {
    return;
  }

  await prisma.leadActivity.deleteMany({
    where: {
      leadId: {
        in: leadIds,
      },
    },
  });

  await prisma.lead.deleteMany({
    where: {
      idLead: {
        in: leadIds,
      },
    },
  });
};

describe("Webhooks module", () => {
  beforeAll(async () => {
    await cleanupWebhookLeads();
  });

  afterAll(async () => {
    await cleanupWebhookLeads();
    await prisma.$disconnect();
  });

  describe("POST /api/webhooks/leads", () => {
    it("Crear lead con API key valida retorna 201 con datos correctos", async () => {
      const webhookData = buildWebhookLead("created");

      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", env.WEBHOOK_SECRET)
        .send(webhookData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          idLead: expect.any(String),
          nameLead: webhookData.name,
          emailLead: webhookData.email,
          phoneLead: webhookData.phone,
          sourceLead: webhookData.source,
          statusLead: LeadStatus.nuevo,
          createdAtLead: expect.any(String),
          updatedAtLead: expect.any(String),
        },
      });
    });

    it("Webhook crea actividad tipo webhook automaticamente", async () => {
      const webhookData = buildWebhookLead("activity");

      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", env.WEBHOOK_SECRET)
        .send(webhookData);

      expect(response.status).toBe(201);

      const activities = await prisma.leadActivity.findMany({
        where: {
          leadId: response.body.data.idLead,
        },
      });

      expect(activities).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            leadId: response.body.data.idLead,
            typeLeadActivity: LeadActivityType.webhook,
            noteLeadActivity: `Lead ingresado desde ${webhookData.source}`,
          }),
        ]),
      );
    });

    it("Crear lead solo con campos requeridos retorna 201, phoneLead y sourceLead null", async () => {
      const webhookData = {
        name: `Webhook Lead Required ${testRunId}`,
        email: `${testRunId}-required@example.com`,
      };

      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", env.WEBHOOK_SECRET)
        .send(webhookData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          idLead: expect.any(String),
          nameLead: webhookData.name,
          emailLead: webhookData.email,
          phoneLead: null,
          sourceLead: null,
          statusLead: LeadStatus.nuevo,
        },
      });
    });

    it('Sin API key retorna 401 con message "API Key invalida o ausente"', async () => {
      const response = await request(app)
        .post("/api/webhooks/leads")
        .send(buildWebhookLead("no-api-key"));

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: "API Key invalida o ausente",
      });
    });

    it("API key incorrecta retorna 401", async () => {
      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", "wrong-api-key")
        .send(buildWebhookLead("wrong-api-key"));

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: "API Key invalida o ausente",
      });
    });

    it("Payload sin email retorna 400", async () => {
      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", env.WEBHOOK_SECRET)
        .send({
          name: `Webhook Lead Missing Email ${testRunId}`,
          phone: "555-030-4",
          source: `${testRunId}-missing-email`,
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Email invalido retorna 400", async () => {
      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", env.WEBHOOK_SECRET)
        .send(buildWebhookLead("invalid-email", { email: "invalid-email" }));

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("Payload sin name retorna 400", async () => {
      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", env.WEBHOOK_SECRET)
        .send({
          email: `${testRunId}-missing-name@example.com`,
          phone: "555-030-5",
          source: `${testRunId}-missing-name`,
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it('Name vacio ("") retorna 400', async () => {
      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", env.WEBHOOK_SECRET)
        .send(buildWebhookLead("empty-name", { name: "" }));

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });
  });

  describe("Validaciones de QA", () => {
    it("name con mas de 100 chars retorna 400", async () => {
      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", env.WEBHOOK_SECRET)
        .send(buildWebhookLead("qa-long-name", { name: "a".repeat(101) }));

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("phone con letras retorna 400", async () => {
      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", env.WEBHOOK_SECRET)
        .send(buildWebhookLead("qa-phone-letters", { phone: "abc123" }));

      expect(response).toMatchObject({ status: 400 });
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation error",
      });
    });

    it("source se normaliza a lowercase", async () => {
      const response = await request(app)
        .post("/api/webhooks/leads")
        .set("x-api-key", env.WEBHOOK_SECRET)
        .send(buildWebhookLead("qa-lowercase-source", { source: "LANDING" }));

      expect(response).toMatchObject({ status: 201 });
      expect(response.body).toMatchObject({
        success: true,
        data: {
          sourceLead: "landing",
        },
      });

      const lead = await prisma.lead.findUnique({
        where: {
          idLead: response.body.data.idLead,
        },
      });

      expect(lead).toMatchObject({
        sourceLead: "landing",
      });
    });
  });
});
