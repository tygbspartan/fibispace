import React, { useState, useEffect, useRef } from "react";
import { projectsAPI } from "../../services/api";
import { Project } from "../../types";
import ProjectModal from "./ProjectModal";

const ProjectsGrid: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const projectsPerPage = 8;

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

  // Calculate pagination
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  // Reset animations when page changes
  useEffect(() => {
    setAnimatedCards(new Set());
    cardRefs.current = [];
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Intersection Observer for animations
  useEffect(() => {
    if (loading || currentProjects.length === 0) return;

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
        { threshold: 0.2 },
      );

      observer.observe(card);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [loading, currentProjects.length, currentPage]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-12 md:py-20">
        <div className="px-6 md:px-12 lg:px-24">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008AA9]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 md:py-20">
        <div className="px-6 md:px-12 lg:px-24">
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
    <section className="bg-white pt-8 md:pt-12 lg:pt-20 overflow-hidden">
      <div className="px-6 md:px-12 lg:px-24">
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {currentProjects.map((project, index) => {
            const isLeftColumn = index % 2 === 0;
            const isAnimated = animatedCards.has(index);

            return (
              <div
                key={project.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onClick={() => handleProjectClick(project)}
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
                {/* Project Image - Responsive */}
                <div
                  className="relative overflow-hidden mb-3 md:mb-4"
                  style={{
                    height: "clamp(400px, 50vw, 655px)",
                  }}
                >
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Project Info - Responsive */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 md:gap-4">
                  {/* Title - Responsive */}
                  <h3
                    className="font-light flex-1"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "clamp(24px, 4vw, 36px)",
                      lineHeight: "clamp(28px, 4.5vw, 40px)",
                    }}
                  >
                    {project.title}
                  </h3>

                  {/* Category Badges - Responsive */}
                  <div className="flex flex-wrap gap-2">
                    {project.category.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 md:px-3 py-1 text-xs md:text-sm font-normal bg-white border border-black rounded"
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

        {/* Pagination - Responsive */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 md:gap-2 mb-8 md:mb-12 flex-wrap">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-3 md:px-4 py-2 rounded-md transition-colors text-sm md:text-base ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#008AA9] text-white hover:bg-[#007a98]"
              }`}
              style={{ fontFamily: "Inter" }}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-md transition-colors text-sm md:text-base ${
                  currentPage === page
                    ? "bg-[#008AA9] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={{ fontFamily: "Inter" }}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 md:px-4 py-2 rounded-md transition-colors text-sm md:text-base ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#008AA9] text-white hover:bg-[#007a98]"
              }`}
              style={{ fontFamily: "Inter" }}
            >
              Next
            </button>
          </div>
        )}

        {/* No Projects Message */}
        {projects.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg md:text-xl">
              No projects available at the moment.
            </p>
          </div>
        )}

        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-black"></div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default ProjectsGrid;
