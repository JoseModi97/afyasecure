import { SEED_PATIENTS, SEED_USERS } from "./seed-data";
import { FHIRAuditEvent, FHIRPatient, FHIRConsent } from "@afyasecure/fhir-types";

// In-memory store for instant zero-config evaluation and demo
let patientStore = [...SEED_PATIENTS];
let auditEventsStore: FHIRAuditEvent[] = [
  {
    resourceType: "AuditEvent",
    id: "audit-init-001",
    type: {
      system: "http://terminology.hl7.org/CodeSystem/audit-event-type",
      code: "phi-access",
      display: "Protected Health Information Access",
    },
    action: "R",
    recorded: new Date(Date.now() - 3600000).toISOString(),
    outcome: "0",
    outcomeDesc: "Authorized clinical review by attending physician",
    agent: [
      {
        who: {
          reference: "Practitioner/doc-kamau-01",
          display: "Dr. Evans Kamau, MD",
        },
        requestor: true,
        network: { address: "192.168.10.42", type: "2" },
        role: ["DOCTOR"],
      },
    ],
    source: {
      site: "Nairobi Central Clinic",
      observer: { display: "AfyaSecure-Gateway" },
    },
    entity: [
      {
        what: { reference: "Patient/patient-kenya-001", display: "Wanjiku Mwangi" },
        type: { code: "2", display: "System Object" },
      },
    ],
  },
  {
    resourceType: "AuditEvent",
    id: "audit-init-002",
    type: {
      system: "http://terminology.hl7.org/CodeSystem/audit-event-type",
      code: "phi-access",
      display: "Unauthorized Access Blocked (Kenya DPA 2019)",
    },
    action: "R",
    recorded: new Date(Date.now() - 1800000).toISOString(),
    outcome: "8",
    outcomeDesc: "Access Denied: Role 'RECEPTIONIST' attempted to query restricted clinical diagnosis for Patient 003",
    agent: [
      {
        who: {
          reference: "Practitioner/rec-brian-03",
          display: "Brian Odhiambo",
        },
        requestor: true,
        network: { address: "192.168.10.15", type: "2" },
        role: ["RECEPTIONIST"],
      },
    ],
    source: {
      site: "Nairobi Central Clinic",
      observer: { display: "AfyaSecure-RBAC-Guard" },
    },
    entity: [
      {
        what: { reference: "Patient/patient-kenya-003", display: "Fatuma Hassan" },
        type: { code: "2", display: "System Object" },
      },
    ],
  },
];

export const dbService = {
  getPatients: () => patientStore,
  getPatientById: (id: string) => patientStore.find((p) => p.id === id || p.fhirId === id),
  updateConsentStatus: (patientId: string, status: "active" | "restricted" | "revoked") => {
    const p = patientStore.find((item) => item.id === patientId || item.fhirId === patientId);
    if (p) {
      p.consentStatus = status;
      p.allowClinicalSharing = status === "active";
    }
    return p;
  },
  getAuditEvents: () => auditEventsStore,
  recordAuditEvent: (event: FHIRAuditEvent) => {
    auditEventsStore.unshift(event);
    return event;
  },
  getUsers: () => SEED_USERS,
  getUserById: (id: string) => SEED_USERS.find((u) => u.id === id),
};
