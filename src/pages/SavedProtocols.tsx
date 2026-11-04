import React, { useState, useEffect } from "react";
import AcidAnalysis from "../components/acidAnalysis/AcidAnalysis";
import WaterMetrics from "../components/waterMetrics/WaterMetrics";
import DmWaterSystem from "../components/dmWaterSystem/DmWaterSystem";
import FlushingSystemTable from "../components/flushingSystemTable/FlushingSystemTable";
import FinalWastewaterInspection from "../components/finalControlSystem/FinalWastewaterInspection";
import type { AcidAnalysisData } from "../components/acidAnalysis/AcidAnalysis.types";
import type { DmWaterStreetOption } from "../components/dmWaterSystem/DmWaterSystem.types";
import type { FlushingSystemFormData } from "../components/flushingSystemTable/FlushingSystemTable.types";

// --- TypeScript Interfaces ---
export interface ProtocolEntry {
  id: string | number;
  date: string;
  zeiten: {
    beizbad: string;
    wasser: string;
    spuele: string;
    ve: string;
    ek: string;
  };
  beize: {
    time?: string;
    data?: AcidAnalysisData;
    beiz1?: [string, string, string, string];
    beiz3?: [string, string, string, string];
  };
  wasser: {
    ve_h2o: string;
    ko_val: string;
  };
  spuelen: FlushingSystemFormData | Record<string, unknown>;
  ve_str: {
    strasse: string;
    rlw: string;
    mlw: string;
  };
  endkontrolle: {
    displayPh: string;
    displayTemp: string;
    measuredPh: string;
    measuredTemp: string;
    wastewaterCounter: string;
  };
}

interface SavedProtocolsProps {
  onBack?: () => void;
}

