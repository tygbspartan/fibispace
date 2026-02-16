import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectsAPI, teamAPI } from "../../services/api";
import { useAuth } from "../context/AuthContext";

interface Stats {
  totalProjects: number;
  totalMembers: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string[];
  mainImage: string;
  createdAt: string;
}

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  aboutMe: string;
  image: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalMembers: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, projectsRes, teamRes] = await Promise.all([
        projectsAPI.getStats(),
        projectsAPI.getAll(),
        teamAPI.getAll(),
      ]);

      console.log("Team Response:", teamRes.data); // Debug log

      setStats({
        totalProjects: statsRes.data.totalProjects || 0,
        totalMembers: teamRes.data.count || 0,
      });
      setProjects(projectsRes.data.projects?.slice(0, 5) || []);
      setTeamMembers(teamRes.data.members?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, FibiSpace Admin</span>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-sm font-medium opacity-90 uppercase tracking-wide">
              Total Projects
            </h3>
            <p className="text-4xl font-bold mt-2">{stats.totalProjects}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-sm font-medium opacity-90 uppercase tracking-wide">
              Team Members
            </h3>
            <p className="text-4xl font-bold mt-2">{stats.totalMembers}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/projects/create"
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
              Create New Project
            </Link>
            <Link
              to="/admin/projects"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition"
            >
              View All Projects
            </Link>
            <Link
              to="/admin/team/create"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-flex items-center"
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
              Add Team Member
            </Link>
            <Link
              to="/admin/team"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition"
            >
              Manage Team
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Projects
          </h2>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No projects yet</p>
              <Link
                to="/admin/projects/create"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Create your first project →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/80?text=No+Image";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {project.category.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                        >
                          {cat.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/admin/projects/edit/${project.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Team Members */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Team Members
          </h2>
          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No team members yet</p>
              <Link
                to="/admin/team/create"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Add your first team member →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 object-cover rounded-full mx-auto mb-3"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/80?text=No+Image";
                    }}
                  />
                  <h3 className="font-semibold text-gray-900 text-center text-sm">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 text-xs text-center mb-3">
                    {member.designation}
                  </p>
                  <Link
                    to={`/admin/team/edit/${member.id}`}
                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition text-xs"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
