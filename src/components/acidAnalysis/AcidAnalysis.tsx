import { useState, useEffect, type ChangeEvent } from "react";
import type {
  AcidAnalysisData,
  BathId,
  MetricField,
} from "./AcidAnalysis.types";

// Keys für den localStorage definieren
const STORAGE_KEY_DATA = "acid_analysis_data";
const STORAGE_KEY_TIME = "acid_analysis_time";

const INITIAL_DATA: AcidAnalysisData = {
  bath1: { disp_hcl: "", disp_fe: "", meas_hcl: "", meas_fe: "" },
  bath3: { disp_hcl: "", disp_fe: "", meas_hcl: "", meas_fe: "" },
};

export default function AcidAnalysis() {
  // 1. State für Uhrzeit: Lädt gespeicherten Wert oder startet leer
  const [time, setTime] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY_TIME) || "";
    }
    return "";
  });

  // 2. State für Tabellendaten: Lädt gespeichertes JSON oder nutzt Standardwerte
  const [data, setData] = useState<AcidAnalysisData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        try {
          return JSON.parse(saved) as AcidAnalysisData;
        } catch (error) {
          console.error(
            "Fehler beim Laden der Säureanalyse-Daten aus dem localStorage:",
            error,
          );
        }
      }
    }
    return INITIAL_DATA;
  });

  // 3. Effect: Speichert die Uhrzeit automatisch bei jeder Änderung
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TIME, time);
  }, [time]);

  // 4. Effect: Speichert das Daten-Objekt automatisch bei jeder Änderung
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
  }, [data]);

  const handleInputChange = (
    bath: BathId,
    field: MetricField,
    value: string,
  ): void => {
    setData((prev) => ({
      ...prev,
      [bath]: {
        ...prev[bath],
        [field]: value,
      },
    }));
  };

  const rows: { id: BathId; label: string }[] = [
    { id: "bath1", label: "BB1" },
    { id: "bath3", label: "BB3" },
  ];

  const fields: MetricField[] = ["disp_hcl", "disp_fe", "meas_hcl", "meas_fe"];

  return (
    <section className="w-full mb-6 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="w-full flex items-center justify-between gap-2 bg-[#2c3e50] text-white p-3 sm:p-4 rounded-xl shadow-sm">
          <h3 className="text-sm sm:text-lg font-semibold tracking-wide text-white truncate">
            Säureanalyse
          </h3>

          <input
            type="time"
            id="time_beizbad"
            name="time_beizbad"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-slate-300 rounded-md text-slate-900 text-xs sm:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th
                rowSpan={2}
                className="p-4 font-semibold text-slate-700 border-r border-slate-200 align-middle"
              >
                Bad
              </th>
              <th
                colSpan={2}
                className="p-2 text-center font-semibold text-slate-700 border-r border-slate-200"
              >
                Anzeige
              </th>
              <th
                colSpan={2}
                className="p-2 text-center font-semibold text-slate-700"
              >
                Gemessen
              </th>
            </tr>

            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-2 text-center font-medium text-slate-600 border-r border-slate-200">
                HCl
              </th>
              <th className="p-2 text-center font-medium text-slate-600 border-r border-slate-200">
                Fe
              </th>
              <th className="p-2 text-center font-medium text-slate-600 border-r border-slate-200">
                HCl
              </th>
              <th className="p-2 text-center font-medium text-slate-600">Fe</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="text-center p-4 font-medium text-slate-900 border-r border-slate-200 bg-slate-50/30">
                  {row.label}
                </td>

                {fields.map((field, index) => {
                  const inputId = `${row.id}_${field}`;

                  return (
                    <td
                      key={field}
                      className={`p-1 sm:p-2 border-slate-200 ${index < 3 ? "border-r" : ""}`}
                    >
                      <input
                        type="number"
                        step="0.01"
                        placeholder="-"
                        id={inputId}
                        name={inputId}
                        value={data[row.id][field]}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(row.id, field, e.target.value)
                        }
                        className="w-full px-1 sm:px-2 py-1 bg-white border border-slate-300 rounded text-center text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm shadow-inner"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
