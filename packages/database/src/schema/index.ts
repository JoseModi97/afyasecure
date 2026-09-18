import { pgTable, text, timestamp, boolean, jsonb, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(), // DOCTOR, NURSE, RECEPTIONIST, DPO_AUDITOR, PATIENT
  department: text("department").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  fhirId: text("fhir_id").notNull().unique(),
  nationalId: text("national_id").notNull(), // Kenya National ID / Huduma Namba
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(), // YYYY-MM-DD
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  county: text("county").notNull(), // e.g. Nairobi, Kiambu, Machakos
  emergencyContact: text("emergency_contact").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const encounters = pgTable("encounters", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => patients.id).notNull(),
  practitionerId: text("practitioner_id").notNull(),
  practitionerName: text("practitioner_name").notNull(),
  encounterDate: timestamp("encounter_date").defaultNow().notNull(),
  encounterType: text("encounter_type").notNull(), // Consultation, Follow-up, Triage
  diagnosis: text("diagnosis").notNull(), // PHI
  clinicalNotes: text("clinical_notes").notNull(), // Highly sensitive PHI
  prescriptions: text("prescriptions").notNull(),
  vitals: jsonb("vitals").$type<{ bp: string; heartRate: number; temp: string; weightKg: number }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const consents = pgTable("consents", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => patients.id).notNull(),
  status: text("status").notNull(), // active, revoked, restricted
  lawfulBasis: text("lawful_basis").notNull(), // e.g. Kenya_DPA_Sec_32_Explicit_Consent
  allowClinicalSharing: boolean("allow_clinical_sharing").default(true).notNull(),
  allowAnalyticsResearch: boolean("allow_analytics_research").default(false).notNull(),
  validUntil: text("valid_until").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  fhirAuditId: text("fhir_audit_id").notNull().unique(),
  recorded: timestamp("recorded").defaultNow().notNull(),
  action: text("action").notNull(), // C, R, U, D, E
  outcome: text("outcome").notNull(), // 0 = Success, 8 = Auth Failure
  outcomeDesc: text("outcome_desc"),
  actorId: text("actor_id").notNull(),
  actorName: text("actor_name").notNull(),
  actorRole: text("actor_role").notNull(),
  ipAddress: text("ip_address").notNull(),
  targetResourceType: text("target_resource_type").notNull(),
  targetResourceId: text("target_resource_id").notNull(),
  fhirPayload: jsonb("fhir_payload").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
