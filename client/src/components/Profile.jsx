import { useState } from "react";
import axios from "axios";

export default function Profile({ user, setUser }) {
  const [formData, setFormData] = useState(user);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ form: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
      {successMessage && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 border-l-4 border-green-500">
          {successMessage}
        </div>
      )}
      {errors.form && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500">
          {errors.form}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Type (Read Only) */}
        <div>
          <label
            htmlFor="account_type"
            className="block text-sm font-medium text-gray-700"
          >
            Account Type
          </label>
          <input
            type="text"
            name="account_type"
            id="account_type"
            value={formData.account_type}
            className="block w-full px-3 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            readOnly
          />
        </div>

        {/* Name fields */}
        {formData.account_type === "Individual" ? (
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.first_name && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.first_name[0]}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={formData.last_name || ""}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.last_name && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.last_name[0]}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div>
              <label
                htmlFor="business_name"
                className="block text-sm font-medium text-gray-700"
              >
                Business Name
              </label>
              <input
                type="text"
                name="business_name"
                id="business_name"
                value={formData.business_name || ""}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.business_name && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.business_name[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name of Contact Person
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name[0]}</p>
              )}
            </div>
          </>
        )}

        {/* Contact Details */}
        <hr />
        <p className="text-sm font-medium text-gray-700">Contact Details</p>

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
            value={formData.email}
            className="block w-full px-3 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            readOnly
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600">{errors.phone[0]}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700"
          >
            Street
          </label>
          <input
            type="text"
            name="street"
            id="street"
            value={formData.street || ""}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.street && (
            <p className="mt-2 text-sm text-red-600">{errors.street[0]}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city || ""}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.city && (
              <p className="mt-2 text-sm text-red-600">{errors.city[0]}</p>
            )}
          </div>
          <div className="w-1/2">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State
            </label>
            <input
              type="text"
              name="state"
              id="state"
              value={formData.state || ""}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.state && (
              <p className="mt-2 text-sm text-red-600">{errors.state[0]}</p>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <label
            htmlFor="zip_code"
            className="block text-sm font-medium text-gray-700"
          >
            Zip Code
          </label>
          <input
            type="text"
            name="zip_code"
            id="zip_code"
            value={formData.zip_code || ""}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.zip_code && (
            <p className="mt-2 text-sm text-red-600">{errors.zip_code[0]}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
