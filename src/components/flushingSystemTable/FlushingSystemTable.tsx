import React, { useState, useEffect, type ChangeEvent } from "react";
import type {
  FlushingSystemFormData,
  FlushingSystemRowConfig,
  FlushingSystemRowData,
  FlushingSystemTableProps,
  FlushingSystemInputProps,
} from "./FlushingSystemTable.types";

const FLUSHING_SYSTEM_ROWS: FlushingSystemRowConfig[] = [
  {
    id: "sp1",
    label: "Spüle 1",
    placeholderEc: "mS/cm",
    inputCountDisplayEc: 2,
    disabledFields: ["display_ph"],
    toleranceEc: 1.5,
  },
  {
    id: "sp2",
    label: "Spüle 2",
    disabledFields: ["display_ec", "display_ph"],
  },
  {
    id: "sp3",
    label: "Spüle 3",
    disabledFields: ["display_ec", "display_ph"],
  },
  {
    id: "sp4",
    label: "Spüle 4",
    inputCountDisplayPh: 2,
    disabledFields: ["display_ec"],
    tolerancePh: 0.5,
  },
  {
    id: "sp5",
    label: "Spüle 5",
    placeholderEc: "µS/cm",
    inputCountDisplayEc: 2,
    disabledFields: ["display_ph"],
    toleranceEc: 2.0,
  },
];

const calculateTolerance = (
  displayValue: string | string[],
  sampleValue: string,
  tolerance?: number,
): { status: "ok" | "error" | "neutral"; title: string } => {
  if (tolerance === undefined) return { status: "neutral", title: "" };

  const prVal = parseFloat(sampleValue);
  if (isNaN(prVal)) return { status: "neutral", title: "" };

  let anzSum = 0;
  let anzCount = 0;

  if (Array.isArray(displayValue)) {
    displayValue.forEach((val) => {
      const v = parseFloat(val);
      if (!isNaN(v)) {
        anzSum += v;
        anzCount++;
      }
    });
  } else {
    const v = parseFloat(displayValue);
    if (!isNaN(v)) {
      anzSum = v;
      anzCount = 1;
    }
  }

  if (anzCount === 0) return { status: "neutral", title: "" };

  const anzAvg = anzSum / anzCount;
  const diff = Math.abs(anzAvg - prVal);

  if (diff <= tolerance) {
    return {
      status: "ok",
      title: `OK (Abweichung: ${diff.toFixed(2)} | Max: ±${tolerance})`,
    };
  } else {
    return {
      status: "error",
      title: `Toleranz verletzt! (Abweichung: ${diff.toFixed(2)} | Max: ±${tolerance})`,
    };
  }
};

const createInitialFormData = (): FlushingSystemFormData =>
  FLUSHING_SYSTEM_ROWS.reduce((acc, row) => {
    acc[row.id] = {
      display_ec: row.inputCountDisplayEc
        ? Array(row.inputCountDisplayEc).fill("")
        : "",
      sample_ec: "",
      display_ph: row.inputCountDisplayPh
        ? Array(row.inputCountDisplayPh).fill("")
        : "",
      sample_ph: "",
    };
    return acc;
  }, {} as FlushingSystemFormData);

const mergeInitialFormData = (
  initialData?: Partial<Record<string, Partial<FlushingSystemRowData>>>,
): FlushingSystemFormData => {
  const baseData = createInitialFormData();
  if (!initialData) return baseData;

  const mergedData: FlushingSystemFormData = { ...baseData };

  Object.keys(initialData).forEach((key) => {
    if (mergedData[key]) {
      mergedData[key] = {
        ...mergedData[key],
        ...initialData[key],
      };
    }
  });

  return mergedData;
};

const FlushingSystemInput: React.FC<FlushingSystemInputProps> = ({
  id,
  value,
  onChange,
  isDisabled = false,
  isLastColumn = false,
  placeholder = "-",
  validationStatus = "neutral",
  validationTitle = "",
}) => {
  let statusClasses =
    "bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500";
  if (validationStatus === "ok") {
    statusClasses =
      "bg-green-100 border-green-500 text-green-900 focus:border-green-600 focus:ring-green-500";
  } else if (validationStatus === "error") {
    statusClasses =
      "bg-red-100 border-red-500 text-red-900 focus:border-red-600 focus:ring-red-500";
  }

  return (
    <td
      className={`p-1 sm:p-1.5 border-slate-200 ${!isLastColumn ? "border-r" : ""}`}
    >
      {isDisabled ? (
        <input
          type="text"
          id={id}
          name={id}
          value="X"
          disabled
          className="w-full py-1 bg-slate-100 border border-slate-200 rounded text-center text-slate-400 font-medium cursor-not-allowed select-none text-xs sm:text-sm"
        />
      ) : (
        <input
          type="number"
          step="any"
          placeholder={placeholder}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          title={validationTitle}
          className={`w-full px-1 py-1 rounded text-center font-semibold focus:outline-none focus:ring-1 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm shadow-inner placeholder-slate-400 ${statusClasses}`}
        />
      )}
    </td>
  );
};

