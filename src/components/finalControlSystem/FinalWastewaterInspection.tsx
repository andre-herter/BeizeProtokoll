import type { ChangeEvent } from "react";
import type {
  FinalControlFormData,
  FinalControlProps,
} from "./FinalControlSystem.types";

interface ExtendedFinalControlProps extends FinalControlProps {
  readOnly?: boolean;
  data?: FinalControlFormData;
  onChange?: (field: keyof FinalControlFormData, value: string) => void;
}

const INITIAL_FORM_STATE: FinalControlFormData = {
  time: "",
  displayedPh: "",
  displayedTemp: "",
  measuredPh: "",
  measuredTemp: "",
  wastewaterCounter: "",
};

export default function FinalWastewaterInspection({
  readOnly = false,
  data,
  onChange,
}: ExtendedFinalControlProps) {
  const currentData: FinalControlFormData = data || INITIAL_FORM_STATE;

  return (
    <section className="mx-auto mb-6 w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="w-full mb-4 flex items-center justify-between gap-2 bg-[#d35400] text-white p-2 sm:p-2.5 rounded-lg shadow-sm">
        <h3 className="text-xs sm:text-sm font-semibold tracking-wide truncate">
          Endkontrolle &amp; Zähler
        </h3>
        {readOnly ? (
          <div className="shrink-0 px-3 py-1 bg-white/10 border border-white/20 rounded-md text-white text-xs sm:text-sm font-medium">
            {currentData.time ? `${currentData.time} Uhr` : "-"}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="time"
              id="time_ek"
              value={currentData.time}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange?.("time", e.target.value)
              }
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Container Layout */}
      <div className="flex flex-col md:flex-row gap-0 rounded-lg border border-slate-200 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Spalte 1: Anzeige-Werte */}
        <div className="flex-1 flex flex-col gap-3 bg-slate-50/50 p-3.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Anzeige-Werte
          </span>

          {readOnly ? (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">
                  pH-Wert Anzeige
                </span>
                <div className="text-base font-semibold text-slate-900">
                  {currentData.displayedPh || "-"}{" "}
                  <span className="text-xs font-normal text-slate-500">pH</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">
                  Temperatur Anzeige
                </span>
                <div className="text-base font-semibold text-slate-900">
                  {currentData.displayedTemp || "-"}{" "}
                  <span className="text-xs font-normal text-slate-500">°C</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="ek_rph"
                  className="block text-xs font-medium text-slate-700 mb-0.5"
                >
                  pH-Wert Anzeige
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="ek_rph"
                  placeholder="pH"
                  value={currentData.displayedPh}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange?.("displayedPh", e.target.value)
                  }
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div>
                <label
                  htmlFor="ek_rtemp"
                  className="block text-xs font-medium text-slate-700 mb-0.5"
                >
                  Temperatur Anzeige
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="ek_rtemp"
                  placeholder="°C"
                  value={currentData.displayedTemp}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange?.("displayedTemp", e.target.value)
                  }
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Spalte 2: Messung */}
        <div className="flex-1 flex flex-col gap-3 bg-slate-50/50 p-3.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Messung
          </span>

          {readOnly ? (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">
                  pH-Wert Gemessen
                </span>
                <div className="text-base font-semibold text-slate-900">
                  {currentData.measuredPh || "-"}{" "}
                  <span className="text-xs font-normal text-slate-500">pH</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">
                  Temperatur Gemessen
                </span>
                <div className="text-base font-semibold text-slate-900">
                  {currentData.measuredTemp || "-"}{" "}
                  <span className="text-xs font-normal text-slate-500">°C</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="ek_mph"
                  className="block text-xs font-medium text-slate-700 mb-0.5"
                >
                  pH-Wert Gemessen
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="ek_mph"
                  placeholder="pH"
                  value={currentData.measuredPh}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange?.("measuredPh", e.target.value)
                  }
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div>
                <label
                  htmlFor="ek_mtemp"
                  className="block text-xs font-medium text-slate-700 mb-0.5"
                >
                  Temperatur Gemessen
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="ek_mtemp"
                  placeholder="°C"
                  value={currentData.measuredTemp}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange?.("measuredTemp", e.target.value)
                  }
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Spalte 3: Zähler */}
        <div className="flex-1 flex flex-col gap-3 bg-slate-50/50 p-3.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Zähler
          </span>

          {readOnly ? (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">
                Abwasserzähler
              </span>
              <div className="text-base font-semibold text-slate-900">
                {currentData.wastewaterCounter || "-"}{" "}
                <span className="text-xs font-normal text-slate-500">m³</span>
              </div>
            </div>
          ) : (
            <div>
              <label
                htmlFor="abwasser"
                className="block text-xs font-medium text-slate-700 mb-0.5"
              >
                Abwasserzähler
              </label>
              <input
                type="number"
                id="abwasser"
                placeholder="Zählerstand"
                value={currentData.wastewaterCounter}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChange?.("wastewaterCounter", e.target.value)
                }
                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
