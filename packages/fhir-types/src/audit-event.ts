/**
 * HL7 FHIR R4 Compliant AuditEvent Resource
 * Used for immutable compliance trails under Kenya DPA 2019 & HIPAA Security Rule (45 CFR § 164.312(b))
 */

export type FHIRAuditAction = "C" | "R" | "U" | "D" | "E"; // Create, Read, Update, Delete, Execute

export type FHIRAuditOutcome = 
  | "0" // Success
  | "4" // Minor failure (e.g. invalid query)
  | "8" // Serious failure (e.g. unauthorized access attempt)
  | "12"; // Major failure (security breach alert)

export interface FHIRAuditAgent {
  type?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  who?: {
    reference?: string; // e.g. "Practitioner/dr-kamau"
    display: string;
  };
  requestor: boolean;
  network?: {
    address: string; // IP Address
    type?: "1" | "2" | "5"; // 1: Machine name, 2: IP Address, 5: URI
  };
  role?: string[]; // e.g. ["DOCTOR", "DPO_AUDITOR"]
}

export interface FHIRAuditSource {
  site?: string;
  observer: {
    display: string;
  };
  type?: Array<{
    code: string;
    display: string;
  }>;
}

export interface FHIRAuditEntity {
  what?: {
    reference: string; // e.g. "Patient/p-001" or "Encounter/e-042"
    display?: string;
  };
  type?: {
    code: string; // e.g. "2" for Patient / System Object
    display: string;
  };
  lifecycle?: {
    code: string;
    display: string;
  };
  detail?: Array<{
    type: string;
    valueString: string;
  }>;
}

export interface FHIRAuditEvent {
  resourceType: "AuditEvent";
  id: string;
  type: {
    system: string;
    code: "rest" | "phi-access" | "auth" | "consent-override";
    display: string;
  };
  action: FHIRAuditAction;
  period?: {
    start: string;
  };
  recorded: string; // ISO-8601 Timestamp
  outcome: FHIRAuditOutcome;
  outcomeDesc?: string;
  agent: FHIRAuditAgent[];
  source: FHIRAuditSource;
  entity?: FHIRAuditEntity[];
}
