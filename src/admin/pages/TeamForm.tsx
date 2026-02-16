import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { teamAPI } from "../../services/api";
import { TeamMember } from "../../types";

const TeamForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    aboutMe: "",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && id) {
      fetchTeamMember(parseInt(id));
    }
  }, [id, isEditMode]);

  const fetchTeamMember = async (memberId: number) => {
    try {
      setLoading(true);
      const response = await teamAPI.getById(memberId);
      console.log("Fetch Member Response:", response.data); // Debug log
      const member = response.data.member; // Changed from teamMember to member
      setFormData({
        name: member.name,
        designation: member.designation,
        aboutMe: member.aboutMe,
        image: member.image,
      });
    } catch (error) {
      console.error("Error fetching team member:", error);
      alert("Failed to load team member");
      navigate("/admin/team");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    } else if (formData.designation.length > 100) {
      newErrors.designation = "Designation must be less than 100 characters";
    }

    if (!formData.aboutMe.trim()) {
      newErrors.aboutMe = "About me is required";
    } else if (formData.aboutMe.length > 500) {
      newErrors.aboutMe = "About me must be less than 500 characters";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && id) {
        await teamAPI.update(parseInt(id), formData);
        alert("Team member updated successfully!");
      } else {
        await teamAPI.create(formData);
        alert("Team member created successfully!");
      }

      navigate("/admin/team");
    } catch (error) {
      console.error("Error saving team member:", error);
      alert("Failed to save team member");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/admin/team"
            className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
          >
            ← Back to Team
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Team Member" : "Add Team Member"}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6"
        >
          {/* Name */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter member name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Designation */}
          <div className="mb-6">
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Designation *
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.designation ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Software Engineer, Marketing Manager"
            />
            {errors.designation && (
              <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
            )}
          </div>

          {/* About Me */}
          <div className="mb-6">
            <label
              htmlFor="aboutMe"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              About Me *
            </label>
            <textarea
              id="aboutMe"
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.aboutMe ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Brief description about the team member"
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.aboutMe.length}/500 characters
            </p>
            {errors.aboutMe && (
              <p className="mt-1 text-sm text-red-600">{errors.aboutMe}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Image URL *
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
            {formData.image && isValidUrl(formData.image) && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Image Preview:
                </p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/200?text=Invalid+Image";
                  }}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Member"
                  : "Create Member"}
            </button>
            <Link
              to="/admin/team"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
