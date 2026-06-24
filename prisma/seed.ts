import "dotenv/config";

import { fakerES_MX as faker } from "@faker-js/faker";
import { LeadActivityType, LeadStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../src/shared/prisma";

const leadSources = [
  "Youtube",
  "Google",
  "Landing",
  "TikTok",
  "Instagram",
  "Facebook",
  "Referido",
] as const;

const leadStatuses: LeadStatus[] = [
  ...Array<LeadStatus>(15).fill(LeadStatus.nuevo),
  ...Array<LeadStatus>(12).fill(LeadStatus.contactado),
  ...Array<LeadStatus>(10).fill(LeadStatus.calificado),
  ...Array<LeadStatus>(8).fill(LeadStatus.convertido),
  ...Array<LeadStatus>(5).fill(LeadStatus.perdido),
];

const contactNotes = [
  "Se realizo primer contacto por telefono",
  "Se contacto por WhatsApp y solicito mas informacion",
  "Respondio al correo inicial y pidio una llamada",
  "Se agendo llamada de descubrimiento",
];

const qualifiedNotes = [
  "Cliente interesado en servicio de automatizacion, solicita cotizacion",
  "Cliente interesado en CRM, solicita propuesta formal",
  "Cliente interesado en integracion con sistemas internos",
  "Cliente interesado en servicio de marketing, solicita cotizacion",
];

const convertedNotes = [
  "Cliente firmo contrato, inicio de proyecto",
  "Cliente aprobo propuesta y realizo pago inicial",
  "Cliente confirmo alcance y se programo kickoff",
  "Cliente acepto terminos y se activo el servicio",
];

const lostNotes = [
  "No respondio despues de 3 intentos",
  "Eligio competencia",
  "Presupuesto insuficiente para continuar",
  "Proyecto pausado por decision interna",
];

type LeadActivitySeed = {
  typeLeadActivity: LeadActivityType;
  noteLeadActivity: string;
  createdAtLeadActivity: Date;
};

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const nextActivityDate = (leadCreatedAt: Date, activityIndex: number) => {
  return addDays(
    leadCreatedAt,
    activityIndex + faker.number.int({ min: 1, max: 3 }),
  );
};

const createStatusActivity = (
  status: LeadStatus,
  createdAtLeadActivity: Date,
): LeadActivitySeed => ({
  typeLeadActivity: LeadActivityType.status_change,
  noteLeadActivity: `Estado cambiado a ${status}`,
  createdAtLeadActivity,
});

const createNoteActivity = (
  noteLeadActivity: string,
  createdAtLeadActivity: Date,
): LeadActivitySeed => ({
  typeLeadActivity: LeadActivityType.note,
  noteLeadActivity,
  createdAtLeadActivity,
});

const buildActivities = (
  statusLead: LeadStatus,
  sourceLead: string,
  createdAtLead: Date,
): LeadActivitySeed[] => {
  const activities: LeadActivitySeed[] = [
    {
      typeLeadActivity: LeadActivityType.webhook,
      noteLeadActivity: `Lead ingresado desde ${sourceLead}`,
      createdAtLeadActivity: nextActivityDate(createdAtLead, 0),
    },
  ];

  if (statusLead === LeadStatus.nuevo) {
    return activities;
  }

  activities.push(
    createStatusActivity(
      LeadStatus.contactado,
      nextActivityDate(createdAtLead, activities.length),
    ),
    createNoteActivity(
      faker.helpers.arrayElement(contactNotes),
      nextActivityDate(createdAtLead, activities.length + 1),
    ),
  );

  if (statusLead === LeadStatus.contactado) {
    return activities;
  }

  if (statusLead === LeadStatus.perdido) {
    activities.push(
      createStatusActivity(
        LeadStatus.perdido,
        nextActivityDate(createdAtLead, activities.length),
      ),
      createNoteActivity(
        faker.helpers.arrayElement(lostNotes),
        nextActivityDate(createdAtLead, activities.length + 1),
      ),
    );

    return activities;
  }

  activities.push(
    createStatusActivity(
      LeadStatus.calificado,
      nextActivityDate(createdAtLead, activities.length),
    ),
    createNoteActivity(
      faker.helpers.arrayElement(qualifiedNotes),
      nextActivityDate(createdAtLead, activities.length + 1),
    ),
  );

  if (statusLead === LeadStatus.calificado) {
    return activities;
  }

  activities.push(
    createStatusActivity(
      LeadStatus.convertido,
      nextActivityDate(createdAtLead, activities.length),
    ),
    createNoteActivity(
      faker.helpers.arrayElement(convertedNotes),
      nextActivityDate(createdAtLead, activities.length + 1),
    ),
  );

  return activities;
};

const createMexicanPhoneNumber = () => {
  const phoneNumber = faker.phone.number({ style: "international" });

  if (phoneNumber.startsWith("+52")) {
    return phoneNumber;
  }

  return `+52 ${faker.string.numeric(2)} ${faker.string.numeric(4)} ${faker.string.numeric(4)}`;
};

const createLeadData = (statusLead: LeadStatus) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const nameLead = `${firstName} ${lastName}`;
  const sourceLead = faker.helpers.arrayElement(leadSources);
  const createdAtLead = faker.date.recent({ days: 90 });

  return {
    nameLead,
    emailLead: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phoneLead: createMexicanPhoneNumber(),
    sourceLead,
    statusLead,
    createdAtLead,
    activities: {
      create: buildActivities(statusLead, sourceLead, createdAtLead),
    },
  };
};

const main = async () => {
  const email = "admin@example.com";
  const passwordHash = await bcrypt.hash("admin12345", 10);

  const user = await prisma.user.upsert({
    where: { emailUser: email },
    update: {},
    create: {
      emailUser: email,
      passwordHashUser: passwordHash,
    },
  });

  const expiredToken = jwt.sign(
    {
      idUser: user.idUser,
      emailUser: user.emailUser,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1s" },
  );

  await prisma.leadActivity.deleteMany();
  await prisma.lead.deleteMany();

  const shuffledStatuses: LeadStatus[] = faker.helpers.shuffle(leadStatuses);

  await prisma.$transaction(async (transaction) => {
    for (const statusLead of shuffledStatuses) {
      await transaction.lead.create({
        data: createLeadData(statusLead),
      });
    }
  });

  const statusDistribution = shuffledStatuses.reduce<
    Record<LeadStatus, number>
  >(
    (distribution, statusLead) => ({
      ...distribution,
      [statusLead]: distribution[statusLead] + 1,
    }),
    {
      [LeadStatus.nuevo]: 0,
      [LeadStatus.contactado]: 0,
      [LeadStatus.calificado]: 0,
      [LeadStatus.convertido]: 0,
      [LeadStatus.perdido]: 0,
    },
  );

  console.log("\n========================================");
  console.log("  Credenciales del usuario demo:");
  console.log("  Email: admin@example.com");
  console.log("  Password: admin12345");
  console.log("========================================");
  console.log("\n  Token expirado para pruebas:");
  console.log(`  ${expiredToken}`);
  console.log("========================================");
  console.log(`\n  Leads creados: ${shuffledStatuses.length}`);
  console.log("  Distribucion por status:");
  console.log(`  nuevo: ${statusDistribution.nuevo}`);
  console.log(`  contactado: ${statusDistribution.contactado}`);
  console.log(`  calificado: ${statusDistribution.calificado}`);
  console.log(`  convertido: ${statusDistribution.convertido}`);
  console.log(`  perdido: ${statusDistribution.perdido}`);
  console.log("========================================\n");
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
