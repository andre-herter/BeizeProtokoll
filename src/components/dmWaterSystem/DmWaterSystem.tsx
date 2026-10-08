import { useState, type ChangeEvent } from "react";
import type {
  DmWaterFormData,
  DmWaterStreetOption,
  DmWaterSystemProps,
} from "./DmWaterSystem.types";

const LOCAL_STORAGE_KEY = "dm_water_form_data";

const INITIAL_DM_WATER_FORM_STATE: DmWaterFormData = {
  street: "",
  time: "",
  displayEc: "",
  sampleEc: "",
};

export default function DmWaterSystem({
  initialValues,
  onFormChange,
}: DmWaterSystemProps) {
  const [formData, setFormData] = useState<DmWaterFormData>(() => {
    let savedData: Partial<DmWaterFormData> = {};

    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (item) {
          savedData = JSON.parse(item) as DmWaterFormData;
        }
      } catch (error) {
        console.error("Fehler beim Laden aus dem localStorage:", error);
      }
    }

    return {
      ...INITIAL_DM_WATER_FORM_STATE,
      ...initialValues,
      ...savedData,
    };
  });

  const handleInputChange = (field: keyof DmWaterFormData, value: string) => {
    setFormData((prevData) => {
      const updatedData: DmWaterFormData = {
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
    <section className="w-full mt-6 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 p-4">
      <div className="w-full mb-2 flex items-center justify-between gap-2 bg-[#8e44ad] text-white p-2 sm:p-2.5 rounded-lg shadow-sm">
        <h3 className="text-xs sm:text-sm font-semibold tracking-wide truncate">
          VE-Anlage
        </h3>

        <select
          id="select_ve_strasse"
          name="street"
          value={formData.street}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleInputChange("street", e.target.value as DmWaterStreetOption)
          }
          className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
          required
        >
          <option value="" disabled>
            Bitte auswählen
          </option>
          <option value="strasse_1">Straße 1</option>
          <option value="strasse_2">Straße 2</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="time"
            id="time_ve"
            name="time"
            value={formData.time}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("time", e.target.value)
            }
            className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            value={formData.displayEc}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("displayEc", e.target.value)
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
            value={formData.sampleEc}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("sampleEc", e.target.value)
            }
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm shadow-inner placeholder-slate-400"
          />
        </div>
      </div>
    </section>
  );
}
