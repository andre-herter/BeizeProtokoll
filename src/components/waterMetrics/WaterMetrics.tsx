import { useState, useEffect } from "react";
interface WaterMetricsData {
  time: string;
  veWater: string;
  koValue: string;
}

const STORAGE_KEY = "water_metrics_data";

export default function WaterMetrics() {
  const [data, setData] = useState<WaterMetricsData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null) {
          return {
            time: parsed.time || "",
            veWater: parsed.veWater || "",
            koValue: parsed.koValue || "",
          };
        }
      }
    } catch (e) {
      console.error("Fehler beim Laden der Wasserwerte:", e);
    }

    return { time: "", veWater: "", koValue: "" };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleChange = (field: keyof WaterMetricsData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="w-full mb-6 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 p-6">
      <div className="w-full flex items-center justify-between gap-2 bg-gray-400 text-white p-3 sm:p-4 rounded-xl shadow-sm">
        <h3 className="text-sm sm:text-lg font-semibold tracking-wide text-white truncate">
          Wasserwerte Hüttenflur
        </h3>

        <input
          type="time"
          id="time_wasser"
          value={data.time}
          onChange={(e) => handleChange("time", e.target.value)}
          className="shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 text-xs sm:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
        />
      </div>

      <div className="space-y-4 mt-1.5">
        <div className="flex flex-col">
          <label
            htmlFor="ve_h2o"
            className="text-sm font-medium text-sky-800 mb-2"
          >
            VE-Wasser / KO-Wert
          </label>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="number"
                step="0.01"
                id="ve_h2o"
                placeholder="VE"
                value={data.veWater}
                onChange={(e) => handleChange("veWater", e.target.value)}
                className="w-full rounded-xl border border-sky-200 px-4 py-3 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.01"
                id="ko_val"
                placeholder="KO"
                value={data.koValue}
                onChange={(e) => handleChange("koValue", e.target.value)}
                className="w-full rounded-xl border border-sky-200 px-4 py-3 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
