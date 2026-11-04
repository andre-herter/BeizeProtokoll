import type { ChangeEvent } from "react";
import type {
  DmWaterFormData,
  DmWaterStreetOption,
  DmWaterSystemProps,
} from "./DmWaterSystem.types";

interface ExtendedDmWaterSystemProps extends DmWaterSystemProps {
  readOnly?: boolean;
  data?: DmWaterFormData;
  onChange?: (field: keyof DmWaterFormData, value: string) => void;
}

const INITIAL_DM_WATER_FORM_STATE: DmWaterFormData = {
  street: "",
  time: "",
  displayEc: "",
  sampleEc: "",
};

export default function DmWaterSystem({
  readOnly = false,
  data,
  onChange,
}: ExtendedDmWaterSystemProps) {
  const currentData: DmWaterFormData = data || INITIAL_DM_WATER_FORM_STATE;

  return (
    <section className="w-full mb-6 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 p-4">
      <div className="w-full mb-4 flex flex-row  justify-center gap-3 bg-[#8e44ad] text-white p-2.5 sm:p-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold tracking-wide truncate">
            VE-Anlage
          </h3>
          {readOnly && currentData.street && (
            <span className="text-[10px] sm:text-xs bg-white/20 px-2 py-0.5 rounded font-medium truncate">
              {currentData.street}
            </span>
          )}
        </div>

        {readOnly ? (
          <div className="shrink-0 px-2.5 py-1 bg-white/10 border border-white/20 rounded-md text-white text-xs sm:text-sm font-medium">
            {currentData.time ? `${currentData.time} Uhr` : "-"}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <select
              id="select_ve_strasse"
              name="street"
              value={currentData.street}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onChange?.("street", e.target.value as DmWaterStreetOption)
              }
              className="px-1.5 sm:px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-900 text-[11px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
              required
            >
              <option value="" disabled>
                Bitte wählen
              </option>
              <option value="strasse_1">Straße 1</option>
              <option value="strasse_2">Straße 2</option>
            </select>

            <input
              type="time"
              id="time_ve"
              name="time"
              value={currentData.time}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange?.("time", e.target.value)
              }
              className="px-1.5 sm:px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-900 text-[11px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {readOnly ? (
          <>
            <div className="flex flex-col gap-1.5 p-3 bg-slate-50/50 border border-slate-200 rounded-lg">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Leitwert Anzeige
              </span>
              <div className="text-base font-semibold text-slate-900">
                {currentData.displayEc || "-"}{" "}
                <span className="text-xs font-normal text-slate-500">
                  µS/cm
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 p-3 bg-slate-50/50 border border-slate-200 rounded-lg">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Leitwert Gemessen
              </span>
              <div className="text-base font-semibold text-slate-900">
                {currentData.sampleEc || "-"}{" "}
                <span className="text-xs font-normal text-slate-500">
                  µS/cm
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="ve_rlw"
                className="text-sm font-medium text-slate-700"
              >
                Leitwert Anzeige
              </label>
              <input
                type="number"
                step="0.01"
                id="ve_rlw"
                name="displayEc"
                placeholder="µS/cm"
                value={currentData.displayEc}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChange?.("displayEc", e.target.value)
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm shadow-inner placeholder-slate-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="ve_mlw"
                className="text-sm font-medium text-slate-700"
              >
                Leitwert Gemessen
              </label>
              <input
                type="number"
                step="0.01"
                id="ve_mlw"
                name="sampleEc"
                placeholder="µS/cm"
                value={currentData.sampleEc}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChange?.("sampleEc", e.target.value)
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm shadow-inner placeholder-slate-400"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
