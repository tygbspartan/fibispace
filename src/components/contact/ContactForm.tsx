import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { contactAPI } from "../../services/api";

const MONTSERRAT = "Montserrat, sans-serif";
const INTER = "Inter, sans-serif";

// Everything is required except the organisation, which many people will not
// have. `required` drives both the asterisk and the validation, so the two can
// never disagree.
const FIELDS = [
  { name: "name", label: "Full Name", required: true },
  { name: "orgName", label: "Organization's Name", required: false },
  { name: "phone", label: "Contact Number", required: true },
  { name: "email", label: "Email", required: true },
  { name: "service", label: "Service", required: true },
] as const;

const EMPTY = {
  name: "",
  orgName: "",
  phone: "",
  email: "",
  service: "",
  message: "",
};

const ContactForm: React.FC = () => {
  const location = useLocation();
  // Set when arriving from a service page, so the field starts filled in.
  const service = location?.state?.service || "";

  const [formData, setFormData] = useState({ ...EMPTY, service });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    for (const field of FIELDS) {
      if (field.required && !formData[field.name].trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    }

    if (
      formData.phone.trim() &&
      !/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please tell us about your project";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error as soon as they start fixing it.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await contactAPI.submit(formData);
      alert("Thank you for contacting us! We will get back to you soon.");
      setFormData(EMPTY);
      setErrors({});
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: INTER,
    fontWeight: 400,
    color: "#111111",
  };
  const labelClass = "text-[12px] md:text-[16px]";

  const inputClass =
    "w-full mt-1.5 px-3 py-2 rounded-[10px] border bg-white text-[14px] outline-none transition-colors focus:border-primary";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[10px] border border-black/10 bg-white p-6 md:p-8 lg:p-10"
    >
      <div className="space-y-5">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className={labelClass}
              style={labelStyle}
            >
              {field.label}
              {field.required && <span style={{ color: "#E5322D" }}>*</span>}
            </label>
            <input
              id={field.name}
              type={
                field.name === "email"
                  ? "email"
                  : field.name === "phone"
                    ? "tel"
                    : "text"
              }
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              aria-invalid={!!errors[field.name]}
              className={`${inputClass} ${
                errors[field.name] ? "border-red-500" : "border-black/15"
              }`}
              style={{ fontFamily: INTER }}
            />
            {errors[field.name] && (
              <p className="mt-1 text-[12px] text-red-600">
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        {/* Message */}
        <div>
          <label htmlFor="message" className={labelClass} style={labelStyle}>
            Tell us about your project.
            <span style={{ color: "#E5322D" }}>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            aria-invalid={!!errors.message}
            className={`${inputClass} resize-none ${
              errors.message ? "border-red-500" : "border-black/15"
            }`}
            style={{ fontFamily: INTER }}
          />
          {errors.message && (
            <p className="mt-1 text-[12px] text-red-600">{errors.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group mt-6 flex md:inline-flex w-full md:w-fit justify-center items-center gap-2 rounded-full bg-black text-white px-5 py-3 md:px-6 md:py-3 text-[12px] md:text-[13px] hover:bg-black/80 transition-colors disabled:opacity-60"
        style={{ fontFamily: MONTSERRAT, fontWeight: 600 }}
      >
        {loading ? "Sending…" : "Let's Connect"}
        <ArrowRight
          size={15}
          strokeWidth={2}
          className="group-hover:animate-nudge motion-reduce:animate-none"
        />
      </button>
    </form>
  );
};

export default ContactForm;
