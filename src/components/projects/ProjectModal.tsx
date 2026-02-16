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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
    >
      {/* Backdrop Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 float-right z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6 text-gray-700"
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
        <div className="p-6 md:p-8 lg:p-12">
          {/* Project Title */}
          <h2
            className="mb-6"
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: "500",
              lineHeight: "clamp(40px, 6vw, 64px)",
            }}
          >
            {project.title}
          </h2>

          {/* Category Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.category.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-sm font-normal bg-gray-100 border border-gray-300 rounded"
                style={{ fontFamily: "Inter" }}
              >
                {cat.replace(/_/g, " ").toUpperCase()}
              </span>
            ))}
          </div>

          {/* Description */}
          {project.description && (
            <div className="mb-8">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "Inter",
                  fontSize: "24px",
                  fontWeight: "600",
                  lineHeight: "32px",
                }}
              >
                Description
              </h3>
              <p
                className="text-gray-700"
                style={{
                  fontFamily: "Inter",
                  fontSize: "20px",
                  fontWeight: "300",
                  lineHeight: "32px",
                }}
              >
                {project.description}
              </p>
            </div>
          )}

          {/* Key Findings */}
          {project.keyFindings && (
            <div className="mb-8">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "Inter",
                  fontSize: "24px",
                  fontWeight: "600",
                  lineHeight: "32px",
                }}
              >
                Key Findings
              </h3>
              <p
                className="text-gray-700"
                style={{
                  fontFamily: "Inter",
                  fontSize: "20px",
                  fontWeight: "300",
                  lineHeight: "32px",
                }}
              >
                {project.keyFindings}
              </p>
            </div>
          )}

          {/* Main Image */}
          <div className="mb-8">
            <img
              src={project.mainImage}
              alt={project.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Thumbnail Images */}
          {project.thumbnailImages && project.thumbnailImages.length > 0 && (
            <div className="space-y-6">
              <h3
                className="mb-4"
                style={{
                  fontFamily: "Inter",
                  fontSize: "24px",
                  fontWeight: "600",
                  lineHeight: "32px",
                }}
              >
                Project Gallery
              </h3>
              {project.thumbnailImages.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`${project.title} - Image ${idx + 1}`}
                  className="w-full h-auto rounded-lg shadow-md"
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
