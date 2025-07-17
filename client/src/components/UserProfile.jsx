import React, { useState, useEffect } from "react";

// This is the main component for the user profile page.
function UserProfile() {
  // State to hold user data. Initialized to null.
  const [user, setUser] = useState(null);
  // State to handle loading status
  const [loading, setLoading] = useState(true);

  // useEffect hook runs after the component mounts.
  // It's the perfect place to fetch data from your API.
  useEffect(() => {
    const userId = 1; // In a real app, you'd get this from auth context or URL params

    // Fetch data from your Laravel API endpoint
    fetch(`/api/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data); // Set the user data in state
        setLoading(false); // Set loading to false
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false); // Also stop loading on error
      });
  }, []); // The empty array [] means this effect runs only once

  // Show a loading message while data is being fetched
  if (loading) {
    return <div className="text-center p-10">Loading profile...</div>;
  }

  // Render the profile card using the fetched data and Tailwind CSS classes
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-sm w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <img
            src={user.profile_picture_url || "/default-avatar.png"}
            alt={`${user.name}'s profile`}
            className="w-24 h-24 mb-4 rounded-full object-cover border-2 border-gray-300"
          />
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500 mb-4">@{user.username}</p>
          <p className="text-gray-600 text-center">{user.bio}</p>
          <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
