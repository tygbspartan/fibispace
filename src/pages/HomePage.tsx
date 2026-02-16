import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Expertise from "../components/Expertise";
import Projects from "../components/Projects";
import Services from "../components/Services";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Expertise />
      <Projects />
      <Services />
      <CTA />
      <Footer />
    </div>
  );
};

export default HomePage;
