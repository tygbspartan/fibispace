import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLetsTalkOpen, setIsLetsTalkOpen] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<number | null>(null);
  const [hoveredNavLink, setHoveredNavLink] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const letsTalkRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const contactMethods = [
    {
      name: "Mail",
      icon: "✉️",
      link: "https://mail.google.com/mail/?view=cm&fs=1&to=fibispace@gmail.com",
    },
    { name: "Whatsapp", icon: "💬", link: "https://wa.me/9779741661719" },
  ];

  const socialLinks: {
    name: string;
    icon: React.ReactNode;
    link: string;
  }[] = [
    {
      name: "Facebook",
      icon: "Facebook.png",
      link: "https://facebook.com/fibispace",
    },
    {
      name: "Instagram",
      icon: "Instagram.png",
      link: "https://instagram.com/fibispace",
    },
    {
      name: "LinkedIn",
      icon: "Linkedin.png",
      link: "https://linkedin.com/",
    },
    {
      name: "Threads",
      icon: "Threads.png",
      link: "https://threads.net/@fibispace",
    },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Check if current path is active
  const isActive = (path: string) => {
    // For home page
    if (path === "/") {
      return location.pathname === "/";
    }
    // For other pages, check if pathname starts with the path
    return location.pathname.startsWith(path);
  };

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        letsTalkRef.current &&
        !letsTalkRef.current.contains(event.target as Node)
      ) {
        setIsLetsTalkOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white relative">
      <div className="px-6 md:px-12 lg:px-24 pt-[30px] md:pt-[40px] lg:pt-[47px]">
        <div className="flex justify-between items-center">
          {/* Logo - Responsive */}
          <div className="flex-shrink-0 flex gap-4 md:gap-6 lg:gap-10">
            <span
              className="text-[28px] md:text-[34px] lg:text-[40px] font-normal leading-none tracking-normal cursor-pointer"
              style={{ fontFamily: "Inter", lineHeight: "100%" }}
              onClick={() => navigate("/")}
            >
              F I B I
            </span>
            <span
              className="text-[28px] md:text-[34px] lg:text-[40px] font-normal leading-none tracking-normal cursor-pointer"
              style={{ fontFamily: "Inter", lineHeight: "100%" }}
              onClick={() => navigate("/")}
            >
              S P A C E
            </span>
          </div>

          {/* Desktop/Tablet Navigation - Hidden on mobile */}
          <div className="hidden items-center space-x-6 2xl:flex 2xl:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                onMouseEnter={() => setHoveredNavLink(link.name)}
                onMouseLeave={() => setHoveredNavLink(null)}
                className="text-[20px] xl:text-[24px] font-light capitalize leading-none tracking-normal transition-colors relative"
                style={{ fontFamily: "Inter", lineHeight: "100%" }}
              >
                {link.name}

                {/* Active State Underline - Static */}
                {isActive(link.path) && (
                  <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-black"></span>
                )}

                {/* Hover Underline - Animated from center */}
                {!isActive(link.path) && (
                  <span
                    className={`absolute bottom-[-4px] left-1/2 h-[2px] bg-black transition-all duration-300 ease-in-out ${
                      hoveredNavLink === link.name
                        ? "w-full -translate-x-1/2"
                        : "w-0 -translate-x-1/2"
                    }`}
                  ></span>
                )}
              </button>
            ))}
          </div>

          {/* CTA Buttons - Responsive */}
          <div className="flex gap-3 md:gap-6 lg:gap-8 items-center">
            {/* Let's Talk Button with Popover - Hidden on mobile */}
            <div className="relative hidden md:block" ref={letsTalkRef}>
              <button
                onClick={() => {
                  setIsLetsTalkOpen(!isLetsTalkOpen);
                  setIsMenuOpen(false);
                }}
                className="w-[120px] lg:w-[131px] h-[40px] lg:h-[42px] text-[18px] lg:text-[20px] font-medium leading-none tracking-normal text-white bg-[#008AA9] rounded hover:bg-[#007a98] transition-colors flex items-center justify-center"
                style={{ fontFamily: "Inter", lineHeight: "100%" }}
              >
                Let's Talk
              </button>

              {/* Let's Talk Popover - Animated */}
              {isLetsTalkOpen && (
                <div
                  className="absolute top-full w-[260px] lg:w-[279px] mt-2 z-50 overflow-hidden animate-slideDown"
                  style={{
                    animation: "slideDown 300ms ease-in-out forwards",
                  }}
                >
                  {/* Contact Methods */}
                  <div className="p-4 px-8 bg-[#008AA9]">
                    {contactMethods.map((method, index) => (
                      <a
                        key={index}
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setHoveredMenuItem(index)}
                        onMouseLeave={() => setHoveredMenuItem(null)}
                        className="w-full flex items-center justify-between text-white py-2 md:py-3 px-2 rounded transition-colors"
                      >
                        <span className="text-xl md:text-2xl font-light">
                          {method.name}
                        </span>
                        <span className="text-white text-lg transition-all duration-200">
                          {hoveredMenuItem === index ? "→" : ""}
                        </span>
                      </a>
                    ))}
                  </div>

                  {/* Social Icons */}
                  <div className="flex justify-center gap-6 lg:gap-8 mt-4 pb-4">
                    {socialLinks.map(({ name, icon, link }, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 text-xl bg-[#008AA9] rounded-full flex items-center justify-center text-white hover:bg-[#007a98] transition-colors font-bold"
                        title={name}
                      >
                        <img
                          src={`/assets/Socials/${icon}`}
                          alt={name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                          }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MENU Button with Popover */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsLetsTalkOpen(false);
                }}
                className="w-[90px] md:w-[106px] lg:w-[116px] h-[36px] md:h-[40px] lg:h-[42px] text-[16px] md:text-[18px] lg:text-[20px] font-medium leading-none tracking-normal text-black bg-[#D9D9D9] rounded transition-colors flex items-center justify-center space-x-2"
                style={{ fontFamily: "Inter", lineHeight: "100%" }}
              >
                <span>MENU</span>
                {/* Two Eclipse Dots */}
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
              </button>

              {/* Menu Popover - Animated */}
              {isMenuOpen && (
                <div
                  className="absolute top-full right-0 w-[240px] md:w-[260px] lg:w-[279px] mt-2 z-50 overflow-hidden"
                  style={{
                    animation: "slideDown 300ms ease-in-out forwards",
                  }}
                >
                  {/* Navigation Links */}
                  <div className="p-3 px-6 md:p-4 md:px-8 bg-[#008AA9]">
                    {navLinks.map((link, index) => (
                      <button
                        key={index}
                        onClick={() => handleNavClick(link.path)}
                        onMouseEnter={() => setHoveredMenuItem(index)}
                        onMouseLeave={() => setHoveredMenuItem(null)}
                        className="w-full flex items-center justify-between text-white py-2 md:py-3 px-2 rounded transition-colors"
                      >
                        <span className="text-xl md:text-2xl font-light capitalize">
                          {link.name}
                        </span>

                        {/* Icon on Right - Dot for active, Arrow on hover */}
                        <span className="text-white text-lg transition-all duration-200">
                          {hoveredMenuItem === index
                            ? "→"
                            : isActive(link.path)
                              ? "●"
                              : ""}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Social Icons */}
                  <div className="flex justify-center gap-4 md:gap-6 lg:gap-8 mt-3 md:mt-4 pb-3 md:pb-4">
                    {socialLinks.map(({ name, icon, link }, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 text-xl bg-[#008AA9] rounded-full flex items-center justify-center text-white hover:bg-[#007a98] transition-colors font-bold"
                        title={name}
                      >
                        <img
                          src={`/assets/Socials/${icon}`}
                          alt={name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                          }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
