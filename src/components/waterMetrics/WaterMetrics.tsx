import type { ChangeEvent } from "react";

export interface WaterMetricsData {
  time: string;
  veWater: string;
  koValue: string;
}

interface WaterMetricsProps {
  readOnly?: boolean;
  time?: string;
  data?: WaterMetricsData;
  onTimeChange?: (newTime: string) => void;
  onChange?: (field: keyof WaterMetricsData, value: string) => void;
}

export default function WaterMetrics({
  readOnly = false,
  time,
  data,
  onTimeChange,
  onChange,
}: WaterMetricsProps) {
  const currentTime = time !== undefined ? time : "";
  const currentData: WaterMetricsData = data || {
    time: "",
    veWater: "",
    koValue: "",
  };

  return (
    <section className="w-full mb-6 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 p-6">
      <div className="w-full flex items-center justify-between gap-2 bg-gray-400 text-white p-3 sm:p-4 rounded-xl shadow-sm">
        <h3 className="text-sm sm:text-lg font-semibold tracking-wide text-white truncate">
          Wasserwerte Hüttenflur
        </h3>

        {readOnly ? (
          <div className="shrink-0 px-3 py-1 bg-white/10 border border-white/20 rounded-md text-white text-xs sm:text-base font-medium">
            {currentTime ? `${currentTime} Uhr` : "-"}
          </div>
        ) : (
          <input
            type="time"
            id="time_wasser"
            name="time_wasser"
            value={currentTime}
            onChange={(e) => onTimeChange?.(e.target.value)}
            className="shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 text-xs sm:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
          />
        )}
      </div>

      <div className="space-y-4 mt-1.5">
        <div className="flex flex-col">
          <label
            htmlFor="ve_h2o"
            className="text-sm font-medium text-sky-800 mb-2"
          >
            VE-Wasser / KO-Wert
          </label>

          {readOnly ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 p-3.5 bg-slate-50/60 border border-sky-100 rounded-xl">
                <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                  VE-Wasser
                </span>
                <div className="text-base sm:text-lg font-medium text-slate-800">
                  {currentData.veWater || "-"}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    µS/cm
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 p-3.5 bg-slate-50/60 border border-sky-100 rounded-xl">
                <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                  KO-Wert
                </span>
                <div className="text-base sm:text-lg font-medium text-slate-800">
                  {currentData.koValue || "-"}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    µS/cm
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  id="ve_h2o"
                  name="ve_h2o"
                  placeholder="VE"
                  value={currentData.veWater}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange?.("veWater", e.target.value)
                  }
                  className="w-full rounded-xl border border-sky-200 px-4 py-3 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  id="ko_val"
                  name="ko_val"
                  placeholder="KO"
                  value={currentData.koValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange?.("koValue", e.target.value)
                  }
                  className="w-full rounded-xl border border-sky-200 px-4 py-3 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
