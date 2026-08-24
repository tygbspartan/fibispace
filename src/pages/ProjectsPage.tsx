import React, { useEffect } from "react";
import Projects from "../components/Projects";
import Clients from "../components/Clients";
import Footer from "../components/NewFooter";

const ProjectsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-site">
      {/* The same component the home page uses, so the cards, the filters and
          their hover behaviour are identical by construction rather than by
          two copies being kept in step. Here it shows every project and drops
          the "All Projects" button, which would only lead back to itself. */}
      <Projects
        heading="What we've been creating."
        headingClass="text-[28px] md:text-[34px] xl:text-[38px] 2xl:text-[50px] slg:text-[60px]"
        topClass="pt-[30px] md:pt-[100px]"
        intro="A glimpse into the brands, ideas, and digital experiences we've brought to life."
        featuredOnly={false}
        showAllButton={false}
      />

      {/* The same marquee the home page uses, rather than a second clients
          section kept in step by hand. */}
      <div className="pb-[40px] md:pb-0">
        <Clients />
      </div>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
