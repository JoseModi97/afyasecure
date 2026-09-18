import { NextResponse } from "next/server";
import { dbService } from "@afyasecure/database";
import { FHIRAuditEvent } from "@afyasecure/fhir-types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const outcome = searchParams.get("outcome");

  let events = dbService.getAuditEvents();
  if (outcome) {
    events = events.filter((e) => e.outcome === outcome);
  }

  return NextResponse.json({
    resourceType: "Bundle",
    type: "searchset",
    total: events.length,
    entry: events.map((ev) => ({
      fullUrl: `https://api.afyasecure.health/fhir/AuditEvent/${ev.id}`,
      resource: ev,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as FHIRAuditEvent;

    if (!payload || payload.resourceType !== "AuditEvent") {
      return NextResponse.json(
        { error: "Invalid FHIR AuditEvent resource payload." },
        { status: 400 }
      );
    }

    const recorded = dbService.recordAuditEvent(payload);
    return NextResponse.json(recorded, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
