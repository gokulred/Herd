import { useState } from "react";
import axios from "axios";

export default function Login({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      // Use the environment variable for the API URL
      const response = await axios.post(
        "http://my-auth-app.test/api/login",
        formData
      );
      setSuccessMessage(response.data.message);

      // Store user data and token in local storage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 422)
      ) {
        setError(err.response.data.message || "Invalid credentials.");
      } else {
        setError("An unexpected error occurred. Please try again.");
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {successMessage && (
          <div className="p-4 text-green-700 bg-green-100 border-l-4 border-green-500">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
