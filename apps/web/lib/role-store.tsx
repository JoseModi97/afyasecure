"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@afyasecure/auth-rbac";

interface RoleContextType {
  currentRole: UserRole;
  currentUserName: string;
  setRole: (role: UserRole) => void;
}

const ROLE_USER_MAP: Record<UserRole, string> = {
  DOCTOR: "Dr. Evans Kamau, MD (Physician)",
  NURSE: "Nurse Amina Mohamed, BSN (Triage)",
  RECEPTIONIST: "Brian Odhiambo (Front Desk)",
  DPO_AUDITOR: "Adv. Sarah Njeri (Data Protection Officer)",
  PATIENT: "Wanjiku Mwangi (Data Subject)",
};

const RoleContext = createContext<RoleContextType>({
  currentRole: "DOCTOR",
  currentUserName: ROLE_USER_MAP.DOCTOR,
  setRole: () => {},
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<UserRole>("DOCTOR");

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("afyasecure_role", role);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("afyasecure_role") as UserRole;
      if (saved && ROLE_USER_MAP[saved]) {
        setCurrentRoleState(saved);
      }
    }
  }, []);

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        currentUserName: ROLE_USER_MAP[currentRole],
        setRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useCurrentRole() {
  return useContext(RoleContext);
}
