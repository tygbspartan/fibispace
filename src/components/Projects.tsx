import React, { useState, useEffect, useRef } from "react";
import { projectsAPI } from "../services/api";
import { Project } from "../types";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data.projects);
      setError(null);
    } catch (err) {
      setError("Failed to load projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer for each card
  useEffect(() => {
    if (loading || projects.length === 0) return;

    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(
                () => {
                  setAnimatedCards((prev) => new Set(prev).add(index));
                },
                Math.floor(index / 2) * 400,
              );
            }
          });
        },
        {
          threshold: 0.2,
        },
      );

      observer.observe(card);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [loading, projects.length]);

  if (loading) {
    return (
      <section className="bg-white py-12 md:py-20" id="projects">
        <div className="px-6 md:px-12 lg:px-24">
          <h2
            className="text-[32px] md:text-[40px] lg:text-[48px] font-medium mb-10"
            style={{
              fontFamily: "Inter",
              lineHeight: "40px",
              letterSpacing: "0%",
            }}
          >
            Our Projects
          </h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008AA9]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 md:py-20" id="projects">
        <div className="px-6 md:px-12 lg:px-24">
          <h2
            className="text-[32px] md:text-[40px] lg:text-[48px] font-medium mb-10"
            style={{
              fontFamily: "Inter",
              lineHeight: "40px",
              letterSpacing: "0%",
            }}
          >
            Our Projects
          </h2>
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-6 py-2 bg-[#008AA9] text-white rounded hover:bg-[#007a98] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pb-12 md:pb-20 overflow-hidden" id="projects">
      <div className="px-6 md:px-12 lg:px-24">
        {/* Section Title */}
        <h2
          className="text-[32px] md:text-[40px] lg:text-[48px] font-medium mb-10 md:mb-12 lg:mb-16"
          style={{
            fontFamily: "Inter",
            lineHeight: "40px",
            letterSpacing: "0%",
          }}
        >
          Our Projects
        </h2>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const isLeftColumn = index % 2 === 0;
            const isAnimated = animatedCards.has(index);

            return (
              <div
                key={project.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`group cursor-pointer transition-all duration-1000 ease-in-out ${
                  isAnimated
                    ? "opacity-100 translate-x-0 translate-y-0"
                    : "opacity-0"
                }`}
                style={{
                  transform: !isAnimated
                    ? window.innerWidth >= 768
                      ? isLeftColumn
                        ? "translateX(-100px)"
                        : "translateX(100px)"
                      : "translateY(100px)"
                    : "translate(0, 0)",
                }}
              >
                {/* Project Image */}
                <div
                  className="relative overflow-hidden mb-4"
                  style={{ height: "655px" }}
                >
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Project Info - Title and Categories */}
                <div className="flex justify-between items-center gap-4">
                  {/* Title */}
                  <h3
                    className="font-light flex-1"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "36px",
                      lineHeight: "40px",
                      letterSpacing: "0%",
                    }}
                  >
                    {project.title}
                  </h3>

                  {/* Category Badges */}
                  <div className="flex flex-wrap gap-2 justify-end">
                    {project.category.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm font-normal bg-white border border-black rounded"
                        style={{ fontFamily: "Inter" }}
                      >
                        {cat.replace(/_/g, " ").toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More Button */}
        {projects.length > 0 && (
          <div className="text-center mt-8 lg:mt-10">
            <button className="px-8 py-3 bg-[#008AA9] text-white rounded-md font-medium hover:bg-[#007a98] transition-colors">
              All Projects
            </button>
          </div>
        )}
        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-black mt-12"></div>
      </div>
    </section>
  );
};

export default Projects;
