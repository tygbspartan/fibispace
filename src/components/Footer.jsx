import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div className="mx-32 px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
        {/* About */}
        <div>
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: "#12A89D" }}
          >
            About Us
          </h2>
          <p className="text-sm leading-6">
            FibiSpace delivers modern, reliable, and visually appealing digital
            solutions crafted for performance and simplicity.
          </p>
        </div>

        {/* Links */}
        <div>
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: "#12A89D" }}
          >
            Useful Links
          </h2>
          <ul className="text-sm space-y-2">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Services</li>
            <li className="hover:text-white cursor-pointer">Pricing</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: "#12A89D" }}
          >
            Contact Us
          </h2>
          <ul className="text-sm space-y-2">
            <li>Email: support@fibispace.com</li>
            <li>Phone: +977 9800000000</li>
            <li>Location: Kathmandu, Nepal</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: "#12A89D" }}
          >
            Follow Us
          </h2>
          <div className="flex space-x-4 text-2xl">
            <a href="#" className="hover:text-white transition">
              <FaFacebook />
            </a>

            <a href="#" className="hover:text-white transition">
              <FaInstagram />
            </a>

            <a href="#" className="hover:text-white transition">
              <FaTwitter />
            </a>

            <a href="#" className="hover:text-white transition">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-10 pt-4 border-t border-gray-700 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FibiSpace. All rights reserved.
      </div>
    </>
  );
}
