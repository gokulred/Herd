import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import echo from "../echo"; // Import the configured Echo instance

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError("Could not fetch users.");
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    fetchUsers();

    const channel = echo.private("admin");

    channel.listen("NewUserRegistered", (e) => {
      console.log("Notification received:", e);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `New user '${e.user.name}' has registered.`,
      ]);
      fetchUsers();
    });

    return () => {
      channel.stopListening("NewUserRegistered");
      echo.leave("admin");
    };
  }, []);

  const handleApprove = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `/api/admin/users/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, status: "approved" } : user
          )
        );
      });
  };

  const handleBlock = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `/api/admin/users/${id}/block`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, status: "blocked" } : user
          )
        );
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <p className="px-4 py-2 text-sm text-gray-700 font-bold">
                        Notifications
                      </p>
                      {notifications.length > 0 ? (
                        notifications.map((note, index) => (
                          <div
                            key={index}
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            {note}
                          </div>
                        ))
                      ) : (
                        <p className="px-4 py-2 text-sm text-gray-500">
                          No new notifications
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

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
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
        {error && (
          <div className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Account Type</th>
                <th className="py-2 px-4 text-left">Business Name</th>
                <th className="py-2 px-4 text-left">Address</th>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.account_type}</td>
                  <td className="py-2 px-4">{user.business_name || "N/A"}</td>
                  <td className="py-2 px-4">
                    {`${user.street || ""}, ${user.city || ""}, ${
                      user.state || ""
                    } ${user.zip_code || ""}`}
                  </td>
                  <td className="py-2 px-4">{user.phone || "N/A"}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : user.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {user.status === "pending" && (
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Approve
                      </button>
                    )}
                    {user.status === "approved" && (
                      <button
                        onClick={() => handleBlock(user.id)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Block
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
