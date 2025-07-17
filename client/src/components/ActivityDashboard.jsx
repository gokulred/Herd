import { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Set axios base URL for all requests
axios.defaults.baseURL = "http://my-auth-app.test";
axios.defaults.withCredentials = true;

export default function ActivityDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    blocked: 0,
  });
  const [error, setError] = useState("");

  const fetchUserStats = useCallback(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const users = response.data;
        const total = users.length;
        const pending = users.filter((u) => u.status === "pending").length;
        const active = users.filter((u) => u.status === "approved").length;
        const blocked = users.filter((u) => u.status === "blocked").length;
        setStats({ total, pending, active, blocked });
      })
      .catch((error) => {
        setError("Could not fetch user statistics.");
        console.error("Error fetching user stats:", error);
      });
  }, []);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  if (error) {
    return (
      <div className="p-4 mb-4 text-red-500 bg-red-100 rounded-lg">{error}</div>
    );
  }

  const statCards = [
    { title: "Total Users", value: stats.total },
    { title: "Pending Users", value: stats.pending },
    { title: "Active Users", value: stats.active },
    { title: "Blocked Users", value: stats.blocked },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <h3 className="text-4xl font-bold text-gray-900">{card.value}</h3>
            <p className="text-gray-600 mt-2">{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
