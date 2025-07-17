import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (err) {
        setError("Could not fetch your bookings. Please try again later.");
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading your bookings...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Bookings</h2>
      <div className="space-y-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-bold text-lg text-indigo-600">
                  {booking.show.title}
                </h3>
                <p className="text-sm text-gray-600">
                  You booked{" "}
                  <span className="font-semibold">{booking.tickets}</span>{" "}
                  ticket{booking.tickets > 1 ? "s" : ""}.
                </p>
                <p className="text-sm text-gray-500">
                  Organized by: {booking.show.user.name}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(booking.show.date).toLocaleDateString()} at{" "}
                  {booking.show.time}
                </p>
                <p className="text-sm text-gray-500">
                  Venue: {booking.show.venue}
                </p>
              </div>
              <Link
                to={`/shows/${booking.show.id}`}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
              >
                View Show
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            You haven't booked any shows yet.
          </p>
        )}
      </div>
    </div>
  );
}
