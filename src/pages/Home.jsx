import React, { useEffect, useState, useRef } from "react";
import ServiceCard from "../components/ServiceCard";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";
import AboutSection from "../components/AboutSection";
import FeaturedWork from "../components/FeaturedWork";
import WorkTogether from "../components/WorkTogether";

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
    <div className="relative pt-[75px] md:pt-[47px]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center px-4 md:px-0">
        {/* Tagline - Centered */}
        <div className="text-center mb-5 text-[28px] md:text-[45px] font-normal text-gray-900 leading-none flex flex-col gap-">
          <span>Crafting digital journeys that</span>
          <span>forge real connections.</span>
        </div>

        {/* Hero Image Container with Border */}
        <div className="relative w-full pt-6">
          <div className="border-2 rounded-2xl md:rounded-3xl overflow-hidden min-w-full">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600"
              alt="Hero"
              className="w-full max-h-[72vh] h-[75vh] md:h-[75vh] object-cover"
            />
          </div>
        </div>
        <div className="hidden md:flex flex-row justify-between w-full text-4xl">
          <p>+</p>
          <p>+</p>
          <p>+</p>
          <p>+</p>
        </div>
      </section>

      {/* About Us Section */}
      <AboutSection
        buttonRequired={true}
        description={
          "We turn your business goals into reality with data driven marketing and expert design. Fibi Space is your partner for reaching greater heights in the digital age."
        }
        imagePath={
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
        }
        titleTop={"Turning Big Dreams"}
        titleBottom={"Into Reality"}
      />

      {/* Featured Work Section */}
      <FeaturedWork />

      {/* About Us Section 2*/}
      <AboutSection
        buttonRequired={false}
        description={
          "We don't follow the crowd; we carve a unique path for your business. Fibi Space is dedicated to the art of the personalized experience, rejecting generic trends in favor of custom-built digital solutions that leave a permanent mark on your audience."
        }
        imagePath={
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
        }
        titleTop={"Turning Big Ideas Into"}
        titleBottom={"Custom-Built Experiences"}
      />

      {/* Work Together Section */}
      <WorkTogether />
    </div>
  );
};

export default Homepage;
