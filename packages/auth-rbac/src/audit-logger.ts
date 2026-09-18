import { FHIRAuditEvent, FHIRAuditAction, FHIRAuditOutcome } from "@afyasecure/fhir-types";
import { UserRole } from "./rbac.js";

export interface LogAuditParams {
  id?: string;
  action: FHIRAuditAction;
  outcome: FHIRAuditOutcome;
  outcomeDesc?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  ipAddress?: string;
  targetResourceId: string;
  targetResourceType: "Patient" | "Encounter" | "Consent" | "AuditLog";
  systemSource?: string;
}

export function buildFHIRAuditEvent(params: LogAuditParams): FHIRAuditEvent {
  const now = new Date().toISOString();
  return {
    resourceType: "AuditEvent",
    id: params.id || `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: {
      system: "http://terminology.hl7.org/CodeSystem/audit-event-type",
      code: "phi-access",
      display: "Protected Health Information Access",
    },
    action: params.action,
    recorded: now,
    outcome: params.outcome,
    outcomeDesc: params.outcomeDesc,
    agent: [
      {
        who: {
          reference: `Practitioner/${params.userId}`,
          display: params.userName,
        },
        requestor: true,
        network: {
          address: params.ipAddress || "127.0.0.1",
          type: "2",
        },
        role: [params.userRole],
      },
    ],
    source: {
      site: "Nairobi Central Clinic",
      observer: {
        display: params.systemSource || "AfyaSecure-Core-Gateway",
      },
      type: [
        {
          code: "4",
          display: "Application Server",
        },
      ],
    },
    entity: [
      {
        what: {
          reference: `${params.targetResourceType}/${params.targetResourceId}`,
          display: `${params.targetResourceType} Record`,
        },
        type: {
          code: "2",
          display: "System Object",
        },
        lifecycle: {
          code: params.action === "C" ? "1" : params.action === "R" ? "6" : "3",
          display: params.action === "C" ? "Origination" : params.action === "R" ? "Disclosure" : "Modification",
        },
      },
    ],
  };
}
