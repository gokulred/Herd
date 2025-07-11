import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const fetchUsers = useCallback(() => {
    const token = localStorage.getItem("token");
    const params = {};
    if (searchTerm) {
      params.search = searchTerm;
    }
    if (statusFilter && statusFilter !== "All") {
      params.status = statusFilter.toLowerCase();
    }

    axios
      .get("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError("Could not fetch users.");
        console.error("Error fetching users:", error);
      });
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      fetchUsers();
    }, 300); // Debounce API calls

    return () => clearTimeout(fetchTimeout);
  }, [fetchUsers]);

  const handleAction = (action, id) => {
    const token = localStorage.getItem("token");
    const actions = {
      approve: {
        method: "put",
        url: `/api/admin/users/${id}/approve`,
        data: {},
      },
      block: { method: "put", url: `/api/admin/users/${id}/block`, data: {} },
      delete: { method: "delete", url: `/api/admin/users/${id}` },
    };

    axios({ ...actions[action], headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchUsers())
      .catch((err) => setError(`Failed to ${action} user.`));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const filters = ["All", "Pending", "Active", "Blocked", "Deleted"];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="mx-3">Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 text-gray-700 bg-gray-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A10.004 10.004 0 0012 10a10.004 10.004 0 00-3-5.197M15 21a6 6 0 00-9-5.197"
              />
            </svg>
            <span className="mx-3">Users</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center h-16">
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none"
                >
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                {showProfileMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 p-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      statusFilter === filter
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Email", "Phone", "Status", "Actions"].map(
                      (head) => (
                        <th
                          key={head}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phone || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : user.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status === "approved"
                              ? "Active"
                              : user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-gray-600 hover:text-gray-900 mr-3"
                          >
                            View
                          </button>
                          {user.status === "pending" && (
                            <button
                              onClick={() => handleAction("approve", user.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Approve
                            </button>
                          )}
                          {user.status === "approved" && (
                            <button
                              onClick={() => handleAction("block", user.id)}
                              className="text-yellow-600 hover:text-yellow-900 mr-3"
                            >
                              Block
                            </button>
                          )}
                          <button
                            onClick={() => handleAction("delete", user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4 text-sm text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                User Profile
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Phone:</strong> {selectedUser.phone || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Account Type:</strong> {selectedUser.account_type}
                </p>
                {selectedUser.business_name && (
                  <p className="text-sm text-gray-500">
                    <strong>Business Name:</strong> {selectedUser.business_name}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  <strong>Address:</strong>{" "}
                  {`${selectedUser.street || ""}, ${selectedUser.city || ""}, ${
                    selectedUser.state || ""
                  } ${selectedUser.zip_code || ""}`}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
