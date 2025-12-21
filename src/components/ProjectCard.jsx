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
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
          index * 0.15
        }s`,
      }}
    >
      {/* Image Container with Water Effect */}
      <div className="relative overflow-hidden rounded-2xl mb-4 bg-gray-100">
        <div className={`water-effect ${isHovered ? "active" : ""}`}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[300px] md:h-[55vh] object-cover transition-transform duration-700 group-hover:scale-105"
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
      <div className="space-y-2">
        <p className="text-xs text-gray-600 uppercase tracking-wide">
          {project.category}
        </p>
        <div className="flex items-center gap-3">
          {/* Arrow - Only visible on hover - LEFT SIDE */}
          <img
            src="/assets/arrow.png"
            className=" transition-all duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              width: isHovered ? "20px" : "0px",
              overflow: "hidden",
            }}
          />
          <h3
            className="text-2xl md:text-4xl font-medium text-gray-900 transition-transform duration-300"
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
