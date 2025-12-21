import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { projects } from "../json/datas";

const FeaturedWork = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px",
      }
    );

    const cards = document.querySelectorAll(".project-card");
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-4 md:px-0">
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h2 className="text-[48px] md:text-[95px] font-normal leading-none">
            Featured Work
          </h2>
          <p className="text-sm md:text-xl  max-w-xl uppercase tracking-wide">
            GREAT WORK MADE WITH GREAT PEOPLE. A LOOK AT OUR COLLABORATIONS OVER
            THE YEARS.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-16 mb-12">
          {projects.slice(0,4).map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={visibleCards.includes(index)}
            />
          ))}
        </div>

        {/* See All Projects Button */}
        <div className="flex justify-center">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full font-medium text-black hover:px-8 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <span className="text-lg transition-all duration-300 group-hover:opacity-0 group-hover:scale-0">
              •
            </span>
            <span className="absolute opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              →
            </span>
            <span className="relative transition-transform duration-300 group-hover:translate-x-1">
              SEE ALL PROJECTS
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Project Card Component

export default FeaturedWork;
