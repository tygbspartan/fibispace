import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { testimonyAPI } from "../../services/api";
import { Testimony } from "../../types";

const TestimonyList: React.FC = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const fetchTestimonies = async () => {
    try {
      const response = await testimonyAPI.getAll();
      setTestimonies(response.data.testimonies || []);
    } catch (error) {
      console.error("Error fetching testimonies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await testimonyAPI.delete(id);
      setTestimonies(testimonies.filter((testimony) => testimony.id !== id));
      alert("Testimony deleted successfully");
    } catch (error) {
      console.error("Error deleting testimony:", error);
      alert("Failed to delete testimony");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading testimonies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link
                to="/admin/dashboard"
                className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Testimonies ({testimonies.length})
              </h1>
            </div>
            <Link
              to="/admin/testimonies/create"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Testimony
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {testimonies.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No testimonies yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first testimony
            </p>
            <Link
              to="/admin/testimonies/create"
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add your first testimony
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonies.map((testimony) => (
              <div
                key={testimony.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {testimony.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {testimony.companyName}
                  </p>

                  {/* Three lines is enough to tell them apart; the full text is
                      in the edit form. */}
                  <p className="mt-3 mb-4 text-gray-700 line-clamp-3">
                    {testimony.description}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/testimonies/edit/${testimony.id}`}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-center transition font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(testimony.id, testimony.name)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonyList;
