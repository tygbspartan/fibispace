import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { clientAPI } from "../../services/api";

const ClientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      fetchClient(parseInt(id));
    }
  }, [id, isEdit]);

  const fetchClient = async (clientId: number) => {
    try {
      const response = await clientAPI.getById(clientId);
      const client = response.data.client;
      setFormData({
        name: client.name,
        image: client.image,
      });
    } catch (error) {
      console.error("Error fetching client:", error);
      alert("Failed to load client data");
      navigate("/admin/clients");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Client name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Logo URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.image)) {
      newErrors.image = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      if (isEdit && id) {
        await clientAPI.update(parseInt(id), formData);
        alert("Client updated successfully");
      } else {
        await clientAPI.create(formData);
        alert("Client added successfully");
        setFormData({ name: "", image: "" });
      }

      navigate("/admin/clients");
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Failed to save client");
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
                value={formData.name}
                onChange={handleChange}
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
                {formData.name.length}/100 characters
              </p>
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.image ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com/logo.png"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}

              {/* Logo Preview */}
              {formData.image && !errors.image && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Logo Preview:
                  </p>
                  <div className="w-48 h-48 bg-white border border-gray-300 rounded-lg flex items-center justify-center p-4">
                    <img
                      src={formData.image}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/200x200?text=Invalid+URL";
                      }}
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
