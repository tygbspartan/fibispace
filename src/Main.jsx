import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { useEffect, useState } from "react";
import LoadingOverlay from "./components/LoadingOverlay";

const Main = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [phaseTimer, setPhaseTimer] = useState(600);
  // Initial load
  useEffect(() => {
    setLoading(true);
    const totalTime = phaseTimer + 180 + phaseTimer + 50; // shrink + pause + expand + fade
    const timer = setTimeout(() => setLoading(false), totalTime);
    return () => clearTimeout(timer);
  }, []);

  // Route changes
  useEffect(() => {
    setLoading(true);
    const totalTime = phaseTimer + 180 + phaseTimer + 50;
    const timer = setTimeout(() => setLoading(false), totalTime);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <LoadingOverlay isActive={loading} phaseTimer={phaseTimer} />
      <div
        className={`${
          loading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300 flex flex-col min-h-screen`}
      >
        <header>
          <Navbar />
        </header>

        <main className="flex-grow mt-32 mx-20 px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/get-started" element={<About />} /> */}
          </Routes>
        </main>
        <footer className="text-black pt-12 pb-6 items-center fibi-bg">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default Main;
