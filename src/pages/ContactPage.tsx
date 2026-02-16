import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { contactAPI } from "../services/api";
import CTA from "../components/CTA";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    orgName: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.orgName.trim()) {
      newErrors.orgName = "Organization name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.service.trim()) {
      newErrors.service = "Service is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
      await contactAPI.submit(formData);
      alert("Thank you for contacting us! We will get back to you soon.");
      // Reset form
      setFormData({
        name: "",
        orgName: "",
        phone: "",
        email: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Contact Form Section */}
      <section className="bg-white pt-8 md:pt-12 lg:pt-20 pb-12 md:pb-20">
        <div className="px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Side - Contact Info */}
            <div>
              <p
                className="text-[#008AA9]"
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  fontWeight: "500",
                }}
              >
                Contact Us
              </p>

              <h1
                className="mb-6"
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(32px, 5vw, 48px)",
                  fontWeight: "500",
                  lineHeight: "clamp(40px, 6vw, 64px)",
                }}
              >
                We'd Love to Hear From You.
              </h1>

              <p
                className="text-gray-700 mb-12"
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(16px, 2.5vw, 24px)",
                  fontWeight: "300",
                  lineHeight: "clamp(24px, 4vw, 40px)",
                }}
              >
                Have a project in mind? Or maybe you just want to know more
                about how we work? Drop us a message. We are always happy to
                discuss new ideas and potential collaborations.
              </p>

              {/* Easy Connect */}
              <div>
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(18px, 2.5vw, 24px)",
                    fontWeight: "600",
                  }}
                >
                  Easy Connect
                </h3>
                <p
                  className="text-gray-400 mb-2"
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(20px, 3vw, 28px)",
                    fontWeight: "300",
                  }}
                >
                  +977 981-8161125
                </p>
                <p
                  className="text-gray-400"
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(20px, 3vw, 28px)",
                    fontWeight: "300",
                  }}
                >
                  fibispace@gmail.com
                </p>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={`w-full px-6 py-4 bg-gray-100 rounded-md text-base ${
                      errors.name ? "border-2 border-red-500" : ""
                    }`}
                    style={{ fontFamily: "Inter" }}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Organization Name */}
                <div>
                  <input
                    type="text"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    placeholder="Organization Name"
                    className={`w-full px-6 py-4 bg-gray-100 rounded-md text-base ${
                      errors.orgName ? "border-2 border-red-500" : ""
                    }`}
                    style={{ fontFamily: "Inter" }}
                  />
                  {errors.orgName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.orgName}
                    </p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    className={`w-full px-6 py-4 bg-gray-100 rounded-md text-base ${
                      errors.phone ? "border-2 border-red-500" : ""
                    }`}
                    style={{ fontFamily: "Inter" }}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={`w-full px-6 py-4 bg-gray-100 rounded-md text-base ${
                      errors.email ? "border-2 border-red-500" : ""
                    }`}
                    style={{ fontFamily: "Inter" }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Service */}
                <div>
                  <input
                    type="text"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    placeholder="Service"
                    className={`w-full px-6 py-4 bg-gray-100 rounded-md text-base ${
                      errors.service ? "border-2 border-red-500" : ""
                    }`}
                    style={{ fontFamily: "Inter" }}
                  />
                  {errors.service && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Message/Text */}
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Text"
                    rows={5}
                    className={`w-full px-6 py-4 bg-gray-100 rounded-md text-base resize-none ${
                      errors.message ? "border-2 border-red-500" : ""
                    }`}
                    style={{ fontFamily: "Inter" }}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#008AA9] hover:bg-[#007a98] text-white px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "Inter",
                    fontSize: "18px",
                  }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <CTA />

      <Footer />
    </div>
  );
};

export default ContactPage;