export default function FlushingSystemTable({
  initialTime = "",
  initialData,
  onFormChange,
  storageKey = "flushing_system_table_data",
}: FlushingSystemTableProps) {
  // 1. Initialisierung mit Werten aus LocalStorage (falls vorhanden)
  const [time, setTime] = useState<string>(() => {
    if (typeof window === "undefined") return initialTime;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.time !== undefined) return parsed.time;
      }
    } catch (e) {
      console.error("Fehler beim Laden von 'time' aus LocalStorage:", e);
    }
    return initialTime;
  });

  const [formData, setFormData] = useState<FlushingSystemFormData>(() => {
    const baseMerged = mergeInitialFormData(initialData);
    if (typeof window === "undefined") return baseMerged;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.formData) {
          return { ...baseMerged, ...parsed.formData };
        }
      }
    } catch (e) {
      console.error("Fehler beim Laden von 'formData' aus LocalStorage:", e);
    }
    return baseMerged;
  });

  // 2. Automatisches Speichern im LocalStorage bei jeder Änderung
  useEffect(() => {
    try {
      const payload = { time, formData };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.error("Fehler beim Speichern in LocalStorage:", e);
    }
  }, [time, formData, storageKey]);

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    onFormChange?.(newTime, formData);
  };

  const handleInputChange = (
    systemId: string,
    field: keyof FlushingSystemRowData,
    value: string,
    index?: number,
  ) => {
    const currentRow = formData[systemId];
    let updatedFieldValue: string | string[] = value;

    if (typeof index === "number" && Array.isArray(currentRow[field])) {
      const updatedArray = [...(currentRow[field] as string[])];
      updatedArray[index] = value;
      updatedFieldValue = updatedArray;
    }

    const updatedData: FlushingSystemFormData = {
      ...formData,
      [systemId]: {
        ...currentRow,
        [field]: updatedFieldValue,
      },
    };

    setFormData(updatedData);
    onFormChange?.(time, updatedData);
  };

  return (
    <section className="w-full mb-6 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 p-3 sm:p-4">
      <div className="w-full mb-2 flex items-center justify-between gap-2 bg-slate-700 text-white p-3 sm:p-4 rounded-xl shadow-sm">
        <h3 className="text-sm sm:text-base font-semibold tracking-wide truncate">
          Spülteil: Leitwerte, pH - Werte
        </h3>

        <input
          type="time"
          id="time_flushing"
          name="time_flushing"
          value={time}
          onChange={handleTimeChange}
          className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer text-xs sm:text-sm font-medium"
        />
      </div>

      <div className="w-full rounded-lg border border-slate-200 shadow-sm">
        <table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
              <th className="p-2 text-center font-semibold border-r border-slate-200 w-[16%]">
                Spüle
              </th>
              <th className="p-2 text-center font-semibold border-r border-slate-200 w-[21%]">
                Anzeige LW
              </th>
              <th className="p-2 text-center font-semibold border-r border-slate-200 w-[21%]">
                Probe LW
              </th>
              <th className="p-2 text-center font-semibold border-r border-slate-200 w-[21%]">
                Anzeige pH
              </th>
              <th className="p-2 text-center font-semibold w-[21%]">
                Probe pH
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {FLUSHING_SYSTEM_ROWS.map((row) => {
              const rowState = formData[row.id];

              const ecValidation = calculateTolerance(
                rowState?.display_ec,
                rowState?.sample_ec,
                row.toleranceEc,
              );

              const phValidation = calculateTolerance(
                rowState?.display_ph,
                rowState?.sample_ph,
                row.tolerancePh,
              );

              return (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="text-center p-2 font-semibold text-slate-800 border-r border-slate-200 bg-slate-50/50 whitespace-nowrap">
                    {row.label}
                  </td>

                  {/* 1. Anzeige LW */}
                  <td className="p-1 sm:p-1.5 border-r border-slate-200">
                    {row.disabledFields?.includes("display_ec") ? (
                      <input
                        type="text"
                        id={`${row.id}_anz_lw`}
                        name={`${row.id}_anz_lw`}
                        value="X"
                        disabled
                        className="w-full py-1 bg-slate-100 border border-slate-200 rounded text-center text-slate-400 font-medium cursor-not-allowed select-none text-xs sm:text-sm"
                      />
                    ) : row.inputCountDisplayEc &&
                      row.inputCountDisplayEc > 1 ? (
                      <div className="flex gap-1">
                        {Array.from({ length: row.inputCountDisplayEc }).map(
                          (_, idx) => (
                            <input
                              key={idx}
                              type="number"
                              step="any"
                              id={`${row.id}_anz_lw${idx + 1}`}
                              name={`${row.id}_anz_lw${idx + 1}`}
                              placeholder={row.placeholderEc ?? "-"}
                              value={
                                Array.isArray(rowState?.display_ec)
                                  ? rowState.display_ec[idx] || ""
                                  : ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  row.id,
                                  "display_ec",
                                  e.target.value,
                                  idx,
                                )
                              }
                              className="w-1/2 min-w-0 px-0.5 py-1 bg-white border border-slate-300 rounded text-center text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm shadow-inner placeholder-slate-400"
                            />
                          ),
                        )}
                      </div>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        id={`${row.id}_anz_lw`}
                        name={`${row.id}_anz_lw`}
                        placeholder={row.placeholderEc ?? "-"}
                        value={(rowState?.display_ec as string) || ""}
                        onChange={(e) =>
                          handleInputChange(
                            row.id,
                            "display_ec",
                            e.target.value,
                          )
                        }
                        className="w-full px-1 py-1 bg-white border border-slate-300 rounded text-center text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm shadow-inner placeholder-slate-400"
                      />
                    )}
                  </td>

                  {/* 2. Probe LW */}
                  <FlushingSystemInput
                    id={`${row.id}_pr_lw`}
                    value={(rowState?.sample_ec as string) || ""}
                    isDisabled={row.disabledFields?.includes("sample_ec")}
                    validationStatus={ecValidation.status}
                    validationTitle={ecValidation.title}
                    onChange={(e) =>
                      handleInputChange(row.id, "sample_ec", e.target.value)
                    }
                  />

                  {/* 3. Anzeige pH */}
                  <td className="p-1 sm:p-1.5 border-r border-slate-200">
                    {row.disabledFields?.includes("display_ph") ? (
                      <input
                        type="text"
                        id={`${row.id}_anz_ph`}
                        name={`${row.id}_anz_ph`}
                        value="X"
                        disabled
                        className="w-full py-1 bg-slate-100 border border-slate-200 rounded text-center text-slate-400 font-medium cursor-not-allowed select-none text-xs sm:text-sm"
                      />
                    ) : row.inputCountDisplayPh &&
                      row.inputCountDisplayPh > 1 ? (
                      <div className="flex gap-1">
                        {Array.from({ length: row.inputCountDisplayPh }).map(
                          (_, idx) => (
                            <input
                              key={idx}
                              type="number"
                              step="any"
                              id={`${row.id}_anz_ph${idx + 1}`}
                              name={`${row.id}_anz_ph${idx + 1}`}
                              placeholder="-"
                              value={
                                Array.isArray(rowState?.display_ph)
                                  ? rowState.display_ph[idx] || ""
                                  : ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  row.id,
                                  "display_ph",
                                  e.target.value,
                                  idx,
                                )
                              }
                              className="w-1/2 min-w-0 px-0.5 py-1 bg-white border border-slate-300 rounded text-center text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm shadow-inner placeholder-slate-400"
                            />
                          ),
                        )}
                      </div>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        id={`${row.id}_anz_ph`}
                        name={`${row.id}_anz_ph`}
                        placeholder="-"
                        value={(rowState?.display_ph as string) || ""}
                        onChange={(e) =>
                          handleInputChange(
                            row.id,
                            "display_ph",
                            e.target.value,
                          )
                        }
                        className="w-full px-1 py-1 bg-white border border-slate-300 rounded text-center text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm shadow-inner placeholder-slate-400"
                      />
                    )}
                  </td>

                  {/* 4. Probe pH */}
                  <FlushingSystemInput
                    id={`${row.id}_pr_ph`}
                    value={(rowState?.sample_ph as string) || ""}
                    isDisabled={row.disabledFields?.includes("sample_ph")}
                    validationStatus={phValidation.status}
                    validationTitle={phValidation.title}
                    isLastColumn
                    onChange={(e) =>
                      handleInputChange(row.id, "sample_ph", e.target.value)
                    }
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
