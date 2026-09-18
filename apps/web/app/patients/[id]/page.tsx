"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  ShieldAlert, 
  ShieldCheck, 
  HeartPulse, 
  Pill, 
  FileText, 
  AlertCircle, 
  Lock, 
  Calendar, 
  User,
  Activity
} from "lucide-react";
import { useCurrentRole } from "@/lib/role-store";
import { dbService } from "@afyasecure/database";
import { canAccessClinicalData, buildFHIRAuditEvent } from "@afyasecure/auth-rbac";

export default function PatientChartPage() {
  const params = useParams();
  const patientId = params.id as string;
  const { currentRole, currentUserName } = useCurrentRole();

  const patient = dbService.getPatientById(patientId);
  const [logged, setLogged] = useState(false);

  // Evaluate clinical access permissions
  const hasActiveConsent = patient ? patient.consentStatus === "active" : false;
  const accessCheck = canAccessClinicalData(currentRole, hasActiveConsent);

  // Automatically record FHIR AuditEvent for compliance trail
  useEffect(() => {
    if (!patient || logged) return;

    const event = buildFHIRAuditEvent({
      action: "R",
      outcome: accessCheck.allowed ? "0" : "8",
      outcomeDesc: accessCheck.allowed
        ? `Authorized clinical chart access by ${currentRole}`
        : `Unauthorized clinical access blocked: ${accessCheck.reason}`,
      userId: `user-${currentRole.toLowerCase()}`,
      userName: currentUserName,
      userRole: currentRole,
      ipAddress: "192.168.1.104",
      targetResourceId: patient.fhirId,
      targetResourceType: "Patient",
      systemSource: "AfyaSecure-Web-Client",
    });

    dbService.recordAuditEvent(event);
    setLogged(true);
  }, [patient, currentRole, currentUserName, accessCheck.allowed, logged]);

  if (!patient) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Patient Record Not Found</h2>
        <Link href="/patients" className="text-sm text-emerald-600 font-medium hover:underline">
          &larr; Return to Patient Registry
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Page Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/patients"
          className="inline-flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registry</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">Resource: FHIR/Patient/{patient.fhirId}</span>
      </div>

      {/* Patient Demographic Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
            {patient.firstName[0]}
            {patient.lastName[0]}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium border uppercase ${
                  patient.consentStatus === "active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : patient.consentStatus === "restricted"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                Consent: {patient.consentStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              DOB: {patient.dateOfBirth} • Gender: {patient.gender} • County: {patient.county}
            </p>
          </div>
        </div>

        <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
          <div className="text-slate-500">Legal Basis for Processing:</div>
          <div className="font-semibold text-slate-800">{patient.lawfulBasis}</div>
        </div>
      </div>

      {/* ACCESS DENIAL BANNER (When role lacks clearance or consent is revoked) */}
      {!accessCheck.allowed ? (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-6 text-rose-900 shadow-sm space-y-4">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold">Clinical PHI Access Blocked</h2>
              <p className="text-sm leading-relaxed text-rose-800">
                {accessCheck.reason}
              </p>
              <div className="text-xs text-rose-700 pt-2 border-t border-rose-200/60 mt-3 space-y-1">
                <p>
                  <strong>Regulatory Standard Enforced:</strong> Kenya Data Protection Act 2019 (Section 29 - Processing of sensitive personal data; Section 32 - Consent of data subject) &amp; HIPAA Privacy Rule (Minimum Necessary Requirement).
                </p>
                <p className="font-mono text-[11px] text-rose-600">
                  Security Event: AuditEvent generated and logged to DPO audit ledger with outcome code &quot;8&quot; (Authorization Failure).
                </p>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <span className="text-xs text-rose-700 font-medium">
              Tip: Use the role switcher in the top navigation bar to switch to <strong>Doctor</strong> to inspect authorized medical records.
            </span>
          </div>
        </div>
      ) : (
        /* AUTHORIZED CLINICAL DATA VIEW */
        <div className="space-y-6">
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>Clinical Disclosure Authorized:</strong> Session validated against Kenya DPA &amp; HIPAA clinical clearance policy.
              </span>
            </div>
            <span className="font-mono text-[11px] text-emerald-700">AuditEvent Logged: Action=&quot;R&quot;, Outcome=&quot;0&quot;</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vitals */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-slate-800 font-bold">
                <HeartPulse className="w-5 h-5 text-rose-600" />
                <span>Recorded Vitals</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs text-slate-700">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Blood Pressure:</span>
                  <span className="font-semibold text-slate-900">{patient.vitals.bp}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Heart Rate:</span>
                  <span className="font-semibold text-slate-900">{patient.vitals.heartRate} bpm</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Temperature:</span>
                  <span className="font-semibold text-slate-900">{patient.vitals.temp}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Body Weight:</span>
                  <span className="font-semibold text-slate-900">{patient.vitals.weightKg} kg</span>
                </div>
              </div>
            </div>

            {/* Diagnosis & Prescriptions */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <span>Primary Diagnosis</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-sm font-semibold text-slate-800">
                  {patient.diagnosis}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <Pill className="w-5 h-5 text-blue-600" />
                  <span>Prescriptions &amp; Treatment Plan</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs font-mono text-slate-700">
                  {patient.prescriptions}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span>Confidential Clinical Progress Notes</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed bg-amber-50/40 p-3.5 rounded-lg border border-amber-200/50">
                  {patient.clinicalNotes}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
