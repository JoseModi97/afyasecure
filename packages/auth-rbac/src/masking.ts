/**
 * PII Anonymization & Data Minimization Utilities
 * Aligned with Kenya DPA 2019 Section 25 (Principles of Data Protection: Data Minimization & Privacy by Design)
 */

import { UserRole, hasPermission } from "./rbac";

export function maskNationalId(nationalId: string, role: UserRole): string {
  if (hasPermission(role, "PATIENT_PII_UNMASKED")) {
    return nationalId;
  }
  if (!nationalId || nationalId.length < 4) return "****";
  // Show first 2, mask middle, show last 2: e.g. 34****89
  const start = nationalId.slice(0, 2);
  const end = nationalId.slice(-2);
  return `${start}${"*".repeat(Math.max(2, nationalId.length - 4))}${end}`;
}

export function maskPhoneNumber(phone: string, role: UserRole): string {
  if (hasPermission(role, "PATIENT_PII_UNMASKED")) {
    return phone;
  }
  if (!phone || phone.length < 6) return "+254 7** *** ***";
  // e.g. +254 712 *** 890
  const clean = phone.trim();
  return `${clean.slice(0, 7)} *** ${clean.slice(-3)}`;
}

export function maskEmail(email: string, role: UserRole): string {
  if (hasPermission(role, "PATIENT_PII_UNMASKED")) {
    return email;
  }
  if (!email || !email.includes("@")) return "***@***.***";
  const [user, domain] = email.split("@");
  const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : "***";
  return `${maskedUser}@${domain}`;
}
