import React from "react";
import Navbar from "../components/Navbar";
import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import OurClients from "../components/projects/OurClients";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const ProjectsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* <Navbar /> */}
      <ProjectsHero />
      <ProjectsGrid />
      <OurClients />
      <CTA />
      <Footer />
    </div>
  );
};

export default ProjectsPage;
