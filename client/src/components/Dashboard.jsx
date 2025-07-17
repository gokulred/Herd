import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Profile from "./Profile";
import CreateShow from "./CreateShow";
import MyBookings from "./MyBookings";
import Shows from "./Shows";
import ShowDetails from "./ShowDetails";
import MyShows from "./MyShows"; // To see bookings for shows created by the user

export default function Dashboard({ initialView = "profile" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get show ID if present in URL

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(initialView);

  // This effect ensures that if the user navigates directly to a show's URL,
  // the correct view is displayed within the dashboard.
  useEffect(() => {
    if (location.pathname.startsWith("/shows/")) {
      setActiveTab("show-details");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    // This should be handled by the ProtectedRoute, but as a fallback:
    navigate("/login");
    return null;
  }

  // A helper function to render the main content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile user={user} setUser={setUser} />;
      case "shows":
        return <Shows />;
      case "create-show":
        return <CreateShow />;
      case "my-bookings":
        return <MyBookings />;
      case "my-shows":
        return <MyShows />;
      case "show-details":
        return <ShowDetails />; // It will get the ID from the URL via useParams
      default:
        return <Profile user={user} setUser={setUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome, {user.name}</p>
        </div>
        <nav className="mt-6 flex-1">
          <a
            href="#"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center px-6 py-3 text-gray-700 ${
              activeTab === "profile" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <span className="mx-3">Profile</span>
          </a>
          <a
            href="#"
            onClick={() => setActiveTab("shows")}
            className={`flex items-center px-6 py-3 text-gray-700 ${
              activeTab === "shows" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <span className="mx-3">All Shows</span>
          </a>
          <a
            href="#"
            onClick={() => setActiveTab("my-bookings")}
            className={`flex items-center px-6 py-3 text-gray-700 ${
              activeTab === "my-bookings" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <span className="mx-3">My Bookings</span>
          </a>
          <hr className="my-4" />
          <p className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase">
            Organizer
          </p>
          <a
            href="#"
            onClick={() => setActiveTab("create-show")}
            className={`flex items-center px-6 py-3 text-gray-700 ${
              activeTab === "create-show" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <span className="mx-3">Create Show</span>
          </a>
          <a
            href="#"
            onClick={() => setActiveTab("my-shows")}
            className={`flex items-center px-6 py-3 text-gray-700 ${
              activeTab === "my-shows" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <span className="mx-3">My Shows & Bookings</span>
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
