import AcidAnalysis from "../components/acidAnalysis/AcidAnalysis";
import ResetButton from "../components/button/ResetButton.tsx";
import DmWaterSystem from "../components/dmWaterSystem/DmWaterSystem";
import FinalWastewaterInspection from "../components/finalControlSystem/FinalWastewaterInspection.tsx";
import FlushingSystemTable from "../components/flushingSystemTable/FlushingSystemTable";
import Navbar from "../components/navbar/Navbar";
import WaterMetrics from "../components/waterMetrics/WaterMetrics";

const ALL_STORAGE_KEYS = [
  "acid_analysis_combined_data",
  "dm_water_form_data",
  "final_control_form_data",
  "flushing_system_table_data",
  "water_metrics_data",
];

function Home() {
  return (
    <div className="mb-50 mx-auto bg-white p-6.25 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.05)] w-full max-w-162.5">
      <Navbar />
      <AcidAnalysis />
      <WaterMetrics />
      <DmWaterSystem />
      <FinalWastewaterInspection />
      <FlushingSystemTable />
      <ResetButton storageKeys={ALL_STORAGE_KEYS} />
    </div>
  );
}

export default Home;
