import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await axios.get(`/api/shows/${id}`);
        setShow(response.data);
      } catch (err) {
        setError("Could not fetch event details.");
        console.error("Error fetching show:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  const handleBookNow = () => {
    // Redirect to the dashboard, which will handle the auth check.
    // We pass the intended destination in the state.
    navigate("/dashboard", { state: { from: `/events/${id}` } });
  };

  if (loading) {
    return <div className="text-center p-10">Loading event...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-700 bg-red-100">{error}</div>
    );
  }

  if (!show) {
    return <div className="text-center p-10">Event not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img
          src={`/storage/${show.image_path}`}
          alt={show.title}
          className="w-full h-96 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/1200x600/e2e8f0/e2e8f0?text=Image";
          }}
        />
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {show.title}
          </h1>
          <p className="text-md text-gray-500 mt-2">
            Organized by{" "}
            <span className="font-semibold text-gray-700">
              {show.user.name}
            </span>
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-indigo-600">Date & Time</p>
              <p className="text-gray-700">
                {new Date(show.date).toLocaleDateString()} at {show.time}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-indigo-600">Venue</p>
              <p className="text-gray-700">{show.venue}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-indigo-600">Price</p>
              <p className="text-gray-700">${show.ticket_price}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">
              About the Event
            </h2>
            <p className="text-gray-600 mt-4 whitespace-pre-wrap">
              {show.content}
            </p>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleBookNow}
              className="w-full md:w-auto px-12 py-4 text-lg font-medium text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Book Your Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
