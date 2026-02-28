import React, { useState } from "react";
import { contactAPI } from "../../services/api";

const ContactForm: React.FC = () => {
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
      setErrors({});
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <p className="mt-1 text-sm text-red-600">{errors.orgName}</p>
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
          <p className="mt-1 text-sm text-red-600">{errors.service}</p>
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
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-[#008AA9] hover:bg-[#007a98] text-white px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          fontFamily: "Inter",
          fontSize: "clamp(16px, 2vw, 18px)",
        }}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default ContactForm;
