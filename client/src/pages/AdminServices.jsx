import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import {
  FaNotesMedical,
  FaStethoscope,
  FaTag,
  FaClock,
  FaHospital,
  FaPlus,
  FaPen,
  FaTrash,
  FaCheck,
  FaXmark,
  FaLayerGroup,
} from "react-icons/fa6";
import "../styles/AdminServices.css";

const EMPTY_FORM = {
  name: "",
  specialtyId: "",
  category: "",
  description: "",
  durationMinutes: "",
};

function AdminServices() {
  const [services, setServices] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [svcRes, specRes] = await Promise.all([
        api.get("/admin/services"),
        api.get("/admin/specialties"),
      ]);
      setServices(svcRes.data);
      setSpecialties(specRes.data);
    } catch {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const setFD = (field, value) => setFormData((p) => ({ ...p, [field]: value }));
  const setED = (field, value) => setEditingData((p) => ({ ...p, [field]: value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await api.post("/admin/services", formData);
      setSuccess(res.data.message || "Service created.");
      setFormData(EMPTY_FORM);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create service.");
    }
  };

  const handleUpdate = async (serviceId) => {
    setError(""); setSuccess("");
    try {
      const res = await api.put(`/admin/services/${serviceId}`, editingData);
      setSuccess(res.data.message || "Service updated.");
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update service.");
    }
  };

  const handleDelete = async (serviceId) => {
    setError(""); setSuccess("");
    try {
      const res = await api.delete(`/admin/services/${serviceId}`);
      setSuccess(res.data.message || "Service deleted.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete service.");
    }
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setEditingData({
      name:            service.name            || "",
      specialtyId:     service.specialty_id    || "",
      category:        service.category        || "",
      description:     service.description     || "",
      durationMinutes: service.duration_minutes|| "",
    });
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="admin-services-page">

              <div className="admin-services-header">
                <div className="admin-svc-header-text">
                  <div className="admin-svc-badge">
                    <FaNotesMedical />
                    Admin Panel
                  </div>
                  <h1>Services Catalog</h1>
                  <p>Create, edit and manage all medical services across the platform.</p>
                </div>
                <div className="admin-svc-header-meta">
                  <div className="admin-svc-count">
                    <strong>{services.length}</strong>
                    <span>Services</span>
                  </div>
                  <div className="admin-svc-count">
                    <strong>{specialties.length}</strong>
                    <span>Specialties</span>
                  </div>
                </div>
              </div>

              {error   && <p className="admin-services-message error"><FaXmark /> {error}</p>}
              {success && <p className="admin-services-message success"><FaCheck /> {success}</p>}

              <form className="admin-services-form" onSubmit={handleCreate}>
                <div className="admin-svc-form-heading">
                  <h2><FaPlus /> Create New Service</h2>
                  <p>Add a medical service and link it to a specialty.</p>
                </div>

                <div className="admin-svc-form-grid">
                  <div className="admin-svc-form-group">
                    <label>Service Name</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFD("name", e.target.value)}
                      placeholder="e.g. ECG, MRI, Consultation..."
                    />
                  </div>

                  <div className="admin-svc-form-group">
                    <label>Specialty</label>
                    <select
                      value={formData.specialtyId}
                      onChange={(e) => setFD("specialtyId", e.target.value)}
                    >
                      <option value="">Select specialty</option>
                      {specialties.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-svc-form-group">
                    <label>Category</label>
                    <input
                      value={formData.category}
                      onChange={(e) => setFD("category", e.target.value)}
                      placeholder="e.g. Diagnostic, Treatment..."
                    />
                  </div>

                  <div className="admin-svc-form-group">
                    <label>Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => setFD("durationMinutes", e.target.value)}
                      placeholder="e.g. 30"
                      min="1"
                    />
                  </div>

                  <div className="admin-svc-form-group full">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFD("description", e.target.value)}
                      placeholder="What does this service include?"
                    />
                  </div>
                </div>

                <button type="submit" className="primary-btn admin-svc-submit-btn">
                  <FaPlus /> Create Service
                </button>
              </form>

              <div className="admin-services-list-section">
                <div className="admin-services-list-header">
                  <div>
                    <h2>All Services</h2>
                    <p>Manage existing medical services in the platform catalog.</p>
                  </div>
                  {services.length > 0 && (
                    <span className="admin-svc-list-count">
                      {services.length} {services.length === 1 ? "service" : "services"}
                    </span>
                  )}
                </div>

                <div className="admin-services-list">
                  {loading && (
                    <>
                      <div className="admin-svc-skeleton" />
                      <div className="admin-svc-skeleton" style={{ opacity: 0.6 }} />
                      <div className="admin-svc-skeleton" style={{ opacity: 0.35 }} />
                    </>
                  )}

                  {!loading && services.length === 0 && (
                    <div className="admin-svc-empty">
                      <FaNotesMedical />
                      <h3>No services yet</h3>
                      <p>Use the form above to create your first medical service.</p>
                    </div>
                  )}

                  {!loading && services.map((service) => (
                    <article className="admin-service-card" key={service.id}>
                      {editingId === service.id ? (
                        <div className="admin-service-edit">
                          <div className="admin-svc-form-group">
                            <label>Service Name</label>
                            <input
                              value={editingData.name}
                              onChange={(e) => setED("name", e.target.value)}
                              placeholder="Service name"
                            />
                          </div>
                          <div className="admin-svc-form-group">
                            <label>Specialty</label>
                            <select
                              value={editingData.specialtyId}
                              onChange={(e) => setED("specialtyId", e.target.value)}
                            >
                              <option value="">Select specialty</option>
                              {specialties.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="admin-svc-form-group">
                            <label>Category</label>
                            <input
                              value={editingData.category}
                              onChange={(e) => setED("category", e.target.value)}
                              placeholder="Category"
                            />
                          </div>
                          <div className="admin-svc-form-group">
                            <label>Duration (min)</label>
                            <input
                              type="number"
                              value={editingData.durationMinutes}
                              onChange={(e) => setED("durationMinutes", e.target.value)}
                              placeholder="Minutes"
                              min="1"
                            />
                          </div>
                          <div className="admin-svc-form-group admin-edit-full">
                            <label>Description</label>
                            <textarea
                              value={editingData.description}
                              onChange={(e) => setED("description", e.target.value)}
                              placeholder="Description"
                            />
                          </div>
                          <div className="admin-edit-actions">
                            <button className="admin-svc-btn btn-save" onClick={() => handleUpdate(service.id)}>
                              <FaCheck /> Save
                            </button>
                            <button className="admin-svc-btn btn-cancel" onClick={() => setEditingId(null)}>
                              <FaXmark /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="admin-svc-card-body">
                            <div className="admin-svc-card-main">
                              <div className="admin-svc-icon">
                                <FaNotesMedical />
                              </div>
                              <div className="admin-svc-info">
                                <h3>{service.name}</h3>
                                <div className="admin-svc-chips">
                                  {service.specialty_name && (
                                    <span className="admin-svc-chip chip-specialty">
                                      <FaLayerGroup /> {service.specialty_name}
                                    </span>
                                  )}
                                  {service.category && (
                                    <span className="admin-svc-chip">
                                      <FaTag /> {service.category}
                                    </span>
                                  )}
                                  {service.duration_minutes > 0 && (
                                    <span className="admin-svc-chip chip-duration">
                                      <FaClock /> {service.duration_minutes} min
                                    </span>
                                  )}
                                  {service.clinics_count > 0 && (
                                    <span className="admin-svc-chip chip-clinics">
                                      <FaHospital /> {service.clinics_count} {service.clinics_count === 1 ? "clinic" : "clinics"}
                                    </span>
                                  )}
                                </div>
                                {service.description && (
                                  <p className="admin-svc-desc">{service.description}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="admin-svc-card-footer">
                            <div className="admin-service-actions">
                              <button className="admin-svc-btn btn-edit" onClick={() => startEdit(service)}>
                                <FaPen /> Edit
                              </button>
                              <button className="admin-svc-btn btn-delete" onClick={() => handleDelete(service.id)}>
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

export default AdminServices;