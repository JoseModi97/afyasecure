"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Activity, 
  Lock, 
  FileLock,
  ArrowRight, 
  CheckCircle2, 
  Database, 
  Cpu, 
  Layers,
  FileCode2,
  Server
} from "lucide-react";
import { useCurrentRole } from "@/lib/role-store";

export default function HomePage() {
  const { currentRole } = useCurrentRole();

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-96 h-96" />
        </div>
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1 text-xs text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Demonstration Suite: Nairobi Healthcare MVP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Healthcare Security &amp; Compliance Engine
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Engineered with strict adherence to the <strong>Kenya Data Protection Act 2019</strong> and <strong>HIPAA Security Standards</strong>. 
            Featuring Role-Based Access Control (RBAC), immutable HL7 FHIR <code>AuditEvent</code> trails, real-time PII minimization, and Cloudflare Edge deployment.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/patients"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <span>Explore Patient Registry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auditor"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-sm px-4 py-2.5 rounded-lg transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Inspect DPO Audit Trail</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Compliance & System Health Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Kenya DPA 2019 Status</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">Compliant</div>
          <p className="text-xs text-slate-500">Sec 25, 29, 32 controls enforced</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">HL7 FHIR Interoperability</span>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">R4 Ready</div>
          <p className="text-xs text-slate-500">Patient &amp; AuditEvent endpoints live</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Database &amp; Cloud</span>
            <Database className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">PostgreSQL</div>
          <p className="text-xs text-slate-500">Cloudflare Pages + Serverless DB</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Role</span>
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{currentRole}</div>
          <p className="text-xs text-slate-500">Use toolbar above to switch roles</p>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Dynamic PII Minimization</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In accordance with Section 25 of the Kenya Data Protection Act, personal identifiers (Kenyan National ID, phone numbers) are masked in real time depending on user permissions.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link href="/patients" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center">
              Test PII Masking <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Immutable Audit Trail</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every read, update, or unauthorized access attempt automatically creates an immutable HL7 FHIR <code>AuditEvent</code> log with user context, IP address, and outcome code.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link href="/auditor" className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center">
              View DPO Logs <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <FileLock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Patient Consent Ledger</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Under Kenya DPA Section 32, patients hold the right to grant, restrict, or revoke consent for processing their sensitive health records, immediately blocking clinical sharing.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link href="/consent" className="text-xs font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center">
              Manage Consents <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Monorepo Architecture Blueprint */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-slate-700" />
          <span>Technical Architecture &amp; Repository Map</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center space-x-1">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span>apps/web</span>
            </div>
            <p className="text-slate-600 font-sans">Next.js 14+ App Router, Tailwind CSS, Cloudflare Pages Edge ready, FHIR REST routes.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center space-x-1">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>packages/database</span>
            </div>
            <p className="text-slate-600 font-sans">Drizzle ORM, PostgreSQL schema, migrations, and Nairobi clinic seed data.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center space-x-1">
              <FileCode2 className="w-3.5 h-3.5 text-slate-500" />
              <span>packages/fhir-types</span>
            </div>
            <p className="text-slate-600 font-sans">HL7 FHIR R4 interfaces for Patient, AuditEvent, and Consent resources.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
