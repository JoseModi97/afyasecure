"use client";

import React, { useState } from "react";
import { 
  FileLock, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Scale,
  Calendar,
  Lock
} from "lucide-react";
import { dbService } from "@afyasecure/database";

export default function ConsentLedgerPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const patients = dbService.getPatients();

  const handleUpdateConsent = (patientId: string, newStatus: "active" | "restricted" | "revoked") => {
    dbService.updateConsentStatus(patientId, newStatus);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <FileLock className="w-6 h-6 text-purple-600" />
          <span>Kenya DPA 2019 Patient Consent Ledger</span>
        </h1>
        <p className="text-sm text-slate-600">
          Section 32 enforcement: Every patient maintains statutory rights to grant, restrict, or revoke lawful data processing.
        </p>
      </div>

      {/* Regulatory Context Callout */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-xs text-purple-900 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-sm text-purple-950">
          <Scale className="w-4 h-4 text-purple-700" />
          <span>Statutory Compliance: Kenya Data Protection Act 2019 (Section 26 &amp; Section 32)</span>
        </div>
        <p className="leading-relaxed">
          In Kenya, processing sensitive health data without an active lawful basis or valid consent constitutes a regulatory breach punishable under Section 73. 
          When a patient toggles their consent to <strong>Restricted</strong> or <strong>Revoked</strong>, AfyaSecure immediately limits clinical data sharing and generates an alert.
        </p>
      </div>

      {/* Consent Cards */}
      <div className="space-y-4">
        {patients.map((patient) => {
          return (
            <div
              key={patient.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h2 className="text-base font-bold text-slate-900">
                    {patient.firstName} {patient.lastName}
                  </h2>
                  <span className="font-mono text-xs text-slate-500">
                    ID: {patient.nationalId.slice(0, 2)}****{patient.nationalId.slice(-2)}
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>
                    <strong>Lawful Basis:</strong>{" "}
                    <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">
                      {patient.lawfulBasis}
                    </code>
                  </div>
                  <div>
                    <strong>Third-Party Health Exchange:</strong>{" "}
                    {patient.allowClinicalSharing ? (
                      <span className="text-emerald-700 font-semibold">Authorized</span>
                    ) : (
                      <span className="text-rose-700 font-semibold">Restricted / Prohibited</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleUpdateConsent(patient.id, "active")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    patient.consentStatus === "active"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Active Consent
                </button>

                <button
                  onClick={() => handleUpdateConsent(patient.id, "restricted")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    patient.consentStatus === "restricted"
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Restricted
                </button>

                <button
                  onClick={() => handleUpdateConsent(patient.id, "revoked")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    patient.consentStatus === "revoked"
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Revoked
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
