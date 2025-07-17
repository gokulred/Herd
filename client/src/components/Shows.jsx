import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/shows", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShows(response.data);
      })
      .catch(() => {
        setError("Could not fetch shows.");
      });
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upcoming Shows</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.map((show) => (
          <div
            key={show.id}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={`/storage/${show.image_path}`}
              alt={show.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{show.title}</h3>
              <p className="text-sm text-gray-600">
                Organized by {show.user.name}
              </p>
              <p className="mt-2 text-gray-700">
                {show.content.substring(0, 100)}...
              </p>
              <div className="mt-4">
                <Link
                  to={`/shows/${show.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View Details & Book
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
