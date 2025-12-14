import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

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

  const links = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

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
      <div className="px-24 py-9 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/assets/fibiGreen.png" alt="logo" className="w-auto h-9" />
          {/* <div className="text-5xl font-bold" style={{ color: "#12A89D" }}>
            FibiSpace
          </div> */}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-2 relative" ref={dropdownRef}>
          {/* Let's Talk */}
          <button
            onClick={handleEmail}
            className="hover-ripple px-6 py-3 rounded-full font-semibold text-white text-xl
                             bg-[#12A89D] hover:bg-[#0e7f76] 
                             transition-colors duration-300 ease-in-out"
          >
            Let's Talk
          </button>

          {/* Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="hover-ripple px-6 py-3 rounded-full font-semibold text-black text-xl
                         bg-[#e5f8f6] hover:bg-[#c9eae7] 
                         transition-colors duration-300 ease-in-out"
            >
              Menu
            </button>

            {/* Dropdown */}
            {(openDropdown || isExiting) && (
              <div
                className={`absolute top-14 right-0 bg-white shadow-xl rounded-xl p-4 w-64
                            border border-gray-200 ${
                              isExiting ? "animate-popOut" : "animate-popup"
                            }`}
              >
                <div className="flex flex-col gap-3">
                  {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={isActive ? "#" : link.path} // unclickable if active
                        onClick={() => !isActive && handleCloseDropdown()}
                        className={`transition font-medium flex items-center justify-between text-xl
                          hover:text-[#12A89D] ${
                            isActive ? "pointer-events-none text-gray-500" : ""
                          }`}
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

      {/* Mobile Menu */}
      {openMobile && (
        <div className="md:hidden bg-white shadow-md p-6 flex flex-col gap-4">
          <Link
            to="/"
            className="hover:text-[#12A89D] transition font-medium"
            onClick={() => setOpenMobile(false)}
          >
            Home
          </Link>
          <Link
            to="/services"
            className="hover:text-[#12A89D] transition font-medium"
            onClick={() => setOpenMobile(false)}
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="hover:text-[#12A89D] transition font-medium"
            onClick={() => setOpenMobile(false)}
          >
            Contact
          </Link>
          <Link
            to="/about"
            className="hover:text-[#12A89D] transition font-medium"
            onClick={() => setOpenMobile(false)}
          >
            About
          </Link>
        </div>
      )}
    </nav>
  );
}
