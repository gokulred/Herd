import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/admin/users", {
        // Use relative URL
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
  }, []);

  const handleApprove = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `/api/admin/users/${id}/approve`, // Use relative URL
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
        `/api/admin/users/${id}/block`, // Use relative URL
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
        // Use relative URL
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-md">
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
