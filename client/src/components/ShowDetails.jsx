import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`/api/shows/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShow(response.data);
      })
      .catch(() => {
        setError("Could not fetch show details.");
      });
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/shows/${id}/bookings`,
        { tickets },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Tickets booked successfully!");
    } catch (error) {
      setError("Could not book tickets. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500">
        {error}
      </div>
    );
  }

  if (!show) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <img
        src={`/storage/${show.image_path}`}
        alt={show.title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">{show.title}</h2>
      <p className="text-sm text-gray-600 mb-4">
        Organized by {show.user.name}
      </p>
      <p className="text-gray-700 mb-4">{show.content}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <p>
          <strong>Date:</strong> {show.date}
        </p>
        <p>
          <strong>Time:</strong> {show.time}
        </p>
        <p>
          <strong>Venue:</strong> {show.venue}
        </p>
        <p>
          <strong>Price:</strong> ${show.ticket_price}
        </p>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        {successMessage && (
          <div className="p-4 text-green-700 bg-green-100 border-l-4 border-green-500">
            {successMessage}
          </div>
        )}
        <div>
          <label
            htmlFor="tickets"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Tickets
          </label>
          <input
            type="number"
            name="tickets"
            id="tickets"
            value={tickets}
            onChange={(e) => setTickets(e.target.value)}
            min="1"
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isBooking}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isBooking ? "Booking..." : "Book Now"}
        </button>
      </form>
    </div>
  );
}
