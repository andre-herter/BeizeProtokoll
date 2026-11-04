import type { ChangeEvent } from "react";
import type {
  BathId,
  MetricField,
  AcidAnalysisData,
} from "./AcidAnalysis.types";

interface AcidAnalysisProps {
  readOnly?: boolean;
  time?: string;
  data?: AcidAnalysisData;
  onTimeChange?: (newTime: string) => void;
  onInputChange?: (bath: BathId, field: MetricField, value: string) => void;
}

interface RowConfig {
  id: BathId;
  label: string;
  toleranceHcl?: number;
  toleranceFe?: number;
}

const rows: RowConfig[] = [
  { id: "bath1", label: "BB1", toleranceHcl: 10, toleranceFe: 20 },
  { id: "bath3", label: "BB3", toleranceHcl: 10, toleranceFe: 20 },
];

const fields: MetricField[] = ["disp_hcl", "disp_fe", "meas_hcl", "meas_fe"];

const calculateTolerance = (
  displayValue: string,
  sampleValue: string,
  tolerance?: number,
): { status: "ok" | "error" | "neutral"; title: string } => {
  if (tolerance === undefined) return { status: "neutral", title: "" };

  const dispVal = parseFloat(displayValue);
  const measVal = parseFloat(sampleValue);
  if (isNaN(dispVal) || isNaN(measVal)) return { status: "neutral", title: "" };

  const diff = Math.abs(dispVal - measVal);

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

const getStatusClasses = (
  status: "ok" | "error" | "neutral",
  isInput = true,
) => {
  if (status === "ok") {
    return isInput
      ? "bg-green-100 border-green-500 text-green-900 focus:border-green-600 focus:ring-green-500"
      : "font-semibold text-green-900 bg-green-100 border border-green-400 px-2 py-0.5 rounded block text-center";
  }
  if (status === "error") {
    return isInput
      ? "bg-red-100 border-red-500 text-red-900 focus:border-red-600 focus:ring-red-500"
      : "font-semibold text-red-900 bg-red-100 border border-red-400 px-2 py-0.5 rounded block text-center";
  }
  return isInput
    ? "bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
    : "text-slate-700 text-center block";
};

export default function AcidAnalysis({
  readOnly = false,
  time = "",
  data,
  onTimeChange,
  onInputChange,
}: AcidAnalysisProps) {
  const defaultData: AcidAnalysisData = {
    bath1: { disp_hcl: "", disp_fe: "", meas_hcl: "", meas_fe: "" },
    bath3: { disp_hcl: "", disp_fe: "", meas_hcl: "", meas_fe: "" },
  };

  const currentData = data || defaultData;

  return (
    <section className="w-full mb-6 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="w-full flex items-center justify-between gap-2 bg-yellow-500 text-white p-3 sm:p-4 rounded-xl shadow-sm">
          <h3 className="text-sm sm:text-lg font-semibold tracking-wide text-white truncate">
            Säureanalyse
          </h3>

          {readOnly ? (
            <div className="shrink-0 px-3 py-1 bg-white/10 border border-white/20 rounded-md text-white text-xs sm:text-base font-medium">
              {time ? `${time} Uhr` : "-"}
            </div>
          ) : (
            <input
              type="time"
              id="time_beizbad"
              name="time_beizbad"
              value={time}
              onChange={(e) => onTimeChange?.(e.target.value)}
              className="shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-slate-300 rounded-md text-slate-900 text-xs sm:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
            />
          )}
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
            {rows.map((row) => {
              const bData = currentData[row.id] || {
                disp_hcl: "",
                disp_fe: "",
                meas_hcl: "",
                meas_fe: "",
              };

              const hclValidation = calculateTolerance(
                bData.disp_hcl,
                bData.meas_hcl,
                row.toleranceHcl,
              );

              const feValidation = calculateTolerance(
                bData.disp_fe,
                bData.meas_fe,
                row.toleranceFe,
              );

              return (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="text-center p-4 font-medium text-slate-900 border-r border-slate-200 bg-slate-50/30">
                    {row.label}
                  </td>

                  {fields.map((field, index) => {
                    const inputId = `${row.id}_${field}`;
                    const value = bData[field] || "";
                    const isMeasHcl = field === "meas_hcl";
                    const isMeasFe = field === "meas_fe";

                    const validation = isMeasHcl
                      ? hclValidation
                      : isMeasFe
                        ? feValidation
                        : { status: "neutral" as const, title: "" };

                    const displayValue = value || "-";

                    return (
                      <td
                        key={field}
                        className={`p-1 sm:p-2 border-slate-200 text-center ${
                          index < 3 ? "border-r" : ""
                        }`}
                      >
                        {readOnly ? (
                          <span
                            className={getStatusClasses(
                              validation.status,
                              false,
                            )}
                            title={validation.title}
                          >
                            {displayValue}
                          </span>
                        ) : (
                          <input
                            type="number"
                            step="0.01"
                            placeholder="-"
                            id={inputId}
                            name={inputId}
                            value={value}
                            title={validation.title}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              onInputChange?.(row.id, field, e.target.value)
                            }
                            className={`w-full px-1 sm:px-2 py-1 rounded text-center text-slate-900 focus:outline-none focus:ring-1 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm shadow-inner ${getStatusClasses(
                              validation.status,
                              true,
                            )}`}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
