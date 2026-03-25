import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/AdminSpecialties.css";

function AdminSpecialties() {
  const [specialties, setSpecialties] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSpecialties = async () => {
    try {
      const response = await api.get("/admin/specialties");
      setSpecialties(response.data);
    } catch {
      setError("Failed to load specialties.");
    }
  };

  useEffect(() => {
    loadSpecialties();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/admin/specialties", formData);
      setSuccess(response.data.message || "Specialty created.");
      setFormData({ name: "", description: "" });
      await loadSpecialties();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create specialty.");
    }
  };

  const handleUpdate = async (specialtyId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.put(`/admin/specialties/${specialtyId}`, editingData);
      setSuccess(response.data.message || "Specialty updated.");
      setEditingId(null);
      await loadSpecialties();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update specialty.");
    }
  };

  const handleDelete = async (specialtyId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.delete(`/admin/specialties/${specialtyId}`);
      setSuccess(response.data.message || "Specialty deleted.");
      await loadSpecialties();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete specialty.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="admin-specialties-page">
              <div className="soft-card admin-specialties-header">
                <h1>Admin Specialties Catalog</h1>
                <p>Create, edit and remove medical specialties.</p>
              </div>

              <form className="soft-card admin-specialties-form" onSubmit={handleCreate}>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Specialty name"
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                />
                <button type="submit" className="primary-btn">
                  Create Specialty
                </button>
              </form>

              {error && <p className="admin-specialties-message error">{error}</p>}
              {success && <p className="admin-specialties-message success">{success}</p>}

              <div className="admin-specialties-list">
                {specialties.length === 0 && <p>No specialties available.</p>}

                {specialties.map((specialty) => (
                  <article className="soft-card admin-specialty-card" key={specialty.id}>
                    {editingId === specialty.id ? (
                      <div className="admin-specialty-edit">
                        <input
                          value={editingData.name}
                          onChange={(e) => setEditingData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                        <textarea
                          value={editingData.description}
                          onChange={(e) => setEditingData((prev) => ({ ...prev, description: e.target.value }))}
                        />
                        <button className="primary-btn" onClick={() => handleUpdate(specialty.id)}>
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3>{specialty.name}</h3>
                        <p>{specialty.description || "No description available."}</p>
                        <span>{specialty.doctors_count || 0} doctors linked</span>

                        <div className="admin-specialty-actions">
                          <button
                            className="secondary-btn"
                            onClick={() => {
                              setEditingId(specialty.id);
                              setEditingData({
                                name: specialty.name || "",
                                description: specialty.description || "",
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button className="secondary-btn" onClick={() => handleDelete(specialty.id)}>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AdminSpecialties;