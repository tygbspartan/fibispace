import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { links, socials } from "../json/datas";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation(); // current route

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (openDropdown) handleCloseDropdown();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDropdown]);

  // Handle dropdown closing with animation
  const handleCloseDropdown = () => {
    setIsExiting(true);
    setTimeout(() => {
      setOpenDropdown(false);
      setIsExiting(false);
    }, 250);
  };

  // Handle mobile menu closing with animation
  const handleCloseMobile = () => {
    setIsExiting(true);
    setTimeout(() => {
      setOpenMobile(false);
      setIsExiting(false);
    }, 250);
  };

  const handleEmail = () => {
    const recipient = "fibispace@gmail.com";
    const subject = "";
    const body = "";

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      recipient
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(url, "_blank");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent text-black z-50 items-center">
      <div className="px-6 pt-[30px] md:pt-[47px] flex items-center justify-between md:px-24">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-[24px] md:text-[40px] leading-none font-semibold tracking-[0.1em] md:tracking-[0.2em]">
            FIBI
          </span>
          <span className="text-[24px] md:text-[40px] font-semibold tracking-[0.1em] md:tracking-[0.2em]">
            SPACE
          </span>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-2 relative" ref={dropdownRef}>
          {/* Let's Talk */}
          <button
            onClick={handleEmail}
            className="hover-ripple h-[50px] px-4 rounded-3xl text-white text-xl font-medium
                             bg-[#2B2E3A] hover:bg-black 
                             transition-colors duration-300 ease-in-out"
          >
            LET'S TALK •
          </button>

          {/* Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="hover-ripple h-[50px] px-4 rounded-3xl font-medium text-[#2B2E3A] text-xl
                         bg-[#D9D9D9] hover:bg-[#dfdfdf] 
                         transition-colors duration-300 ease-in-out"
            >
              {!openDropdown ? "MENU" : "CLOSE"} ••
            </button>

            {/* Dropdown */}
            {(openDropdown || isExiting) && (
              <div className="absolute top-16 right-0 flex-row gap-3">
                <div
                  className={`bg-white shadow-xl rounded-xl p-5 w-72
                            border border-gray-200 ${
                              isExiting ? "animate-popOut" : "animate-popup"
                            }`}
                >
                  <div className="flex flex-col gap-4">
                    {links.map((link) => {
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={isActive ? "#" : link.path}
                          onClick={() => !isActive && handleCloseDropdown()}
                          className={`transition font-normal flex items-center justify-between text-[32px]
                           ${
                             isActive ? "pointer-events-none text-gray-500" : ""
                           } hover:scale-105 hover:-translate-y-1`}
                        >
                          {link.name}
                          {isActive && (
                            <span className="text-black text-3xl">•</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div
                  className={`bg-white shadow-xl rounded-xl p-5 w-72 mt-2
                            border border-gray-200 ${
                              isExiting ? "animate-popOut" : "animate-popup"
                            }`}
                >
                  <div className="flex flex-row justify-between">
                    {socials.map((soc) => {
                      return (
                        <a
                          key={soc.name}
                          href={soc.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                        >
                          <img
                            src={`/assets/Socials/${soc.name}.png`}
                            alt={soc.name}
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setOpenMobile(!openMobile)}
        >
          {openMobile ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu - Updated to match desktop style */}
      {openMobile && (
        <div className="md:hidden fixed top-[90px] left-0 right-0 px-6">
          <div
            className={`bg-white shadow-xl rounded-xl p-5
                      border border-gray-200 ${
                        isExiting ? "animate-popOut" : "animate-popup"
                      }`}
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={isActive ? "#" : link.path}
                    onClick={() => !isActive && handleCloseMobile()}
                    className={`transition font-normal flex items-center justify-between text-[24px]
                     ${isActive ? "pointer-events-none text-gray-500" : ""}`}
                  >
                    {link.name}
                    {isActive && <span className="text-black text-2xl">•</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Social Links for Mobile */}
          <div
            className={`bg-white shadow-xl rounded-xl p-5 mt-3
                      border border-gray-200 ${
                        isExiting ? "animate-popOut" : "animate-popup"
                      }`}
          >
            <div className="flex flex-row justify-between">
              {socials.map((soc) => {
                return (
                  <a
                    key={soc.name}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                  >
                    <img
                      src={`/assets/Socials/${soc.name}.png`}
                      alt={soc.name}
                      className="w-8 h-8"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
