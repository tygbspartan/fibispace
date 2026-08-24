import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { testimonyAPI } from "../../services/api";

const NAME_MAX = 100;
const COMPANY_MAX = 100;
const DESCRIPTION_MAX = 1000;

const TestimonyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      fetchTestimony(parseInt(id));
    }
  }, [id, isEdit]);

  const fetchTestimony = async (testimonyId: number) => {
    try {
      const response = await testimonyAPI.getById(testimonyId);
      const testimony = response.data.testimony;
      setName(testimony.name);
      setCompanyName(testimony.companyName);
      setDescription(testimony.description);
    } catch (error) {
      console.error("Error fetching testimony:", error);
      alert("Failed to load testimony data");
      navigate("/admin/testimonies");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length > NAME_MAX) {
      newErrors.name = `Name must be less than ${NAME_MAX} characters`;
    }

    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (companyName.length > COMPANY_MAX) {
      newErrors.companyName = `Company name must be less than ${COMPANY_MAX} characters`;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length > DESCRIPTION_MAX) {
      newErrors.description = `Description must be less than ${DESCRIPTION_MAX} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clears a field's error as soon as it is touched, the same as the other
  // admin forms.
  const change =
    (field: string, set: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      set(e.target.value);
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = {
        name: name.trim(),
        companyName: companyName.trim(),
        description: description.trim(),
      };

      if (isEdit && id) {
        await testimonyAPI.update(parseInt(id), data);
        alert("Testimony updated successfully");
      } else {
        await testimonyAPI.create(data);
        alert("Testimony added successfully");
      }

      navigate("/admin/testimonies");
    } catch (error: any) {
      console.error("Error saving testimony:", error);
      // The API returns { error: "message" } — show it when there is one, since
      // it is what says which field the server rejected.
      alert(error?.response?.data?.error || "Failed to save testimony");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/admin/testimonies"
            className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
          >
            ← Back to Testimonies
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Testimony" : "Add New Testimony"}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={change("name", setName)}
                maxLength={NAME_MAX}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter the person's name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {name.length}/{NAME_MAX} characters
              </p>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={companyName}
                onChange={change("companyName", setCompanyName)}
                maxLength={COMPANY_MAX}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.companyName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter the company name"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyName}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {companyName.length}/{COMPANY_MAX} characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={description}
                onChange={change("description", setDescription)}
                maxLength={DESCRIPTION_MAX}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="What did they say about working with you?"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {description.length}/{DESCRIPTION_MAX} characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Testimony"
                    : "Add Testimony"}
              </button>
              <Link
                to="/admin/testimonies"
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestimonyForm;
