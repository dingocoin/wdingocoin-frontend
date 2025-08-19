import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import BridgePage from "./pages/bridge";
import HistoryPage from "./pages/history";
import StatusPage from "./pages/status";
import HomePage from "./pages/index";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bridge" element={<BridgePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/status" element={<StatusPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App; 