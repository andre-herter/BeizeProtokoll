import { useState, useEffect } from "react";

export default function WaterMetrics() {
  const [time, setTime] = useState(() => {
    return localStorage.getItem("water_time") || "";
  });
  const [veWater, setVeWater] = useState(() => {
    return localStorage.getItem("water_ve") || "";
  });
  const [koValue, setKoValue] = useState(() => {
    return localStorage.getItem("water_ko") || "";
  });

  useEffect(() => {
    localStorage.setItem("water_time", time);
  }, [time]);

  useEffect(() => {
    localStorage.setItem("water_ve", veWater);
  }, [veWater]);

  useEffect(() => {
    localStorage.setItem("water_ko", koValue);
  }, [koValue]);

  return (
    <section className=" w-full mb-6 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 p-6">
      <div className="w-full flex items-center justify-between gap-2 bg-gray-400 text-white p-3 sm:p-4 rounded-xl shadow-sm">
        <h3 className="text-sm sm:text-lg font-semibold tracking-wide text-white truncate">
          Wasserwerte Hüttenflur
        </h3>

        <input
          type="time"
          id="time_wasser"
          value={time}
          onChange={(e) => setTime(e.target.value)}
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
                value={veWater}
                onChange={(e) => setVeWater(e.target.value)}
                className="w-full rounded-xl border border-sky-200 px-4 py-3 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.01"
                id="ko_val"
                placeholder="KO"
                value={koValue}
                onChange={(e) => setKoValue(e.target.value)}
                className="w-full rounded-xl border border-sky-200 px-4 py-3 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
