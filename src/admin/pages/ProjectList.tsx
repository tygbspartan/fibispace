import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../services/api';
import { useAuth } from '../context/AuthContext';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string[];
  mainImage: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { logout } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    try {
      const params = filter !== 'all' ? { category: filter } : {};
      const response = await projectsAPI.getAll(params);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
      alert('Project deleted successfully!');
    } catch (error: any) {
      alert('Error deleting project: ' + error.response?.data?.error);
    }
  };

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'printing', label: 'Printing' },
    { value: 'website_creation', label: 'Website Creation' },
    { value: 'ui_ux', label: 'UI/UX' },
    { value: 'digital_marketing', label: 'Digital Marketing' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/dashboard"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              ← Dashboard
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Link
            to="/admin/projects/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Project
          </Link>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === cat.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No projects found</p>
            <Link
              to="/admin/projects/create"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {project.category.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full"
                      >
                        {cat.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/projects/edit/${project.id}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg transition font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium"
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

export default ProjectList;