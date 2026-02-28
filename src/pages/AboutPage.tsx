import React from "react";
import AboutHero from "../components/about/AboutHero";
import AboutStrategy from "../components/about/AboutStrategy";
import AboutStats from "../components/about/AboutStats";
import AboutMissionVision from "../components/about/AboutMissionVision";
import AboutProcess from "../components/about/AboutProcess";
import AboutTeam from "../components/about/AboutTeam";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <AboutHero />
      <AboutStrategy />
      <AboutStats />
      <AboutMissionVision />
      <AboutProcess />
      <AboutTeam />
      <CTA />
      <Footer />
    </div>
  );
};

export default AboutPage;
