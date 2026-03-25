import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBlockToggle = async (user) => {
    setError("");
    setSuccess("");

    try {
      const endpoint = user.is_blocked
        ? `/admin/users/${user.id}/unblock`
        : `/admin/users/${user.id}/block`;

      const response = await api.patch(endpoint);
      setSuccess(response.data.message || "User status updated.");
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user.");
    }
  };

  // NEW: Delete user handler
  const handleDeleteUser = async (userId) => {
    // Safety check before deleting
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await api.delete(`/admin/users/${userId}`);
      setSuccess(response.data.message || "User deleted successfully.");
      // Instantly remove the user from the UI state without needing another API call
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="admin-users-page">
              <div className="soft-card admin-users-header">
                <h1>User Management</h1>
                <p>Review, block, unblock, or delete platform users.</p>
              </div>

              {error && <p className="admin-users-message error">{error}</p>}
              {success && <p className="admin-users-message success">{success}</p>}

              <div className="admin-users-table-wrapper soft-card">
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="6">No users available.</td>
                      </tr>
                    )}

                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.first_name} {user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.phone || "Not set"}</td>
                        <td>{user.is_blocked ? "Blocked" : "Active"}</td>
                        <td>
                          {/* NEW: Action buttons wrapper */}
                          <div className="action-buttons">
                            <button
                              className="secondary-btn"
                              onClick={() => handleBlockToggle(user)}
                            >
                              {user.is_blocked ? "Unblock" : "Block"}
                            </button>
                            {/* NEW: Delete Button */}
                            <button
                              className="danger-btn"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AdminUsers;