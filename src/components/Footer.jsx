import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { socials } from "../json/datas";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-white text-black pt-40 sm:pt-60 md:pt-80 pb-6 sm:pb-8 px-4 sm:px-8 md:px-16 lg:px-24 min-h-screen flex flex-col"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        overflowX: "hidden",
      }}
    >
      <div className="flex-grow">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16">
          {/* Column 1 - Address */}
          <div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
              Swayambhu Marg
              <br />
              17-Dhalko
              <br />
              Kathmandu, Nepal
            </p>
          </div>

          {/* Column 2 - Social Links */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-16">
            <div>
              <ul className="space-y-1.5 sm:space-y-2">
                {socials.map((social, index) => (
                  <li key={index}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base md:text-lg lg:text-xl hover:text-gray-600 transition-colors duration-300"
                    >
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enquiries */}
            <div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-normal mb-1.5 sm:mb-2">
                Enquires
              </h3>
              <a
                href="mailto:fibispace@gmail.com"
                className="text-sm sm:text-base md:text-lg lg:text-xl hover:text-gray-600 transition-colors duration-300 break-all"
              >
                fibispace@gmail.com
              </a>
            </div>

            {/* Quick Connect */}
            <div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-normal mb-1.5 sm:mb-2">
                Quick Connect
              </h3>
              <a
                href="tel:+9779741661719"
                className="text-sm sm:text-base md:text-lg lg:text-xl hover:text-gray-600 transition-colors duration-300"
              >
                +977 974-1661719
              </a>
            </div>
          </div>
          {/* Column 3 - Let's Connect Form */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium mb-4 sm:mb-6">
              Let's Connect
            </h2>

            {/* FormSubmit - No backend needed */}
            <form
              action="https://formsubmit.co/fibispace@gmail.com"
              method="POST"
              className="border-2 border-black rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5"
            >
              {/* Honeypot spam protection */}
              <input type="text" name="_honey" style={{ display: "none" }} />

              {/* Disable captcha */}
              <input type="hidden" name="_captcha" value="false" />

              {/* Optional: Redirect to thank you page */}
              {/* <input type="hidden" name="_next" value="https://yourwebsite.com/thank-you" /> */}

              {/* Modern Input Fields with Bottom Border */}
              <div className="border-b-2 border-gray-300 focus-within:border-black transition-colors pb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full bg-transparent border-none outline-none text-sm sm:text-base placeholder-gray-400 focus:placeholder-gray-600 transition-colors"
                />
              </div>

              <div className="border-b-2 border-gray-300 focus-within:border-black transition-colors pb-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full bg-transparent border-none outline-none text-sm sm:text-base placeholder-gray-400 focus:placeholder-gray-600 transition-colors"
                />
              </div>

              <div className="border-b-2 border-gray-300 focus-within:border-black transition-colors pb-2">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full bg-transparent border-none outline-none text-sm sm:text-base placeholder-gray-400 focus:placeholder-gray-600 transition-colors"
                />
              </div>

              {/* Submit button with hover-only arrow */}
              <div className="mt-2">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-black text-white rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>Get in Touch</span>
                  <span className="opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[20px] overflow-hidden transition-all duration-300">
                    →
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright - Sticks to Bottom */}
      <div className="pt-6 sm:pt-8 border-t border-gray-200 mt-auto">
        <p className="text-xs sm:text-sm text-gray-600">
          © {currentYear} Fibi Space. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
