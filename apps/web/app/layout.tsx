import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { RoleProvider } from "@/lib/role-store";

export const metadata: Metadata = {
  title: "AfyaSecure - Healthcare Security & Kenya DPA 2019 / HIPAA MVP",
  description: "Secure, compliant full-stack healthcare platform engineered for the Nairobi healthcare ecosystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <RoleProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 space-y-1">
              <p>
                <strong>AfyaSecure</strong> — Compliant with the <em>Kenya Data Protection Act 2019 (Sections 25, 29, 32)</em> &amp; <em>HIPAA Security Rules</em>.
              </p>
              <p className="text-slate-400">
                Monorepo Architecture (Turborepo + Next.js + PostgreSQL + HL7 FHIR + Cloudflare Edge Ready)
              </p>
            </div>
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}
