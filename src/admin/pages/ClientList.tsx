import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import { Client } from '../../types';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll();
      setClients(response.data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await clientAPI.delete(id);
      setClients(clients.filter((client) => client.id !== id));
      alert('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Failed to delete client');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading clients...</div>
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
                Manage Clients ({clients.length})
              </h1>
            </div>
            <Link
              to="/admin/clients/create"
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
              Add New Client
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {clients.length === 0 ? (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No clients yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first client
            </p>
            <Link
              to="/admin/clients/create"
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
              Add your first client
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Client Logo */}
                <div className="h-48 bg-gray-100 flex items-center justify-center p-6">
                  <img
                    src={client.image}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://via.placeholder.com/200x200?text=No+Logo';
                    }}
                  />
                </div>

                {/* Client Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4 truncate">
                    {client.name}
                  </h3>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/clients/edit/${client.id}`}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-center transition font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(client.id, client.name)}
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

export default ClientList;