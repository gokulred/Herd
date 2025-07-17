import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // This effect will run when the component mounts and whenever the user navigates,
  // ensuring the navbar is always up-to-date with the auth status.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              EventHub
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Create an Event
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <span className="text-gray-700 text-sm mr-4">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium mr-2"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
