import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On component mount, try to get the user data from local storage.
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      // If user data exists, parse it and set it in the component's state.
      setUser(JSON.parse(storedUser));
    } else {
      // If no user data is found, the user is not authenticated. Redirect to the login page.
      navigate("/login");
    }
  }, [navigate]); // The dependency array ensures this effect runs only once on mount.

  /**
   * Handles the logout process by clearing user data from local storage
   * and redirecting to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // While the user state is being set, display a loading message.
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  // Once the user is loaded, display the dashboard content.
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Dashboard</h2>
        <p className="text-center text-gray-700">
          Welcome, <span className="font-semibold">{user.name}!</span>
        </p>
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
