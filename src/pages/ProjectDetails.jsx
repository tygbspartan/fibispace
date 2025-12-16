import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "../json/datas";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!project?.gallery || project.gallery.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % project.gallery.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);

  // Mock project data - Replace with actual data fetching
  const project = projects.find((x) => x.id == id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Project Not Found
          </h2>
          <button
            onClick={() => navigate("/projects")}
            className="text-[#12a89d] hover:underline"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % project.gallery.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + project.gallery.length) % project.gallery.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Full Width with Title Overlay and Parallax */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Title Overlay - Bottom Left */}
        <div
          className="absolute bottom-0 left-0 p-8 md:p-24 max-w-3xl z-10"
          style={{
            transform: `translateY(${scrollY * -0.2}px)`,
            opacity: Math.max(1 - scrollY / 500, 0),
          }}
        >
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-[#12a89d] text-white rounded-full text-sm font-semibold mb-4">
              {project.category}
            </span>
            {project.date && (
              <p className="text-white/90 text-sm">{project.date}</p>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 px-4 md:px-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Project Overview
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {project.description}
          </p>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 md:px-32 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Key Features
          </h2>
          <ul className="space-y-4">
            {project.keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-4 text-gray-600">
                <span className="flex-shrink-0 w-2 h-2 bg-[#12a89d] rounded-full mt-2"></span>
                <span className="text-lg leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery Carousel Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-20 px-4 md:px-32">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Project Gallery
            </h2>

            {/* Main Carousel */}
            <div className="relative mb-6 group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-video">
                <img
                  src={project.gallery[currentSlide]}
                  alt={`${project.title} - Image ${currentSlide + 1}`}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Navigation Arrows */}
              {project.gallery.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-900" />
                  </button>
                </>
              )}

              {/* Slide Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
                <span className="text-white text-sm font-medium">
                  {currentSlide + 1} / {project.gallery.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {/* Thumbnail Navigation */}
            {project.gallery.length > 1 && (
              <div className="flex justify-center">
                <div className="relative max-w-full overflow-hidden">
                  <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-custom">
                    {project.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative flex-shrink-0 w-32 md:w-40 aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                          currentSlide === index
                            ? "border-[#12a89d] shadow-lg"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Go Back Button */}
      <section className="py-12 px-4 md:px-32">
        <div className="max-w-5xl mx-auto flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-8 py-4 bg-[#12a89d] text-white font-semibold rounded-lg hover:bg-[#0d8579] transition-all duration-300 hover:shadow-xl"
          >
            <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Go Back</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
