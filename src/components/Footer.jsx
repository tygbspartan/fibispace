import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { socials } from "../json/datas";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-white text-black pt-36 pb-8 px-4 md:px-24"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
      }}
    >
      <div>
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Column 1 - Address */}
          <div>
            <p className="text-base md:text-xl leading-relaxed">
              Swayambhu Marg
              <br />
              17-Dhalko
              <br />
              Kathmandu, Nepal
            </p>
          </div>

          {/* Column 2 - Social Links */}
          <div className="flex flex-col gap-6 md:gap-16">
            <div>
              <ul className="space-y-2">
                {socials.map((social, index) => (
                  <li key={index}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base md:text-xl hover:text-gray-600 transition-colors duration-300"
                    >
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Enquiries */}
            <div>
              <h3 className="text-base md:text-xl font-normal mb-2">
                Enquires
              </h3>
              <a
                href="mailto:fibispace@gmail.com"
                className="text-base md:text-xl hover:text-gray-600 transition-colors duration-300"
              >
                fibispace@gmail.com
              </a>
            </div>

            {/* Quick Connect */}
            <div>
              <h3 className="text-base md:text-xl font-normal mb-2">
                Quick Connect
              </h3>
              <a
                href="tel:+9779741661719"
                className="text-base md:text-xl hover:text-gray-600 transition-colors duration-300"
              >
                +977 974-1661719
              </a>
            </div>
          </div>

          {/* Column 3 - Enquiries & Quick Connect
          <div className="space-y-8">
            
          </div> */}

          {/* Column 4 - Let's Connect Form */}
          <div>
            <h2 className="text-2xl md:text-5xl font-medium mb-6">
              Let's Connect
            </h2>
            <div className="border-2 border-black rounded-2xl p-6 space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-transparent border-none outline-none text-base placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border-none outline-none text-base placeholder-gray-400"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-transparent border-none outline-none text-base placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            © {currentYear} Fibi Space. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
