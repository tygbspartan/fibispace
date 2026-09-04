import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import { Project } from "../../types";
import { resolveImageUrl } from "../../services/api";

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

  // Rendered into <body> rather than in place. The modal sits inside sections
  // that create their own stacking contexts (a positioned ancestor carrying a
  // z-index), and those cap every z-index within them — so left in place it
  // could never rise above the navbar whatever number it was given.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-0 md:p-4 lg:p-6 animate-fadeIn overflow-y-auto"
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
          {/* Project Title, with the link arrow sitting beside it.
              The anchor is inline rather than in a flex row of its own so it
              follows the last word of the title and still wraps around the
              floated close button above. */}
          <h2 className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium leading-tight">
            <span className="align-middle">{project.title}</span>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.title}`}
                title={project.link}
                // Same treatment as the arrow on a project card: white to black
                // on the same 600ms ease-in-out, the arrow turning 45° into it.
                className="group ml-3 md:ml-4 inline-grid place-items-center align-middle shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full border-[1.5px] border-black/50 bg-white text-black transition-[background-color,border-color,color] duration-[600ms] ease-in-out hover:bg-black hover:border-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <span className="inline-flex transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45">
                  <ArrowUpRight
                    size={20}
                    strokeWidth={2}
                    className="md:w-6 md:h-6"
                  />
                </span>
              </a>
            )}
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
              src={resolveImageUrl(project.mainImage)}
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
                  src={resolveImageUrl(image)}
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
    </div>,
    document.body,
  );
};

export default ProjectModal;
