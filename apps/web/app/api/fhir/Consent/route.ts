import { NextResponse } from "next/server";
import { dbService } from "@afyasecure/database";
import { FHIRConsent } from "@afyasecure/fhir-types";

export async function GET() {
  const patients = dbService.getPatients();

  const fhirConsents: FHIRConsent[] = patients.map((p) => ({
    resourceType: "Consent",
    id: `consent-${p.fhirId}`,
    status: p.consentStatus === "active" ? "active" : p.consentStatus === "restricted" ? "proposed" : "rejected",
    scope: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/consentscope",
          code: "patient-privacy",
          display: "Privacy Consent under Kenya DPA 2019",
        },
      ],
    },
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/consentcategorycodes",
            code: "research",
            display: "Clinical Processing & Health Exchange",
          },
        ],
      },
    ],
    patient: {
      reference: `Patient/${p.fhirId}`,
      display: `${p.firstName} ${p.lastName}`,
    },
    dateTime: new Date().toISOString(),
    provision: {
      type: p.allowClinicalSharing ? "permit" : "deny",
      action: [
        {
          coding: [{ code: "read", display: "Read Clinical Record" }],
        },
        {
          coding: [{ code: "export", display: "Cross-Border / 3rd-Party Export" }],
        },
      ],
    },
  }));

  return NextResponse.json({
    resourceType: "Bundle",
    type: "searchset",
    total: fhirConsents.length,
    entry: fhirConsents.map((c) => ({
      fullUrl: `https://api.afyasecure.health/fhir/Consent/${c.id}`,
      resource: c,
    })),
  });
}
