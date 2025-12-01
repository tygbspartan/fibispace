import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className=" mx-32 px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold" style={{ color: "#12A89D" }}>
          FibiSpace
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          <a href="#" className="hover:text-[#12A89D] transition">Home</a>
          <a href="#" className="hover:text-[#12A89D] transition">Services</a>
          <a href="#" className="hover:text-[#12A89D] transition">Pricing</a>
          <a href="#" className="hover:text-[#12A89D] transition">About</a>
        </div>

        {/* Call-to-action Button */}
        <button
          className="hidden md:block px-4 py-2 rounded-md font-semibold text-sm"
          style={{ backgroundColor: "#12A89D" }}
        >
          Get Started
        </button>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-gray-800 px-6 pb-4 space-y-3 text-sm font-medium">
          <a href="#" className="block py-2 border-b border-gray-700 hover:text-[#12A89D]">
            Home
          </a>
          <a href="#" className="block py-2 border-b border-gray-700 hover:text-[#12A89D]">
            Services
          </a>
          <a href="#" className="block py-2 border-b border-gray-700 hover:text-[#12A89D]">
            Pricing
          </a>
          <a href="#" className="block py-2 border-b border-gray-700 hover:text-[#12A89D]">
            About
          </a>

          <button
            className="w-full mt-2 py-2 rounded-md font-semibold"
            style={{ backgroundColor: "#12A89D" }}
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
