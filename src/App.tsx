import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Delivery from "./pages/Delivery";
import Notes from "./pages/Notes";
import SavedProtocols from "./pages/SavedProtocols";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/archiv" element={<SavedProtocols />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
