import { useState, type ChangeEvent } from "react";
import type {
  FinalControlFormData,
  FinalControlProps,
} from "./FinalControlSystem.types";

const LOCAL_STORAGE_KEY = "final_control_form_data";

const INITIAL_FORM_STATE: FinalControlFormData = {
  time: "",
  displayedPh: "",
  displayedTemp: "",
  measuredPh: "",
  measuredTemp: "",
  wastewaterCounter: "",
};

export default function FinalWastewaterInspection({
  initialValues,
  onFormChange,
}: FinalControlProps) {
  const [formData, setFormData] = useState<FinalControlFormData>(() => {
    let savedData: Partial<FinalControlFormData> = {};

    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (item) {
          savedData = JSON.parse(item) as FinalControlFormData;
        }
      } catch (error) {
        console.error("Fehler beim Laden aus dem localStorage:", error);
      }
    }

    return {
      ...INITIAL_FORM_STATE,
      ...initialValues,
      ...savedData,
    };
  });

  const handleChange = (field: keyof FinalControlFormData, value: string) => {
    setFormData((prevData) => {
      const updatedData: FinalControlFormData = {
        ...prevData,
        [field]: value,
      };

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
      } catch (error) {
        console.error("Fehler beim Speichern in den localStorage:", error);
      }

      onFormChange?.(updatedData);
      return updatedData;
    });
  };

  return (
    <section className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="w-full mb-4 flex items-center justify-between gap-2 bg-[#d35400] text-white p-2 sm:p-2.5 rounded-lg shadow-sm">
        <h3 className="text-xs sm:text-sm font-semibold tracking-wide truncate">
          Endkontrolle &amp; Zähler
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="time"
            id="time_ek"
            value={formData.time}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange("time", e.target.value)
            }
            className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-0 rounded-lg border border-slate-200 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="flex-1 flex flex-col gap-2 bg-slate-50/50 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Anzeige-Werte
          </span>
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
              value={formData.displayedPh}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("displayedPh", e.target.value)
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
              value={formData.displayedTemp}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("displayedTemp", e.target.value)
              }
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 bg-slate-50/50 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Messung
          </span>
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
              value={formData.measuredPh}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("measuredPh", e.target.value)
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
              value={formData.measuredTemp}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("measuredTemp", e.target.value)
              }
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 bg-slate-50/50 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Zähler
          </span>
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
              value={formData.wastewaterCounter}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("wastewaterCounter", e.target.value)
              }
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
