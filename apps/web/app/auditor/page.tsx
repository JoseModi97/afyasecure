"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  Filter, 
  Clock, 
  User, 
  Terminal, 
  CheckCircle, 
  AlertTriangle,
  FileJson,
  Search
} from "lucide-react";
import { dbService } from "@afyasecure/database";
import { FHIRAuditEvent } from "@afyasecure/fhir-types";

export default function AuditorPortalPage() {
  const [filter, setFilter] = useState<"ALL" | "SUCCESS" | "FAILURE">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<FHIRAuditEvent | null>(null);

  const events = dbService.getAuditEvents();

  const filteredEvents = events.filter((ev) => {
    const matchesFilter =
      filter === "ALL"
        ? true
        : filter === "SUCCESS"
        ? ev.outcome === "0"
        : ev.outcome !== "0";

    const matchesSearch =
      searchTerm === "" ||
      ev.agent[0]?.who?.display.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.agent[0]?.role?.[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.outcomeDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const downloadAuditJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `afyasecure-audit-log-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>Data Protection Officer (DPO) Audit Ledger</span>
          </h1>
          <p className="text-sm text-slate-600">
            Immutable HL7 FHIR <code>AuditEvent</code> log for Kenya Data Protection Act 2019 &amp; HIPAA compliance oversight.
          </p>
        </div>

        <button
          onClick={downloadAuditJSON}
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export FHIR JSON Log</span>
        </button>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search actor, role, or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Outcome:</span>
          {(["ALL", "SUCCESS", "FAILURE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === f
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "ALL" ? "All Events" : f === "SUCCESS" ? "Authorized (0)" : "Security Alerts (8+)"}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              No audit records match the current criteria.
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const isSuccess = ev.outcome === "0";
              const isSelected = selectedEvent?.id === ev.id;

              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`bg-white rounded-xl border p-4 shadow-sm cursor-pointer transition-all hover:border-slate-400 ${
                    isSelected ? "ring-2 ring-emerald-600 border-emerald-600" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 p-1.5 rounded-lg ${isSuccess ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {isSuccess ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">
                            {ev.agent[0]?.who?.display || "Unknown Actor"}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {ev.agent[0]?.role?.[0] || "USER"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {ev.outcomeDesc || "Access logged"}
                        </p>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2 font-mono">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(ev.recorded).toLocaleTimeString()} ({new Date(ev.recorded).toLocaleDateString()})
                          </span>
                          <span>IP: {ev.agent[0]?.network?.address || "127.0.0.1"}</span>
                          <span>Action: {ev.action}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        isSuccess
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      Outcome: {ev.outcome}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Audit Inspector Panel */}
        <div className="bg-slate-900 rounded-xl p-5 text-slate-200 shadow-md flex flex-col h-fit space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <FileJson className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-white">
                FHIR AuditEvent Inspector
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">R4 JSON</span>
          </div>

          {selectedEvent ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-300">
                Event ID: <span className="font-mono text-emerald-400">{selectedEvent.id}</span>
              </div>
              <pre className="bg-slate-950 p-3 rounded-lg text-[11px] font-mono overflow-x-auto text-emerald-300 max-h-[500px]">
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <Terminal className="w-8 h-8 text-slate-700 mx-auto" />
              <p>Select any audit record on the left to inspect its raw HL7 FHIR payload.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
