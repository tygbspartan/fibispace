import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import contentData from "../data/content.json";
import { contactAPI } from "../services/api";
import { Copy, Check } from "lucide-react";

const Footer: React.FC = () => {
  const { contact } = contentData;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Submit with defaults for missing fields
      await contactAPI.submit({
        name: formData.name,
        orgName: "", // Default for footer form
        phone: formData.phone,
        email: formData.email,
        service: "General Inquiry", // Default for footer form
        message: "Contact request from footer", // Default for footer form
      });

      alert("Thank you for contacting us! We will get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting footer contact form:", error);
      alert("Failed to submit. Please try again or use the contact page.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <footer
      className="bg-white pt-8 pb-6 md:pt-12 md:pb-8 lg:pt-16 border-t border-gray-200"
      id="contact"
    >
      <div className="px-6 md:px-12 lg:px-24">
        {/* 3 Equal Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {/* Column 1 - Location & Quick Connect */}
          <div className="space-y-6 md:space-y-8">
            {/* Location */}
            <div>
              <h3 className="capitalize mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl font-semibold">
                Location
              </h3>
              <address className="not-italic capitalize text-base md:text-lg lg:text-2xl leading-relaxed">
                {contact.location.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </address>
            </div>

            {/* Quick Connect */}
            <div>
              <h3 className="capitalize mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl font-semibold">
                Quick Connect
              </h3>
              <a
                href="https://wa.me/9779741661719"
                target="_blank"
                className="capitalize hover:text-[#008AA9] transition-colors block text-base md:text-lg lg:text-2xl leading-relaxed"
              >
                {contact.phone}
              </a>
            </div>
          </div>

          {/* Column 2 - Socials & Enquires */}
          <div className="space-y-6 md:space-y-8">
            {/* Socials */}
            <div>
              <h3 className="capitalize mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl font-semibold">
                Socials
              </h3>
              <div className="space-y-2 text-base md:text-lg lg:text-2xl leading-relaxed">
                <a
                  href={contact.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block capitalize hover:text-[#008AA9] transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={contact.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block capitalize hover:text-[#008AA9] transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={contact.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block capitalize hover:text-[#008AA9] transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Enquires */}
            <div>
              <h3 className="capitalize mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl font-semibold">
                Enquires
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-[#008AA9] transition-colors block text-base md:text-lg lg:text-2xl leading-relaxed"
                >
                  {contact.email}
                </a>
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-[#008AA9] transition-colors"
                  title="Copy email"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Column 3 - Let's Connect Form */}
          <div className="flex flex-col">
            <h2 className="mb-6 md:mb-8 text-4xl md:text-5xl lg:text-6xl font-normal leading-tight">
              {contact.heading}
            </h2>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1">
              {/* Form Inputs */}
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 flex-1">
                {/* Name Input */}
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={`w-full px-4 md:px-6 py-3 md:py-4 bg-gray-100 rounded-md text-base md:text-lg ${
                      errors.name ? "border-2 border-red-500" : ""
                    }`}
                    style={{ fontFamily: "Inter" }}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={`w-full px-4 md:px-6 py-3 md:py-4 bg-gray-100 rounded-md text-base md:text-lg ${
                      errors.email ? "border-2 border-red-500" : ""
                    }`}
                    style={{ fontFamily: "Inter" }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={`w-full px-4 md:px-6 py-3 md:py-4 bg-gray-100 rounded-md text-base md:text-lg ${
                      errors.phone ? "border-2 border-red-500" : ""
                    }`}
                    style={{ fontFamily: "Inter" }}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 md:px-8 py-3 md:py-4 bg-[#008AA9] text-white rounded-md font-medium hover:bg-[#007a98] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg lg:text-xl"
                style={{ fontFamily: "Inter" }}
              >
                {loading ? "Sending..." : "Contact Us"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 text-center">
          <p className="text-xs md:text-sm text-gray-600">
            © {new Date().getFullYear()} FIBI SPACE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
