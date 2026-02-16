import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLetsTalkOpen, setIsLetsTalkOpen] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<number | null>(null);
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
    { name: "Mail", icon: "✉️", link: "mailto:fibispaces@gmail.com" },
    { name: "Whatsapp", icon: "💬", link: "https://wa.me/9779695861710" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook.png", link: "https://facebook.com/fibispace" },
    { name: "Instagram", icon: "Instagram.png", link: "https://instagram.com/fibispace" },
    {
      name: "LinkedIn",
      icon: "LinkedIn.png",
      link: "https://linkedin.com/company/fibispace",
    },
    { name: "Threads", icon: "Threads.png", link: "https://threads.net/@fibispace" },
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
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className={`text-[20px] xl:text-[24px] font-light capitalize leading-none tracking-normal hover:text-[#008AA9] transition-colors relative ${
                  isActive(link.path)
                    ? "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-black"
                    : ""
                }`}
                style={{ fontFamily: "Inter", lineHeight: "100%" }}
              >
                {link.name}
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

              {/* Let's Talk Popover - Responsive */}
              {isLetsTalkOpen && (
                <div className="absolute top-full w-[260px] lg:w-[279px] mt-2 z-50 overflow-hidden">
                  {/* Contact Methods */}
                  <div className="p-4 px-8 bg-[#008AA9]">
                    {contactMethods.map((method, index) => (
                      <a
                        key={index}
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-white py-3 hover:bg-[#007a98] px-2 rounded transition-colors"
                      >
                        <span className="text-xl md:text-2xl font-light">
                          {method.name}
                        </span>
                        <span className="text-white text-lg">●</span>
                      </a>
                    ))}
                  </div>

                  {/* Social Icons */}
                  <div className="flex justify-center gap-6 lg:gap-8 mt-4 pb-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 text-xl bg-[#008AA9] rounded-full flex items-center justify-center text-white hover:bg-[#007a98] transition-colors font-bold"
                        title={social.name}
                      >
                        <img alt={social.name} src={`/assets/Socials/${social.icon}`}/>
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

              {/* Menu Popover - Responsive */}
              {isMenuOpen && (
                <div className="absolute top-full right-0 w-[240px] md:w-[260px] lg:w-[279px] mt-2 z-50 overflow-hidden">
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
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 md:w-10 md:h-10 text-lg md:text-xl bg-[#008AA9] rounded-full flex items-center justify-center text-white hover:bg-[#007a98] transition-colors font-bold"
                        title={social.name}
                      >
                       <img alt={social.name} src={`/assets/Socials/${social.icon}`}/>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
