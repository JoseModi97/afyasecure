"use client";

import React from "react";
import Link from "next/link";
import { 
  Users, 
  Eye, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  Unlock, 
  FileLock,
  ArrowRight
} from "lucide-react";
import { useCurrentRole } from "@/lib/role-store";
import { dbService } from "@afyasecure/database";
import { maskNationalId, maskPhoneNumber, maskEmail, hasPermission } from "@afyasecure/auth-rbac";

export default function PatientsDirectoryPage() {
  const { currentRole } = useCurrentRole();
  const patients = dbService.getPatients();

  const canViewUnmasked = hasPermission(currentRole, "PATIENT_PII_UNMASKED");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Nairobi Patient Registry</span>
          </h1>
          <p className="text-sm text-slate-600">
            Outpatient &amp; Inpatient cohort. PII minimization is governed by Kenya Data Protection Act Section 25.
          </p>
        </div>

        {/* PII Minimization Status Pill */}
        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
          canViewUnmasked 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-amber-50 border-amber-200 text-amber-800"
        }`}>
          {canViewUnmasked ? (
            <>
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Clinical Clearance (Unmasked PII)</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Kenya DPA Minimization Active (Masked PII)</span>
            </>
          )}
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {patients.map((patient) => {
          const maskedId = maskNationalId(patient.nationalId, currentRole);
          const maskedPhone = maskPhoneNumber(patient.phone, currentRole);
          const maskedMail = maskEmail(patient.email, currentRole);

          const consentBadgeColor =
            patient.consentStatus === "active"
              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
              : patient.consentStatus === "restricted"
              ? "bg-amber-100 text-amber-800 border-amber-200"
              : "bg-rose-100 text-rose-800 border-rose-200";

          return (
            <div
              key={patient.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {patient.firstName} {patient.lastName}
                    </h2>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-mono text-slate-600">FHIR: {patient.fhirId}</span>
                      <span>•</span>
                      <span>DOB: {patient.dateOfBirth} ({patient.gender})</span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${consentBadgeColor}`}>
                    Consent: {patient.consentStatus}
                  </span>
                </div>

                {/* Identity / PII details */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 text-xs text-slate-700 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">National ID / Huduma:</span>
                    <span className="font-mono font-semibold text-slate-900">{maskedId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center">
                      <Phone className="w-3 h-3 mr-1 text-slate-400" /> Phone:
                    </span>
                    <span className="font-mono">{maskedPhone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center">
                      <Mail className="w-3 h-3 mr-1 text-slate-400" /> Email:
                    </span>
                    <span className="font-mono">{maskedMail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" /> County:
                    </span>
                    <span>{patient.county}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Legal Basis: {patient.lawfulBasis.split("_").slice(0, 3).join(" ")}
                </span>
                <Link
                  href={`/patients/${patient.id}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Access Clinical Chart</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