// --- Hauptkomponente ---
export const SavedProtocols: React.FC<SavedProtocolsProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<ProtocolEntry[]>(() => {
    const storedLogs = window.localStorage.getItem("chemData");
    if (storedLogs) {
      try {
        return JSON.parse(storedLogs);
      } catch (e) {
        console.error("Fehler beim Parsen von chemData", e);
      }
    }
    return [];
  });

  // Synchronisation bei localStorage-Änderungen über andere Tabs/Komponenten hinweg
  useEffect(() => {
    const handleStorageChange = () => {
      const storedLogs = window.localStorage.getItem("chemData");
      if (storedLogs) {
        try {
          setLogs(JSON.parse(storedLogs));
        } catch (e) {
          console.error("Fehler beim Parsen", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const deleteEntry = (id: string | number) => {
    if (!window.confirm("Möchtest du dieses Protokoll wirklich löschen?"))
      return;

    const updatedLogs = logs.filter(
      (item) => item.id.toString() !== id.toString(),
    );
    setLogs(updatedLogs);
    window.localStorage.setItem("chemData", JSON.stringify(updatedLogs));
  };

  return (
    <div className="max-w-162.5 bg-[#f4f6f9] font-sans min-h-screen p-5  mx-auto">
      {/* Navigation */}
      <nav className="mb-5 text-center">
        {onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 font-bold text-[#2c3e50] bg-[#e2e8f0] hover:bg-slate-300 px-4 py-2 rounded transition-colors cursor-pointer"
          >
            ⬅ Zurück zum Hauptformular
          </button>
        ) : (
          <a
            href="/"
            className="inline-flex items-center gap-2 no-underline font-bold text-[#2c3e50] bg-[#e2e8f0] hover:bg-slate-300 px-4 py-2 rounded transition-colors"
          >
            ⬅ Zurück zum Hauptformular
          </a>
        )}
      </nav>

      {/* Überschrift */}
      <h2 className="flex items-center justify-center mb-5 text-2xl font-bold text-[#2c3e50]">
        Gespeicherte Protokolle
        <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700 ml-2">
          {logs.length}
        </span>
      </h2>

      {/* Archiv-Container */}
      <div id="archiv-container" className="space-y-6">
        {logs.length === 0 ? (
          <p className="text-center p-5 bg-white rounded shadow text-slate-500 italic">
            Keine gespeicherten Protokolle vorhanden.
          </p>
        ) : (
          logs.map((item) => {
            // Daten für AcidAnalysis aufbereiten
            let beizData: AcidAnalysisData = {
              bath1: { disp_hcl: "", disp_fe: "", meas_hcl: "", meas_fe: "" },
              bath3: { disp_hcl: "", disp_fe: "", meas_hcl: "", meas_fe: "" },
            };

            if (item.beize?.data) {
              beizData = item.beize.data;
            } else if (item.beize?.beiz1 || item.beize?.beiz3) {
              beizData = {
                bath1: {
                  disp_hcl: item.beize.beiz1?.[0] || "",
                  disp_fe: item.beize.beiz1?.[1] || "",
                  meas_hcl: item.beize.beiz1?.[2] || "",
                  meas_fe: item.beize.beiz1?.[3] || "",
                },
                bath3: {
                  disp_hcl: item.beize.beiz3?.[0] || "",
                  disp_fe: item.beize.beiz3?.[1] || "",
                  meas_hcl: item.beize.beiz3?.[2] || "",
                  meas_fe: item.beize.beiz3?.[3] || "",
                },
              };
            }

            const beizTime = item.beize?.time || item.zeiten?.beizbad || "-";

            return (
              <div
                key={item.id}
                className="bg-white border border-[#ccc] p-4 mx-auto mb-5 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.08)] w-full box-border"
              >
                {/* Header mit Datum und Löschen-Button */}
                <div className="flex justify-between items-center border-b-2 border-[#2c3e50] pb-1.5 mb-3">
                  <span className="font-bold text-[1.1em] text-[#2c3e50]">
                    📅 PROTOKOLL VOM: {item.date || "-"}
                  </span>
                  <button
                    onClick={() => deleteEntry(item.id)}
                    className="bg-[#e74c3c] hover:bg-red-600 text-white border-none py-1.5 px-3 rounded cursor-pointer font-bold text-[0.85em] transition-colors"
                  >
                    🗑️ Löschen
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 text-[0.9em] leading-normal w-full">
                  {/* 1. Säureanalyse (Read-Only) */}
                  <AcidAnalysis
                    readOnly={true}
                    time={beizTime}
                    data={beizData}
                  />

                  {/* 2. Spülen-Tabelle (Wiederverwendbare Komponente im Read-Only Modus) */}
                  <FlushingSystemTable
                    readOnly={true}
                    initialTime={item.zeiten?.spuele || ""}
                    initialData={item.spuelen as FlushingSystemFormData}
                  />

                  {/* 3. VE-Anlage (Read-Only) */}
                  <DmWaterSystem
                    readOnly={true}
                    data={{
                      street:
                        (item.ve_str?.strasse as DmWaterStreetOption) || "",
                      time: item.zeiten?.ve || "",
                      displayEc: item.ve_str?.rlw || "",
                      sampleEc: item.ve_str?.mlw || "",
                    }}
                  />

                  {/* 4. Wasserwerte Hüttenflur (Read-Only) */}
                  <WaterMetrics
                    readOnly={true}
                    time={item.zeiten?.wasser}
                    data={{
                      time: item.zeiten?.wasser || "",
                      veWater: item.wasser?.ve_h2o || "",
                      koValue: item.wasser?.ko_val || "",
                    }}
                  />

                  {/* 5. Endkontrolle (Read-Only) */}
                  <FinalWastewaterInspection
                    readOnly={true}
                    data={{
                      time: item.zeiten?.ek || "",
                      displayedPh: item.endkontrolle?.displayPh || "",
                      displayedTemp: item.endkontrolle?.displayTemp || "",
                      measuredPh: item.endkontrolle?.measuredPh || "",
                      measuredTemp: item.endkontrolle?.measuredTemp || "",
                      wastewaterCounter:
                        item.endkontrolle?.wastewaterCounter || "",
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavedProtocols;
