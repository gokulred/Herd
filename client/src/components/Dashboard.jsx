import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 1. Make sure Link is imported

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Dashboard</h2>
        <p className="text-center text-gray-700">
          Welcome, <span className="font-semibold">{user.name}!</span>
        </p>

        {/* --- This is the new section --- */}
        {/* 2. Conditionally render the link to the admin dashboard */}
        {user.is_admin && (
          <div className="text-center">
            <Link
              to="/admin"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        )}
        {/* --- End of new section --- */}

        <p className="text-center text-gray-500">Your email is {user.email}.</p>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
