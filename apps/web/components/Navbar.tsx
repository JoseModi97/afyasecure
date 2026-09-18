"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, UserCheck, Activity, Users, FileLock, KeyRound } from "lucide-react";
import { useCurrentRole } from "@/lib/role-store";
import { UserRole } from "@afyasecure/auth-rbac";

export function Navbar() {
  const pathname = usePathname();
  const { currentRole, currentUserName, setRole } = useCurrentRole();

  const navLinks = [
    { href: "/", label: "Dashboard", icon: Activity },
    { href: "/patients", label: "Patient Registry", icon: Users },
    { href: "/consent", label: "Consent Ledger", icon: FileLock },
    { href: "/auditor", label: "DPO Audit Trail", icon: ShieldCheck },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Badges */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                A
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">AfyaSecure</span>
                  <span className="text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    MVP
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Kenya DPA 2019 / HIPAA Ready</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher Toolbar */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-1 flex items-center space-x-1 text-xs">
              <span className="text-slate-500 font-medium pl-2 pr-1 flex items-center">
                <KeyRound className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Simulate:
              </span>
              {(["DOCTOR", "NURSE", "RECEPTIONIST", "DPO_AUDITOR"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setRole(role)}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    currentRole === role
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  {role === "DOCTOR"
                    ? "Doctor"
                    : role === "NURSE"
                    ? "Nurse"
                    : role === "RECEPTIONIST"
                    ? "Front Desk"
                    : "DPO Auditor"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Persona Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              Active Session: <strong className="text-white">{currentUserName}</strong>
            </span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 text-[10px] font-mono">
              ROLE: {currentRole}
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-slate-400">
            <span>Nairobi Clinic Instance</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">HL7 FHIR R4 Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}
