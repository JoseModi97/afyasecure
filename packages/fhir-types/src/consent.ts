/**
 * HL7 FHIR R4 Compliant Consent Resource
 * Implements legal processing grounds under Kenya Data Protection Act 2019 (Section 32)
 */

export type FHIRConsentStatus = "draft" | "proposed" | "active" | "rejected" | "inactive" | "entered-in-error";

export interface FHIRConsentScope {
  coding: Array<{
    system: string;
    code: "patient-privacy" | "research" | "treatment";
    display: string;
  }>;
}

export interface FHIRConsentProvision {
  type: "deny" | "permit";
  period?: {
    start: string;
    end?: string;
  };
  actor?: Array<{
    role: {
      coding: Array<{
        code: string;
        display: string;
      }>;
    };
    reference: {
      display: string;
    };
  }>;
  action?: Array<{
    coding: Array<{
      code: "read" | "write" | "disclose" | "export";
      display: string;
    }>;
  }>;
  purpose?: Array<{
    code: string;
    display: string;
  }>;
}

export interface FHIRConsent {
  resourceType: "Consent";
  id: string;
  status: FHIRConsentStatus;
  scope: FHIRConsentScope;
  category: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  patient: {
    reference: string;
    display: string;
  };
  dateTime: string;
  performer?: Array<{
    reference: string;
    display: string;
  }>;
  organization?: Array<{
    reference: string;
    display: string;
  }>;
  provision: FHIRConsentProvision;
}
