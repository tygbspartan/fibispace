import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { clientAPI, resolveImageUrl } from "../../services/api";

const ClientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  // Existing stored logo (edit mode) vs. a freshly picked file.
  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      fetchClient(parseInt(id));
    }
  }, [id, isEdit]);

  // Release the object URL created for the local preview.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fetchClient = async (clientId: number) => {
    try {
      const response = await clientAPI.getById(clientId);
      const client = response.data.client;
      setName(client.name);
      setExistingImage(client.image);
    } catch (error) {
      console.error("Error fetching client:", error);
      alert("Failed to load client data");
      navigate("/admin/clients");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Client name is required";
    } else if (name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    // A logo file is required when creating; on edit the existing one is kept
    // unless a new file is chosen.
    if (!imageFile && !existingImage) {
      newErrors.image = "A logo image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", name);
      // Only send a file when one was picked; on edit the server keeps the old
      // image if "image" is absent.
      if (imageFile) data.append("image", imageFile);

      if (isEdit && id) {
        await clientAPI.update(parseInt(id), data);
        alert("Client updated successfully");
      } else {
        await clientAPI.create(data);
        alert("Client added successfully");
      }

      navigate("/admin/clients");
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Failed to save client");
    } finally {
      setLoading(false);
    }
  };

  // What to show in the preview box: the new file if picked, else the stored logo.
  const previewSrc = previewUrl || resolveImageUrl(existingImage);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/admin/clients"
            className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
          >
            ← Back to Clients
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Client" : "Add New Client"}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleNameChange}
                maxLength={100}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter client/company name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {name.length}/100 characters
              </p>
            </div>

            {/* Logo File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Image {isEdit ? "" : "*"}
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${
                  errors.image ? "border-red-500" : "border-gray-300"
                }`}
              />
              {isEdit && (
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty to keep the current logo.
                </p>
              )}
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}

              {/* Logo Preview */}
              {previewSrc && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Logo Preview:
                  </p>
                  <div className="w-48 h-48 bg-white border border-gray-300 rounded-lg flex items-center justify-center p-4">
                    <img
                      src={previewSrc}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}
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
                    ? "Update Client"
                    : "Add Client"}
              </button>
              <Link
                to="/admin/clients"
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

export default ClientForm;
