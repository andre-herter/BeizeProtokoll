import AcidAnalysis from "../components/acidAnalysis/AcidAnalysis";
import DmWaterSystem from "../components/dmWaterSystem/DmWaterSystem";
import FlushingSystemTable from "../components/flushingSystemTable/FlushingSystemTable";
import Navbar from "../components/navbar/Navbar";
import WaterMetrics from "../components/waterMetrics/WaterMetrics";

function Home() {
  return (
    <div className="mb-50 mx-auto bg-white p-6.25 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.05)] w-full max-w-162.5">
      <Navbar />
      <AcidAnalysis />
      <WaterMetrics />
      <DmWaterSystem />
      <FlushingSystemTable />
    </div>
  );
}

export default Home;
