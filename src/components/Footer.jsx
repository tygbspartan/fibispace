import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative Wave Separator */}
      {/* <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-full">
        <svg
          className="relative block w-full h-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z"
            className="fill-gray-900"
          ></path>
        </svg>
      </div> */}

      {/* Main Footer Content */}
      <div className="relative bg-gray-900 pt-20 pb-8">
        {/* Overlapping Company Info Card */}
        <div className="mx-auto px-4 md:px-32">
          <div className="relative">
            {/* Featured Info Card - Overlapping Design */}
            <div className="absolute left-0 right-0 md:right-auto md:w-2/5 z-10">
              <div className="bg-gradient-to-br from-[#12a89d] to-[#0d8579] rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="flex gap-2 items-center mb-4">
                  <img src="/assets/fibiWhite.png" className="h-5"/>
                  <h3 className="text-2xl font-bold text-white">
                    Fibi Space
                  </h3>
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-6">
                  We provide SEO, social media marketing, content marketing, and
                  email marketing. Let us help take your digital marketing
                  efforts to the next level.
                </p>

                {/* Contact Button */}
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 bg-white text-[#12a89d] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                >
                  <span>Contact Us</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Main Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 md:pt-0 md:pl-[45%]">
              {/* Quick Links */}
              <div>
                <h4 className="text-white text-lg font-bold mb-6 relative inline-block">
                  Quick Links
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#12a89d]"></span>
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className="footer-link group text-gray-400 hover:text-[#12a89d] transition-colors duration-300 inline-flex items-center gap-4"
                      >
                        <span className="footer-link-text">{link.name}</span>
                        <span className="footer-arrow opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-white text-lg font-bold mb-6 relative inline-block">
                  Get In Touch
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#12a89d]"></span>
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-gray-400">
                    <Mail className="w-5 h-5 text-[#12a89d] mt-1 flex-shrink-0" />
                    <a
                      href="mailto:fibispace@gmail.com"
                      className="hover:text-[#12a89d] transition-colors duration-300 break-all"
                    >
                      fibispace@gmail.com
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <Phone className="w-5 h-5 text-[#12a89d] mt-1 flex-shrink-0" />
                    <span>+977 XXX-XXXXXXX</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <MapPin className="w-5 h-5 text-[#12a89d] mt-1 flex-shrink-0" />
                    <span>Kathmandu, Nepal</span>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-white text-lg font-bold mb-6 relative inline-block">
                  Follow Us
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#12a89d]"></span>
                </h4>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/fibispace/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#12a89d] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  >
                    <Instagram className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </a>
                  <a
                    href="https://www.facebook.com/fibispace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#12a89d] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  >
                    <Facebook className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {currentYear} Fibi Space. All rights reserved.
              </p>
              {/* <div className="flex gap-6 text-sm">
                <Link
                  to="/privacy"
                  className="text-gray-500 hover:text-[#12a89d] transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-500 hover:text-[#12a89d] transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#12a89d]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#12a89d]/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </footer>
  );
};

export default Footer;
