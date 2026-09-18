/**
 * Role-Based Access Control (RBAC) & Authorization Matrix
 * Strict alignment with Kenya DPA 2019 (Data Minimization) & HIPAA Minimum Necessary Rule
 */

export type UserRole = "DOCTOR" | "NURSE" | "RECEPTIONIST" | "DPO_AUDITOR" | "PATIENT";

export type Permission = 
  | "PATIENT_DEMOGRAPHICS_READ"
  | "PATIENT_DEMOGRAPHICS_WRITE"
  | "PATIENT_CLINICAL_READ"
  | "PATIENT_CLINICAL_WRITE"
  | "PATIENT_PII_UNMASKED"
  | "AUDIT_LOG_READ"
  | "CONSENT_READ"
  | "CONSENT_WRITE"
  | "DATA_EXPORT";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  DOCTOR: [
    "PATIENT_DEMOGRAPHICS_READ",
    "PATIENT_DEMOGRAPHICS_WRITE",
    "PATIENT_CLINICAL_READ",
    "PATIENT_CLINICAL_WRITE",
    "PATIENT_PII_UNMASKED",
    "CONSENT_READ",
  ],
  NURSE: [
    "PATIENT_DEMOGRAPHICS_READ",
    "PATIENT_CLINICAL_READ",
    "PATIENT_PII_UNMASKED",
    "CONSENT_READ",
  ],
  RECEPTIONIST: [
    "PATIENT_DEMOGRAPHICS_READ",
    "PATIENT_DEMOGRAPHICS_WRITE",
    "CONSENT_READ",
    // Note: No clinical read/write or unmasked sensitive PII
  ],
  DPO_AUDITOR: [
    "AUDIT_LOG_READ",
    "CONSENT_READ",
    "CONSENT_WRITE",
    "DATA_EXPORT",
    "PATIENT_DEMOGRAPHICS_READ",
    // Note: DPO has access to audit trails & consents, but clinical notes remain protected
  ],
  PATIENT: [
    "PATIENT_DEMOGRAPHICS_READ",
    "PATIENT_CLINICAL_READ",
    "CONSENT_READ",
    "CONSENT_WRITE",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function canAccessClinicalData(role: UserRole, hasActiveConsent: boolean): { allowed: boolean; reason: string } {
  if (!hasPermission(role, "PATIENT_CLINICAL_READ")) {
    return {
      allowed: false,
      reason: `Access Denied: Role '${role}' does not possess clinical read authorization.`,
    };
  }

  // Under Kenya DPA Section 32, processing health data requires valid consent (unless emergency override)
  if (!hasActiveConsent && role !== "DOCTOR") {
    return {
      allowed: false,
      reason: `Access Denied: Patient has not granted active consent for data processing under Kenya DPA 2019.`,
    };
  }

  return { allowed: true, reason: "Authorized" };
}
