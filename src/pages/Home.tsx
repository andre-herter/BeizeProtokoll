import { useState, useEffect } from "react";
import AcidAnalysis from "../components/acidAnalysis/AcidAnalysis";
import ArchivButton from "../components/buttons/ArchivButton.tsx";
import ResetButton from "../components/buttons/ResetButton.tsx";
import DmWaterSystem from "../components/dmWaterSystem/DmWaterSystem";
import FinalWastewaterInspection from "../components/finalControlSystem/FinalWastewaterInspection.tsx";
import FlushingSystemTable from "../components/flushingSystemTable/FlushingSystemTable";
import Navbar from "../components/navbar/Navbar";
import WaterMetrics, {
  type WaterMetricsData,
} from "../components/waterMetrics/WaterMetrics";
import type {
  BathId,
  MetricField,
  AcidAnalysisData,
} from "../components/acidAnalysis/AcidAnalysis.types";
import type { DmWaterFormData } from "../components/dmWaterSystem/DmWaterSystem.types";
import type { FinalControlFormData } from "../components/finalControlSystem/FinalControlSystem.types";
import type {
  FlushingSystemFormData,
  FlushingSystemRowData,
} from "../components/flushingSystemTable/FlushingSystemTable.types";

const STORAGE_KEY_ACID = "acid_analysis_combined_data";
const STORAGE_KEY_WATER = "water_metrics_data";
const STORAGE_KEY_DM_WATER = "dm_water_form_data";
const STORAGE_KEY_FINAL_CONTROL = "final_control_form_data";
const STORAGE_KEY_FLUSHING = "flushing_system_table_data";

const ALL_STORAGE_KEYS = [
  STORAGE_KEY_ACID,
  STORAGE_KEY_WATER,
  STORAGE_KEY_DM_WATER,
  STORAGE_KEY_FINAL_CONTROL,
  STORAGE_KEY_FLUSHING,
];

interface AcidAnalysisState {
  time: string;
  data: AcidAnalysisData;
}

interface FlushingSystemState {
  time: string;
  formData: FlushingSystemFormData;
}

const INITIAL_ACID_STATE: AcidAnalysisState = {
  time: "",
  data: {
    bath1: { disp_hcl: "", disp_fe: "", meas_hcl: "", meas_fe: "" },
    bath3: { disp_hcl: "", disp_fe: "", meas_hcl: "", meas_fe: "" },
  },
};

const INITIAL_WATER_STATE: WaterMetricsData = {
  time: "",
  veWater: "",
  koValue: "",
};

const INITIAL_DM_WATER_STATE: DmWaterFormData = {
  street: "",
  time: "",
  displayEc: "",
  sampleEc: "",
};

const INITIAL_FINAL_CONTROL_STATE: FinalControlFormData = {
  time: "",
  displayedPh: "",
  displayedTemp: "",
  measuredPh: "",
  measuredTemp: "",
  wastewaterCounter: "",
};

const INITIAL_FLUSHING_FORM_DATA: FlushingSystemFormData = {
  sp1: { display_ec: ["", ""], sample_ec: "", display_ph: "", sample_ph: "" },
  sp2: { display_ec: "", sample_ec: "", display_ph: "", sample_ph: "" },
  sp3: { display_ec: "", sample_ec: "", display_ph: "", sample_ph: "" },
  sp4: { display_ec: "", sample_ec: "", display_ph: ["", ""], sample_ph: "" },
  sp5: { display_ec: ["", ""], sample_ec: "", display_ph: "", sample_ph: "" },
};

const INITIAL_FLUSHING_STATE: FlushingSystemState = {
  time: "",
  formData: INITIAL_FLUSHING_FORM_DATA,
};

