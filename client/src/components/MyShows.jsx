import { useEffect, useState } from "react";
import axios from "axios";

export default function MyShows() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedShow, setExpandedShow] = useState(null);

  useEffect(() => {
    const fetchMyShows = async () => {
      try {
        const token = localStorage.getItem("token");
        // First, get the shows created by the current user
        const showsResponse = await axios.get("/api/my-shows", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Then, for each show, fetch its bookings
        const showsWithBookings = await Promise.all(
          showsResponse.data.map(async (show) => {
            const bookingsResponse = await axios.get(
              `/api/shows/${show.id}/bookings`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return { ...show, bookings: bookingsResponse.data };
          })
        );
        setShows(showsWithBookings);
      } catch (err) {
        setError("Could not fetch your shows. Please try again later.");
        console.error("Error fetching my shows:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyShows();
  }, []);

  const toggleShowDetails = (showId) => {
    setExpandedShow(expandedShow === showId ? null : showId);
  };

  if (loading) {
    return <div className="text-center p-4">Loading your shows...</div>;
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
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        My Shows & Bookings
      </h2>
      <div className="space-y-4">
        {shows.length > 0 ? (
          shows.map((show) => (
            <div key={show.id} className="border rounded-lg overflow-hidden">
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleShowDetails(show.id)}
              >
                <div>
                  <h3 className="font-bold text-lg text-indigo-600">
                    {show.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(show.date).toLocaleDateString()} - {show.venue}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm mr-4 font-medium text-gray-700">
                    {show.bookings.length} Booking(s)
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedShow === show.id ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              {expandedShow === show.id && (
                <div className="p-4 border-t bg-gray-50">
                  <h4 className="font-semibold mb-3 text-gray-700">
                    Attendee List:
                  </h4>
                  {show.bookings.length > 0 ? (
                    <ul className="space-y-3">
                      {show.bookings.map((booking) => (
                        <li
                          key={booking.id}
                          className="p-3 border rounded-md bg-white shadow-sm"
                        >
                          <p>
                            <strong>User:</strong> {booking.user.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {booking.user.email}
                          </p>
                          <p>
                            <strong>Phone:</strong>{" "}
                            {booking.user.phone || "N/A"}
                          </p>
                          <p>
                            <strong>Tickets Booked:</strong> {booking.tickets}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No one has booked tickets for this show yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            You have not created any shows.
          </p>
        )}
      </div>
    </div>
  );
}
