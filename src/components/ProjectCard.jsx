import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/projects/${project.id}`}
      data-index={index}
      className="project-card group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? isHovered
            ? "scale(1.03)"
            : "scale(1)"
          : "scale(0.7)",
        transition: isVisible
          ? "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          : `all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.12}s`,
      }}
    >
      {/* Image Container with Water Effect */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-3 sm:mb-4 bg-gray-100">
        <div className={`water-effect ${isHovered ? "active" : ""}`}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[250px] sm:h-[300px] md:h-[45vh] lg:h-[55vh] object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Water Wave Overlay */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="water-wave"></div>
            <div
              className="water-wave"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="space-y-1.5 sm:space-y-2">
        <p className="text-[10px] sm:text-xs text-gray-600 uppercase tracking-wide">
          {project.category}
        </p>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Arrow - Only visible on hover - LEFT SIDE */}
          <img
            src="/assets/arrow.png"
            className="transition-all duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              width: isHovered ? "16px" : "0px",
              overflow: "hidden",
            }}
            alt="arrow"
          />
          <h3
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-gray-900 transition-transform duration-300"
            style={{
              transform: isHovered ? "translateX(0)" : "translateX(-13px)",
            }}
          >
            {project.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
