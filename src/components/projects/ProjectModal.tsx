import React, { useEffect } from "react";
import { Project } from "../../types";

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-4 lg:p-6 animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-70"></div>

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-none md:rounded-lg w-full md:max-w-3xl lg:max-w-4xl md:max-h-[90vh] md:overflow-y-auto animate-slideUp md:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-3 md:top-4 right-3 md:right-4 float-right z-10 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Body */}
        <div className="p-4 md:p-6 lg:p-8 xl:p-12">
          {/* Project Title */}
          <h2 className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium leading-tight">
            {project.title}
          </h2>

          {/* Category Badges */}
          {/* <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
            {project.category.map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-normal bg-gray-100 border border-gray-300 rounded"
              >
                {cat.replace(/_/g, " ").toUpperCase()}
              </span>
            ))}
          </div> */}

          {/* Description */}
          {/* {project.description && (
            <div className="mb-6 md:mb-8">
              <h3 className="mb-2 md:mb-3 text-lg md:text-xl lg:text-2xl font-semibold">
                Description
              </h3>
              <p className="text-gray-700 text-sm md:text-base lg:text-lg xl:text-xl font-light leading-relaxed">
                {project.description}
              </p>
            </div>
          )} */}

          {/* Key Findings */}
          {/* {project.keyFindings && (
            <div className="mb-6 md:mb-8">
              <h3 className="mb-2 md:mb-3 text-lg md:text-xl lg:text-2xl font-semibold">
                Key Findings
              </h3>
              <p className="text-gray-700 text-sm md:text-base lg:text-lg xl:text-xl font-light leading-relaxed">
                {project.keyFindings}
              </p>
            </div>
          )} */}

          {/* Main Image */}
          <div className="mb-6 md:mb-8">
            <img
              src={project.mainImage}
              alt={project.title}
              className="w-full h-auto rounded md:rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/800x600?text=No+Image";
              }}
            />
          </div>

          {/* Thumbnail Images */}
          {project.thumbnailImages && project.thumbnailImages.length > 0 && (
            <div className="space-y-4 md:space-y-6">
              <h3 className="mb-3 md:mb-4 text-lg md:text-xl lg:text-2xl font-semibold">
                Project Gallery
              </h3>
              {project.thumbnailImages.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`${project.title} - Image ${idx + 1}`}
                  className="w-full h-auto rounded shadow-md"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/800x600?text=No+Image";
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