function Home() {
  const [formKey, setFormKey] = useState<number>(0);

  const [acidState, setAcidState] = useState<AcidAnalysisState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_ACID);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed === "object" && parsed !== null) {
            return {
              time: parsed.time || "",
              data: parsed.data || INITIAL_ACID_STATE.data,
            };
          }
        } catch (error) {
          console.error(
            "Fehler beim Laden von acid_analysis_combined_data:",
            error,
          );
        }
      }
    }
    return INITIAL_ACID_STATE;
  });

  const [waterState, setWaterState] = useState<WaterMetricsData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_WATER);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed === "object" && parsed !== null) {
            return {
              time: parsed.time || "",
              veWater: parsed.veWater || "",
              koValue: parsed.koValue || "",
            };
          }
        } catch (error) {
          console.error("Fehler beim Laden von water_metrics_data:", error);
        }
      }
    }
    return INITIAL_WATER_STATE;
  });

  const [dmWaterState, setDmWaterState] = useState<DmWaterFormData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_DM_WATER);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed === "object" && parsed !== null) {
            return {
              street: parsed.street || "",
              time: parsed.time || "",
              displayEc: parsed.displayEc || "",
              sampleEc: parsed.sampleEc || "",
            };
          }
        } catch (error) {
          console.error("Fehler beim Laden von dm_water_form_data:", error);
        }
      }
    }
    return INITIAL_DM_WATER_STATE;
  });

  const [finalControlState, setFinalControlState] =
    useState<FinalControlFormData>(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY_FINAL_CONTROL);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (typeof parsed === "object" && parsed !== null) {
              return {
                time: parsed.time || "",
                displayedPh: parsed.displayedPh || "",
                displayedTemp: parsed.displayedTemp || "",
                measuredPh: parsed.measuredPh || "",
                measuredTemp: parsed.measuredTemp || "",
                wastewaterCounter: parsed.wastewaterCounter || "",
              };
            }
          } catch (error) {
            console.error(
              "Fehler beim Laden von final_control_form_data:",
              error,
            );
          }
        }
      }
      return INITIAL_FINAL_CONTROL_STATE;
    });

  const [flushingState, setFlushingState] = useState<FlushingSystemState>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY_FLUSHING);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (typeof parsed === "object" && parsed !== null) {
              return {
                time: parsed.time || "",
                formData: {
                  ...INITIAL_FLUSHING_FORM_DATA,
                  ...(parsed.formData || {}),
                },
              };
            }
          } catch (error) {
            console.error(
              "Fehler beim Laden von flushing_system_table_data:",
              error,
            );
          }
        }
      }
      return INITIAL_FLUSHING_STATE;
    },
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACID, JSON.stringify(acidState));
  }, [acidState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WATER, JSON.stringify(waterState));
  }, [waterState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DM_WATER, JSON.stringify(dmWaterState));
  }, [dmWaterState]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_FINAL_CONTROL,
      JSON.stringify(finalControlState),
    );
  }, [finalControlState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FLUSHING, JSON.stringify(flushingState));
  }, [flushingState]);

  const handleAcidTimeChange = (newTime: string): void => {
    setAcidState((prev) => ({ ...prev, time: newTime }));
  };

  const handleAcidInputChange = (
    bath: BathId,
    field: MetricField,
    value: string,
  ): void => {
    setAcidState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [bath]: {
          ...prev.data[bath],
          [field]: value,
        },
      },
    }));
  };

  const handleWaterTimeChange = (newTime: string): void => {
    setWaterState((prev) => ({ ...prev, time: newTime }));
  };

  const handleWaterInputChange = (
    field: keyof WaterMetricsData,
    value: string,
  ): void => {
    setWaterState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDmWaterChange = (
    field: keyof DmWaterFormData,
    value: string,
  ): void => {
    setDmWaterState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFinalControlChange = (
    field: keyof FinalControlFormData,
    value: string,
  ): void => {
    setFinalControlState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFlushingTimeChange = (newTime: string): void => {
    setFlushingState((prev) => ({ ...prev, time: newTime }));
  };

  const handleFlushingInputChange = (
    systemId: string,
    field: keyof FlushingSystemRowData,
    value: string,
    index?: number,
  ): void => {
    setFlushingState((prev) => {
      const currentRow = prev.formData[systemId] || {
        display_ec: "",
        sample_ec: "",
        display_ph: "",
        sample_ph: "",
      };

      let updatedFieldValue: string | string[] = value;

      if (typeof index === "number") {
        const currentArray = Array.isArray(currentRow[field])
          ? [...(currentRow[field] as string[])]
          : ["", ""];
        currentArray[index] = value;
        updatedFieldValue = currentArray;
      }

      return {
        ...prev,
        formData: {
          ...prev.formData,
          [systemId]: {
            ...currentRow,
            [field]: updatedFieldValue,
          },
        },
      };
    });
  };

  const handleAddEntry = () => {
    if (
      !acidState.time ||
      !waterState.time ||
      !flushingState.time ||
      !dmWaterState.time ||
      !finalControlState.time
    ) {
      window.alert(
        "Bitte fülle zuerst alle Zeitangaben in allen Bereichen aus!",
      );
      return;
    }

    const { bath1, bath3 } = acidState.data;
    if (
      !bath1.disp_hcl ||
      !bath1.disp_fe ||
      !bath1.meas_hcl ||
      !bath1.meas_fe ||
      !bath3.disp_hcl ||
      !bath3.disp_fe ||
      !bath3.meas_hcl ||
      !bath3.meas_fe
    ) {
      window.alert("Bitte fülle alle Felder der Säureanalyse vollständig aus!");
      return;
    }

    if (!waterState.veWater || !waterState.koValue) {
      window.alert("Bitte fülle alle Felder bei den Wasserwerten aus!");
      return;
    }

    if (
      !dmWaterState.street ||
      !dmWaterState.displayEc ||
      !dmWaterState.sampleEc
    ) {
      window.alert("Bitte fülle alle Felder der VE-Anlage vollständig aus!");
      return;
    }

    if (
      !finalControlState.displayedPh ||
      !finalControlState.displayedTemp ||
      !finalControlState.measuredPh ||
      !finalControlState.measuredTemp ||
      !finalControlState.wastewaterCounter
    ) {
      window.alert("Bitte fülle alle Felder der Endkontrolle & Zähler aus!");
      return;
    }

    const rows = ["sp1", "sp2", "sp3", "sp4", "sp5"] as const;
    const flushingFormData = flushingState.formData || {};
    for (const rowId of rows) {
      const row = flushingFormData[rowId];
      if (!row) {
        window.alert("Bitte fülle die Spülteil-Tabelle vollständig aus!");
        return;
      }
      if (rowId === "sp1" || rowId === "sp5") {
        const displayEc = row.display_ec;
        if (
          !Array.isArray(displayEc) ||
          !displayEc[0] ||
          !displayEc[1] ||
          !row.sample_ec ||
          !row.sample_ph
        ) {
          window.alert(
            `Bitte fülle alle erforderlichen Felder in Spüle ${rowId.replace("sp", "")} aus!`,
          );
          return;
        }
      } else if (rowId === "sp2" || rowId === "sp3") {
        if (!row.sample_ec || !row.sample_ph) {
          window.alert(
            `Bitte fülle alle erforderlichen Felder in Spüle ${rowId.replace("sp", "")} aus!`,
          );
          return;
        }
      } else if (rowId === "sp4") {
        const displayPh = row.display_ph;
        if (
          !row.sample_ec ||
          !Array.isArray(displayPh) ||
          !displayPh[0] ||
          !displayPh[1] ||
          !row.sample_ph
        ) {
          window.alert(
            "Bitte fülle alle erforderlichen Felder in Spüle 4 aus!",
          );
          return;
        }
      }
    }

    const currentEntryId =
      window.localStorage.getItem("currentEntryId") || Date.now().toString();

    const newEntry = {
      id: currentEntryId,
      date: new Date().toLocaleString("de-DE"),
      zeiten: {
        beizbad: acidState.time,
        wasser: waterState.time,
        spuele: flushingState.time,
        ve: dmWaterState.time,
        ek: finalControlState.time,
      },
      beize: {
        time: acidState.time,
        data: acidState.data,
      },
      wasser: {
        ve_h2o: waterState.veWater,
        ko_val: waterState.koValue,
      },
      spuelen: flushingState.formData,
      ve_str: {
        strasse: dmWaterState.street,
        rlw: dmWaterState.displayEc,
        mlw: dmWaterState.sampleEc,
      },
      endkontrolle: {
        displayPh: finalControlState.displayedPh,
        displayTemp: finalControlState.displayedTemp,
        measuredPh: finalControlState.measuredPh,
        measuredTemp: finalControlState.measuredTemp,
        wastewaterCounter: finalControlState.wastewaterCounter,
      },
    };

    const logs = JSON.parse(window.localStorage.getItem("chemData") || "[]");
    const idx = logs.findIndex(
      (x: { id: string | number }) =>
        x.id.toString() === currentEntryId.toString(),
    );

    if (idx >= 0) {
      logs[idx] = newEntry;
    } else {
      logs.unshift(newEntry);
    }

    window.localStorage.setItem("chemData", JSON.stringify(logs));

    ALL_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));

    window.localStorage.removeItem("currentEntryId");

    setAcidState(INITIAL_ACID_STATE);
    setWaterState(INITIAL_WATER_STATE);
    setDmWaterState(INITIAL_DM_WATER_STATE);
    setFinalControlState(INITIAL_FINAL_CONTROL_STATE);
    setFlushingState(INITIAL_FLUSHING_STATE);

    setFormKey((prev) => prev + 1);

    window.alert(
      "Protokoll erfolgreich zum Archiv hinzugefügt und Felder geleert! ✓",
    );
  };

  return (
    <div
      key={formKey}
      className="mb-50 mx-auto bg-white p-6.25 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.05)] w-full max-w-162.5"
    >
      <Navbar />
      <AcidAnalysis
        readOnly={false}
        time={acidState.time}
        data={acidState.data}
        onTimeChange={handleAcidTimeChange}
        onInputChange={handleAcidInputChange}
      />
      <WaterMetrics
        readOnly={false}
        time={waterState.time}
        data={waterState}
        onTimeChange={handleWaterTimeChange}
        onChange={handleWaterInputChange}
      />
      <DmWaterSystem
        readOnly={false}
        data={dmWaterState}
        onChange={handleDmWaterChange}
      />
      <FinalWastewaterInspection
        readOnly={false}
        data={finalControlState}
        onChange={handleFinalControlChange}
      />
      <FlushingSystemTable
        readOnly={false}
        time={flushingState.time}
        data={flushingState.formData}
        onTimeChange={handleFlushingTimeChange}
        onInputChange={handleFlushingInputChange}
      />
      <ArchivButton label="Zum Archiv hinzufügen" onClick={handleAddEntry} />
      <ResetButton storageKeys={[...ALL_STORAGE_KEYS, "currentEntryId"]} />
    </div>
  );
}

export default Home;
