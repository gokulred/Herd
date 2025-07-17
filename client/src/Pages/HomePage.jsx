import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get("/api/shows");
        setShows(response.data);
      } catch (err) {
        setError("Could not fetch events. Please try again later.");
        console.error("Error fetching shows:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-700 bg-red-100">{error}</div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
          Upcoming Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shows.map((show) => (
            <div
              key={show.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
            >
              <Link to={`/events/${show.id}`}>
                <img
                  src={`/storage/${show.image_path}`}
                  alt={show.title}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400/e2e8f0/e2e8f0?text=Image";
                  }}
                />
              </Link>
              <div className="p-6">
                <p className="text-sm text-indigo-600 font-semibold">
                  {new Date(show.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {show.title}
                </h2>
                <p className="text-gray-600 mt-2">At {show.venue}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Organized by {show.user.name}
                </p>
                <div className="mt-6 flex justify-between items-center">
                  <p className="text-xl font-bold text-gray-900">
                    ${show.ticket_price}
                  </p>
                  <Link
                    to={`/events/${show.id}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    View & Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
