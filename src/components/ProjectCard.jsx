import React, { useEffect, useRef, useState } from 'react';

const ProjectCard = ({ project, index, scrollDirection }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);
  const timeoutRef = useRef(null);

  const isImageLeft = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            timeoutRef.current = setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, 200);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scrollDirection, hasAnimated]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.3s ease-out'
    });
  };

  return (
    <div
      ref={cardRef}
      className={`project-card-container ${isVisible ? 'visible' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${isImageLeft ? '' : 'lg:grid-flow-dense'}`}>
        {/* Image Section */}
        <div className={`project-image-wrapper ${isImageLeft ? 'lg:col-start-1' : 'lg:col-start-2'} ${isVisible ? 'image-visible' : ''}`}>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-[400px] rounded-2xl object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Text Section */}
        <div className={`project-text-wrapper ${isImageLeft ? 'lg:col-start-2' : 'lg:col-start-1'} ${isVisible ? 'text-visible' : ''}`}>
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              {project.title}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {project.description}
            </p>
            
            {/* Button positioned based on layout */}
            <div className={`flex ${!isImageLeft ? 'lg:justify-end' : 'lg:justify-start'} justify-start`}>
              <button className="project-view-button group relative inline-flex items-center px-6 py-3 bg-[#12a89d] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#0d8579] hover:shadow-lg hover:px-10">
                <span className="arrow-icon absolute left-4 opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  →
                </span>
                <span className="relative transition-transform duration-300 group-hover:translate-x-6">
                  View Project
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;