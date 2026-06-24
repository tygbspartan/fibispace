import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { teamAPI, resolveImageUrl } from "../../services/api";

const TeamForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    aboutMe: "",
  });
  // Existing stored image (edit mode) vs. a freshly picked file.
  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && id) {
      fetchTeamMember(parseInt(id));
    }
  }, [id, isEditMode]);

  // Release the object URL created for the local preview.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fetchTeamMember = async (memberId: number) => {
    try {
      setLoading(true);
      const response = await teamAPI.getById(memberId);
      const member = response.data.member;
      setFormData({
        name: member.name,
        designation: member.designation,
        aboutMe: member.aboutMe,
      });
      setExistingImage(member.image);
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

    // An image file is required when creating; on edit the existing one is kept
    // unless a new file is chosen.
    if (!imageFile && !existingImage) {
      newErrors.image = "An image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("aboutMe", formData.aboutMe);
      // Only send a file when one was picked; on edit the server keeps the old
      // image if "image" is absent.
      if (imageFile) data.append("image", imageFile);

      if (isEditMode && id) {
        await teamAPI.update(parseInt(id), data);
        alert("Team member updated successfully!");
      } else {
        await teamAPI.create(data);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // What to show in the preview: the new file if picked, else the stored image.
  const previewSrc = previewUrl || resolveImageUrl(existingImage);

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

          {/* Image File */}
          <div className="mb-6">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Image {isEditMode ? "" : "*"}
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
            />
            {isEditMode && (
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to keep the current image.
              </p>
            )}
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
            {previewSrc && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Image Preview:
                </p>
                <img
                  src={previewSrc}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg"
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
