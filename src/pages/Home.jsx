import React, { useEffect, useState, useRef } from "react";
import ServiceCard from "../components/ServiceCard";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setLastScrollY(scrollY);
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  // Services array
  const services = [
    {
      id: 1,
      title: "Web Development",
      description:
        "Building responsive and modern websites tailored to your business needs with cutting-edge technologies.",
    },
    {
      id: 2,
      title: "Mobile App Development",
      description:
        "Creating intuitive and powerful mobile applications for iOS and Android platforms.",
    },
    {
      id: 3,
      title: "UI/UX Design",
      description:
        "Crafting beautiful and user-friendly interfaces that enhance user experience and engagement.",
    },
    {
      id: 4,
      title: "Cloud Solutions",
      description:
        "Implementing scalable cloud infrastructure and services to optimize your business operations.",
    },
    {
      id: 5,
      title: "Digital Marketing",
      description:
        "Driving growth through strategic digital marketing campaigns and SEO optimization.",
    },
    {
      id: 6,
      title: "Consulting Services",
      description:
        "Providing expert guidance and strategic insights to help your business thrive in the digital age.",
    },
  ];

  // Projects array
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution with real-time inventory management and seamless payment integration.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
    },
    {
      id: 2,
      title: "Healthcare Management System",
      description:
        "Comprehensive patient management system with appointment scheduling and telemedicine capabilities.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    },
    {
      id: 3,
      title: "Financial Analytics Dashboard",
      description:
        "Real-time financial data visualization platform with advanced analytics and reporting features.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    },
    {
      id: 4,
      title: "Social Media Application",
      description:
        "Modern social networking platform with video sharing, stories, and real-time messaging.",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
    },
    {
      id: 5,
      title: "Learning Management System",
      description:
        "Interactive e-learning platform with course creation, progress tracking, and certification.",
      image:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
    },
    {
      id: 6,
      title: "Smart Home IoT Platform",
      description:
        "Integrated IoT solution for home automation with voice control and energy monitoring.",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800",
    },
  ];

  return (
    <div className="relative overflow-hidden ">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>

        <div
          className="absolute bottom-0 left-0 p-8 md:p-24 max-w-4xl z-10"
          style={{
            transform: `translateY(${scrollY * -0.2}px)`,
            opacity: Math.max(1 - scrollY / 500, 0),
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Fibi Space
          </h1>
          <p className="text-lg md:text-xl text-white drop-shadow-md leading-relaxed">
            We provide SEO, social media marketing, content marketing, and email
            marketing. Let us help take your digital marketing efforts to the
            next level.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 px-4 md:px-32 ">
        <div
          style={{
            transform: `translateY(${(scrollY - 400) * 0.1}px)`,
          }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions designed to elevate your business to new
              heights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                scrollDirection={scrollY > lastScrollY ? "down" : "up"}
              />
            ))}
          </div>
          <div className="mt-16 relative">
            <Link
              to="/services"
              className="group block relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-r from-[#12a89d] to-[#0d8579] py-6 px-8 rounded-2xl flex items-center justify-center">
                <div className="chevron-container absolute inset-0 opacity-10">
                  <div className="chevron chevron-1"></div>
                  <div className="chevron chevron-2"></div>
                  <div className="chevron chevron-3"></div>
                  <div className="chevron chevron-4"></div>
                  <div className="chevron chevron-5"></div>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                  <span className="text-white text-2xl font-bold">
                    Explore All Services
                  </span>
                  <div className="arrow-wrapper flex items-center gap-2 overflow-hidden">
                    <span className="arrow-slide text-white text-2xl font-bold opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="relative mt-36 py-20 px-4 md:px-32 ">
        <div className="">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Showcasing our finest work and innovative solutions
            </p>
          </div>

          <div className="space-y-16 md:space-y-24">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                scrollDirection={scrollY > lastScrollY ? "down" : "up"}
              />
            ))}
          </div>

          <div className="mt-16 relative">
            <Link
              to="/projects"
              className="group block relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-r from-[#12a89d] to-[#0d8579] py-6 px-8 rounded-2xl flex items-center justify-center">
                <div className="chevron-container absolute inset-0 opacity-10">
                  <div className="chevron chevron-1"></div>
                  <div className="chevron chevron-2"></div>
                  <div className="chevron chevron-3"></div>
                  <div className="chevron chevron-4"></div>
                  <div className="chevron chevron-5"></div>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                  <span className="text-white text-2xl font-bold">
                    Explore All Projects
                  </span>
                  <div className="arrow-wrapper flex items-center gap-2 overflow-hidden">
                    <span className="arrow-slide text-white text-2xl font-bold opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
