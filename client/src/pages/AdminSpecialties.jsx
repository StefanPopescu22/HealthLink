import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import {
  FaStethoscope,
  FaUserDoctor,
  FaLayerGroup,
  FaPlus,
  FaPen,
  FaTrash,
  FaCheck,
  FaXmark,
} from "react-icons/fa6";
import "../styles/AdminSpecialties.css";

const EMPTY = { name: "", description: "" };

function AdminSpecialties() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(EMPTY);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSpecialties = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/specialties");
      setSpecialties(res.data);
    } catch {
      setError("Failed to load specialties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSpecialties(); }, []);

  const setFD = (field, value) => setFormData((p) => ({ ...p, [field]: value }));
  const setED = (field, value) => setEditingData((p) => ({ ...p, [field]: value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await api.post("/admin/specialties", formData);
      setSuccess(res.data.message || "Specialty created.");
      setFormData(EMPTY);
      await loadSpecialties();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create specialty.");
    }
  };

  const handleUpdate = async (specialtyId) => {
    setError(""); setSuccess("");
    try {
      const res = await api.put(`/admin/specialties/${specialtyId}`, editingData);
      setSuccess(res.data.message || "Specialty updated.");
      setEditingId(null);
      await loadSpecialties();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update specialty.");
    }
  };

  const handleDelete = async (specialtyId) => {
    setError(""); setSuccess("");
    try {
      const res = await api.delete(`/admin/specialties/${specialtyId}`);
      setSuccess(res.data.message || "Specialty deleted.");
      await loadSpecialties();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete specialty.");
    }
  };

  const startEdit = (specialty) => {
    setEditingId(specialty.id);
    setEditingData({ name: specialty.name || "", description: specialty.description || "" });
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="admin-specialties-page">

              <div className="admin-specialties-header">
                <div className="admin-spec-header-text">
                  <div className="admin-spec-badge">
                    <FaStethoscope />
                    Admin Panel
                  </div>
                  <h1>Specialties Catalog</h1>
                  <p>Create, edit and manage all medical specialties across the platform.</p>
                </div>
                <div className="admin-spec-header-meta">
                  <div className="admin-spec-count">
                    <strong>{specialties.length}</strong>
                    <span>Specialties</span>
                  </div>
                  <div className="admin-spec-count">
                    <strong>
                      {specialties.reduce((s, sp) => s + (sp.doctors_count || 0), 0)}
                    </strong>
                    <span>Doctors</span>
                  </div>
                </div>
              </div>

              {error   && <p className="admin-specialties-message error"><FaXmark /> {error}</p>}
              {success && <p className="admin-specialties-message success"><FaCheck /> {success}</p>}

              <form className="admin-specialties-form" onSubmit={handleCreate}>
                <div className="admin-spec-form-heading">
                  <h2><FaPlus /> Create New Specialty</h2>
                  <p>Add a new medical specialty to the platform catalog.</p>
                </div>

                <div className="admin-spec-form-group">
                  <label>Specialty Name</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFD("name", e.target.value)}
                    placeholder="e.g. Cardiology, Dermatology, Neurology..."
                  />
                </div>

                <div className="admin-spec-form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFD("description", e.target.value)}
                    placeholder="Describe what this specialty covers..."
                  />
                </div>

                <button type="submit" className="primary-btn admin-spec-submit-btn">
                  <FaPlus /> Create Specialty
                </button>
              </form>

              <div className="admin-specialties-list-section">
                <div className="admin-specialties-list-header">
                  <div>
                    <h2>All Specialties</h2>
                    <p>Manage existing medical specialties in the platform.</p>
                  </div>
                  {specialties.length > 0 && (
                    <span className="admin-spec-list-count">
                      {specialties.length} {specialties.length === 1 ? "specialty" : "specialties"}
                    </span>
                  )}
                </div>

                <div className="admin-specialties-list">
                  {loading && (
                    <>
                      <div className="admin-spec-skeleton" />
                      <div className="admin-spec-skeleton" style={{ opacity: 0.6 }} />
                      <div className="admin-spec-skeleton" style={{ opacity: 0.35 }} />
                    </>
                  )}

                  {!loading && specialties.length === 0 && (
                    <div className="admin-spec-empty">
                      <FaStethoscope />
                      <h3>No specialties yet</h3>
                      <p>Use the form above to create your first medical specialty.</p>
                    </div>
                  )}

                  {!loading && specialties.map((specialty) => (
                    <article className="admin-specialty-card" key={specialty.id}>
                      {editingId === specialty.id ? (
                        <div className="admin-specialty-edit">
                          <div className="admin-spec-edit-title">
                            <FaPen /> Editing: {specialty.name}
                          </div>
                          <div>
                            <span className="admin-spec-edit-label">Specialty Name</span>
                            <input
                              value={editingData.name}
                              onChange={(e) => setED("name", e.target.value)}
                              placeholder="Specialty name"
                            />
                          </div>
                          <div>
                            <span className="admin-spec-edit-label">Description</span>
                            <textarea
                              value={editingData.description}
                              onChange={(e) => setED("description", e.target.value)}
                              placeholder="Description"
                            />
                          </div>
                          <div className="admin-spec-edit-actions">
                            <button className="admin-spec-btn btn-save" onClick={() => handleUpdate(specialty.id)}>
                              <FaCheck /> Save
                            </button>
                            <button className="admin-spec-btn btn-cancel" onClick={() => setEditingId(null)}>
                              <FaXmark /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="admin-spec-card-body">
                            <div className="admin-spec-card-icon">
                              <FaStethoscope />
                            </div>
                            <div className="admin-spec-card-info">
                              <h3>{specialty.name}</h3>
                              <p>{specialty.description || "No description available."}</p>
                              <div className="admin-spec-chips">
                                <span className="admin-spec-chip">
                                  <FaUserDoctor />
                                  {specialty.doctors_count || 0}{" "}
                                  {specialty.doctors_count === 1 ? "doctor" : "doctors"}
                                </span>
                                {specialty.services_count > 0 && (
                                  <span className="admin-spec-chip chip-svc">
                                    <FaLayerGroup />
                                    {specialty.services_count}{" "}
                                    {specialty.services_count === 1 ? "service" : "services"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="admin-spec-card-footer">
                            <div className="admin-specialty-actions">
                              <button className="admin-spec-btn btn-edit" onClick={() => startEdit(specialty)}>
                                <FaPen /> Edit
                              </button>
                              <button className="admin-spec-btn btn-delete" onClick={() => handleDelete(specialty.id)}>
                                <FaTrash /> Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
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