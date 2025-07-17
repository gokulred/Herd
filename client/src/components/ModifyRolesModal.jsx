import { useState, useEffect } from "react";
import axios from "axios";

// Set axios base URL for all requests
axios.defaults.baseURL = "http://my-auth-app.test";
axios.defaults.withCredentials = true;

export default function ModifyRolesModal({
  user,
  allRoles,
  onClose,
  onRolesUpdated,
}) {
  const [assignedRoles, setAssignedRoles] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Initialize the set of assigned roles from the user prop
    if (user?.roles) {
      setAssignedRoles(new Set(user.roles.map((r) => r.id)));
    }
  }, [user]);

  const handleRoleChange = (roleId) => {
    setAssignedRoles((prev) => {
      const newRoles = new Set(prev);
      if (newRoles.has(roleId)) {
        newRoles.delete(roleId);
      } else {
        newRoles.add(roleId);
      }
      return newRoles;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    const token = localStorage.getItem("token");

    const originalRoleIds = new Set(user.roles.map((r) => r.id));

    // Roles to add
    const rolesToAdd = [...assignedRoles].filter(
      (id) => !originalRoleIds.has(id)
    );
    // Roles to remove
    const rolesToRemove = [...originalRoleIds].filter(
      (id) => !assignedRoles.has(id)
    );

    try {
      const requests = [];

      rolesToAdd.forEach((roleId) => {
        requests.push(
          axios.post(
            `/api/admin/users/${user.id}/roles`,
            { role_id: roleId },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );
      });

      rolesToRemove.forEach((roleId) => {
        requests.push(
          axios.delete(`/api/admin/users/${user.id}/roles/${roleId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );
      });

      await Promise.all(requests);
      onRolesUpdated(); // Callback to refresh the user list
      onClose(); // Close the modal
    } catch (err) {
      setError("Failed to update roles. Please try again.");
      console.error("Role update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative mx-auto p-6 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <h3 className="text-xl font-semibold text-gray-900">
          Modify Roles for {user.name}
        </h3>
        <div className="mt-4 space-y-2">
          {/* THE FIX IS HERE: We check if allRoles is an array before mapping over it. */}
          {Array.isArray(allRoles) &&
            allRoles.map((role) => (
              <div key={role.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`role-${role.id}`}
                  checked={assignedRoles.has(role.id)}
                  onChange={() => handleRoleChange(role.id)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor={`role-${role.id}`}
                  className="ml-3 text-sm text-gray-700"
                >
                  {role.name}
                </label>
              </div>
            ))}
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
