import React from "react";
// The previous hero is kept at ../components/OldHero for an easy revert —
// swap the import below to bring it back.
import Hero, { PIN, PORTAL } from "../components/NewHero";
import CloudBand from "../components/CloudBand";
import Projects from "../components/Projects";
import Services from "../components/Services";
import Clients from "../components/Clients";
import Faq from "../components/Faq";
import Footer from "../components/NewFooter";

const HomePage: React.FC = () => {
  return (
    // No background of its own — the hero's fixed scene sits behind everything,
    // and the sections below paint over it as they scroll up.
    <div className="min-h-screen overflow-x-clip">
      <Hero />

      {/* The hero draws itself into a fixed overlay, so it takes up no space
          of its own. This is the scroll it owns: the badges arriving, then the
          flight into the star. */}
      <div aria-hidden="true" style={{ height: `${(PIN + PORTAL) * 100}vh` }} />

      {/* Everything below the hero. It sits *above* the hero's overlay and
          simply scrolls up over it — that travel is the transition. Below the
          navbar's z-50, so the bar stays on top of both. */}
      <div data-page-content className="relative z-40 bg-site">
        {/* The transition, and all of it — see CloudBand. */}
        <CloudBand />

        <Projects />
        <Services />
        <Clients />
        <Faq />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
