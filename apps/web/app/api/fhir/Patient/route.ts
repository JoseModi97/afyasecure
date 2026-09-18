import { NextResponse } from "next/server";
import { dbService } from "@afyasecure/database";
import { FHIRPatient } from "@afyasecure/fhir-types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nameQuery = searchParams.get("name")?.toLowerCase();
  const idQuery = searchParams.get("id");

  const patients = dbService.getPatients();

  let filtered = patients;
  if (idQuery) {
    filtered = filtered.filter((p) => p.fhirId === idQuery || p.id === idQuery);
  }
  if (nameQuery) {
    filtered = filtered.filter(
      (p) =>
        p.firstName.toLowerCase().includes(nameQuery) ||
        p.lastName.toLowerCase().includes(nameQuery)
    );
  }

  // Map internal models to standard HL7 FHIR R4 Patient Resources
  const fhirPatients: FHIRPatient[] = filtered.map((p) => ({
    resourceType: "Patient",
    id: p.fhirId,
    active: true,
    identifier: [
      {
        system: "https://health.go.ke/identifiers/national-id",
        value: p.nationalId,
      },
    ],
    name: [
      {
        use: "official",
        family: p.lastName,
        given: [p.firstName],
      },
    ],
    gender: p.gender as "male" | "female" | "other",
    birthDate: p.dateOfBirth,
    telecom: [
      { system: "phone", value: p.phone, use: "mobile" },
      { system: "email", value: p.email, use: "home" },
    ],
    address: [
      {
        city: p.county.split(" ")[0],
        state: p.county,
        country: "KE",
      },
    ],
    extension: [
      {
        url: "https://afyasecure.health/fhir/StructureDefinition/consent-status",
        valueString: p.consentStatus,
      },
      {
        url: "https://afyasecure.health/fhir/StructureDefinition/lawful-basis",
        valueString: p.lawfulBasis,
      },
    ],
  }));

  // Return FHIR Bundle
  return NextResponse.json({
    resourceType: "Bundle",
    type: "searchset",
    total: fhirPatients.length,
    entry: fhirPatients.map((resource) => ({
      fullUrl: `https://api.afyasecure.health/fhir/Patient/${resource.id}`,
      resource,
    })),
  });
}
