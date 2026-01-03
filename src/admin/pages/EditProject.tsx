import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { projectsAPI } from '../../services/api';
import { useAuth } from '../context/AuthContext';

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: [] as string[],
    mainImage: '',
    thumbnailImages: [] as string[],
    keyFindings: [] as string[],
  });
  const [newThumbnail, setNewThumbnail] = useState('');
  const [newKeyFinding, setNewKeyFinding] = useState('');

  const categories = [
    { value: 'printing', label: 'Printing' },
    { value: 'website_creation', label: 'Website Creation' },
    { value: 'ui_ux', label: 'UI/UX' },
    { value: 'digital_marketing', label: 'Digital Marketing' },
  ];

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getById(Number(id));
      setFormData(response.data.project);
    } catch (error) {
      alert('Error loading project');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }));
  };

  const addThumbnail = () => {
    if (newThumbnail.trim() && formData.thumbnailImages.length < 10) {
      setFormData((prev) => ({
        ...prev,
        thumbnailImages: [...prev.thumbnailImages, newThumbnail.trim()],
      }));
      setNewThumbnail('');
    }
  };

  const removeThumbnail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      thumbnailImages: prev.thumbnailImages.filter((_, i) => i !== index),
    }));
  };

  const addKeyFinding = () => {
    if (newKeyFinding.trim()) {
      setFormData((prev) => ({
        ...prev,
        keyFindings: [...prev.keyFindings, newKeyFinding.trim()],
      }));
      setNewKeyFinding('');
    }
  };

  const removeKeyFinding = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyFindings: prev.keyFindings.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.category.length === 0) {
      alert('Please select at least one category');
      return;
    }

    setSaving(true);

    try {
      await projectsAPI.update(Number(id), formData);
      alert('Project updated successfully!');
      navigate('/admin/projects');
    } catch (error: any) {
      alert('Error updating project: ' + error.response?.data?.error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/projects"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              ← Back to Projects
            </Link>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categories <span className="text-red-500">*</span> (Select multiple)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <label
                  key={cat.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.category.includes(cat.value)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.category.includes(cat.value)}
                    onChange={() => handleCategoryChange(cat.value)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Main Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.mainImage}
              onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
            {formData.mainImage && (
              <div className="mt-4">
                <img
                  src={formData.mainImage}
                  alt="Main preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Thumbnail Images (Max 10)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newThumbnail}
                onChange={(e) => setNewThumbnail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="https://i.imgur.com/thumb.jpg"
              />
              <button
                type="button"
                onClick={addThumbnail}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Add
              </button>
            </div>
            {formData.thumbnailImages.length > 0 && (
              <div className="space-y-2">
                {formData.thumbnailImages.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Invalid';
                      }}
                    />
                    <span className="flex-1 text-sm text-gray-600 truncate">{url}</span>
                    <button
                      type="button"
                      onClick={() => removeThumbnail(index)}
                      className="bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Key Findings */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Key Findings
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newKeyFinding}
                onChange={(e) => setNewKeyFinding(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Enter a key finding"
              />
              <button
                type="button"
                onClick={addKeyFinding}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Add
              </button>
            </div>
            {formData.keyFindings.length > 0 && (
              <div className="space-y-2">
                {formData.keyFindings.map((finding, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="flex-1 text-gray-700">{finding}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyFinding(index)}
                      className="bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;