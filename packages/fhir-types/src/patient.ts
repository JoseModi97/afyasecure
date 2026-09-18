/**
 * HL7 FHIR R4 Compliant Patient Resource
 * Extended with Kenyan Digital Health identifiers (National ID / Huduma Namba, County)
 */

export interface FHIRIdentifier {
  use?: "usual" | "official" | "temp" | "secondary";
  system: string; // e.g., "urn:oid:2.16.840.1.113883.4.1" or "https://health.go.ke/identifiers/national-id"
  value: string;
}

export interface FHIRHumanName {
  use?: "official" | "usual" | "nickname";
  family: string;
  given: string[];
  prefix?: string[];
}

export interface FHIRContactPoint {
  system: "phone" | "email" | "sms";
  value: string;
  use?: "home" | "work" | "mobile";
}

export interface FHIRAddress {
  use?: "home" | "work";
  line?: string[];
  city?: string;
  state?: string; // County in Kenya (e.g. Nairobi, Kiambu, Kisumu)
  postalCode?: string;
  country?: string;
}

export interface FHIRPatient {
  resourceType: "Patient";
  id: string;
  active: boolean;
  identifier: FHIRIdentifier[];
  name: FHIRHumanName[];
  telecom?: FHIRContactPoint[];
  gender: "male" | "female" | "other" | "unknown";
  birthDate: string; // YYYY-MM-DD
  address?: FHIRAddress[];
  // Kenya DPA & Health Extension
  extension?: Array<{
    url: string;
    valueString?: string;
    valueBoolean?: boolean;
  }>;
}
