import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import {
  FaCheck,
  FaXmark,
  FaPlus,
  FaPen,
  FaTrash,
  FaStethoscope,
  FaClock,
  FaTag,
  FaLayerGroup,
  FaMoneyBill,
  FaNotesMedical,
} from "react-icons/fa6";
import "../styles/ClinicServices.css";

function ClinicServices() {
  const [data, setData] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [specialtyForm, setSpecialtyForm] = useState({ name: "", description: "" });
  const [serviceForm, setServiceForm] = useState({
    name: "", specialtyId: "", category: "",
    description: "", durationMinutes: "", price: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editingPrice, setEditingPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [svcRes, specRes] = await Promise.all([
        api.get("/clinic/services"),
        api.get("/clinic/specialties"),
      ]);
      setData(svcRes.data);
      setSpecialties(specRes.data);
    } catch {
      setError("Failed to load clinic services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const setSF = (field, value) =>
    setSpecialtyForm((prev) => ({ ...prev, [field]: value }));

  const setSVC = (field, value) =>
    setServiceForm((prev) => ({ ...prev, [field]: value }));

  const createSpecialty = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await api.post("/clinic/specialties", specialtyForm);
      setSuccess(res.data.message || "Specialty created.");
      setSpecialtyForm({ name: "", description: "" });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create specialty.");
    }
  };

  const createService = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await api.post("/clinic/services/catalog", serviceForm);
      setSuccess(res.data.message || "Service created and assigned to clinic.");
      setServiceForm({ name: "", specialtyId: "", category: "", description: "", durationMinutes: "", price: "" });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create service.");
    }
  };

  const handleUpdate = async (clinicServiceId) => {
    setError(""); setSuccess("");
    try {
      const res = await api.put(`/clinic/services/${clinicServiceId}`, { price: editingPrice });
      setSuccess(res.data.message || "Service updated.");
      setEditingId(null);
      setEditingPrice("");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update service.");
    }
  };

  const handleDelete = async (clinicServiceId) => {
    setError(""); setSuccess("");
    try {
      const res = await api.delete(`/clinic/services/${clinicServiceId}`);
      setSuccess(res.data.message || "Service removed.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove service.");
    }
  };

  const services = data?.services || [];

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="clinic-services-page">

              <div className="clinic-services-header">
                <div className="clinic-services-header-text">
                  <div className="clinic-services-badge">
                    <FaLayerGroup />
                    Clinic Panel
                  </div>
                  <h1>Clinic Services</h1>
                  <p>Create specialties, then add services inside them and manage pricing.</p>
                </div>
                <div className="clinic-services-header-meta">
                  <div className="clinic-services-meta-item">
                    <strong>{specialties.length}</strong>
                    <span>Specialties</span>
                  </div>
                  <div className="clinic-services-meta-item">
                    <strong>{services.length}</strong>
                    <span>Services</span>
                  </div>
                </div>
              </div>

              {error   && <p className="clinic-services-message error"><FaXmark /> {error}</p>}
              {success && <p className="clinic-services-message success"><FaCheck /> {success}</p>}

              <div className="clinic-forms-grid">
                <form className="clinic-services-form" onSubmit={createSpecialty}>
                  <div className="clinic-form-heading">
                    <h2><FaStethoscope /> Create Specialty</h2>
                    <p>Add a new medical specialty to your clinic.</p>
                  </div>

                  <div className="clinic-form-group">
                    <label>Specialty Name</label>
                    <input
                      value={specialtyForm.name}
                      onChange={(e) => setSF("name", e.target.value)}
                      placeholder="e.g. Cardiology, Dermatology..."
                    />
                  </div>

                  <div className="clinic-form-group">
                    <label>Description</label>
                    <textarea
                      value={specialtyForm.description}
                      onChange={(e) => setSF("description", e.target.value)}
                      placeholder="Short description of this specialty..."
                    />
                  </div>

                  <button type="submit" className="primary-btn clinic-form-submit-btn">
                    <FaPlus /> Create Specialty
                  </button>
                </form>

                <form className="clinic-services-form" onSubmit={createService}>
                  <div className="clinic-form-heading">
                    <h2><FaNotesMedical /> Create Service</h2>
                    <p>Add a new service inside one of your specialties.</p>
                  </div>

                  <div className="clinic-form-grid-2">
                    <div className="clinic-form-group">
                      <label>Service Name</label>
                      <input
                        value={serviceForm.name}
                        onChange={(e) => setSVC("name", e.target.value)}
                        placeholder="e.g. ECG, Consultation..."
                      />
                    </div>

                    <div className="clinic-form-group">
                      <label>Specialty</label>
                      <select
                        value={serviceForm.specialtyId}
                        onChange={(e) => setSVC("specialtyId", e.target.value)}
                      >
                        <option value="">Select specialty</option>
                        {specialties.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="clinic-form-group">
                      <label>Category</label>
                      <input
                        value={serviceForm.category}
                        onChange={(e) => setSVC("category", e.target.value)}
                        placeholder="e.g. Diagnostic, Treatment..."
                      />
                    </div>

                    <div className="clinic-form-group">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        value={serviceForm.durationMinutes}
                        onChange={(e) => setSVC("durationMinutes", e.target.value)}
                        placeholder="e.g. 30"
                        min="1"
                      />
                    </div>

                    <div className="clinic-form-group">
                      <label>Price (RON)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={serviceForm.price}
                        onChange={(e) => setSVC("price", e.target.value)}
                        placeholder="e.g. 150.00"
                        min="0"
                      />
                    </div>

                    <div className="clinic-form-group full">
                      <label>Description</label>
                      <textarea
                        value={serviceForm.description}
                        onChange={(e) => setSVC("description", e.target.value)}
                        placeholder="What does this service include?"
                      />
                    </div>
                  </div>

                  <button type="submit" className="primary-btn clinic-form-submit-btn">
                    <FaPlus /> Create Service
                  </button>
                </form>
              </div>

              <div className="clinic-services-list-section">
                <div className="clinic-services-list-header">
                  <div>
                    <h2>Assigned Services</h2>
                    <p>All services currently active in your clinic.</p>
                  </div>
                  {services.length > 0 && (
                    <span className="clinic-services-count-pill">
                      {services.length} {services.length === 1 ? "service" : "services"}
                    </span>
                  )}
                </div>

                <div className="clinic-services-list">
                  {loading && (
                    <>
                      <div className="clinic-svc-skeleton" />
                      <div className="clinic-svc-skeleton" style={{ opacity: 0.6 }} />
                      <div className="clinic-svc-skeleton" style={{ opacity: 0.35 }} />
                    </>
                  )}

                  {!loading && services.length === 0 && (
                    <div className="clinic-services-empty">
                      <FaNotesMedical />
                      <h3>No services assigned yet</h3>
                      <p>Use the form above to create your first service and assign it to a specialty.</p>
                    </div>
                  )}

                  {!loading && services.map((item) => (
                    <article className="clinic-service-card" key={item.id}>
                      <div className="clinic-service-body">
                        <div className="clinic-service-main">
                          <div className="clinic-service-icon">
                            <FaNotesMedical />
                          </div>

                          <div className="clinic-service-info">
                            <h3>{item.name}</h3>
                            <div className="clinic-service-chips">
                              {item.specialty_name && (
                                <span className="clinic-svc-chip chip-specialty">
                                  <FaStethoscope />
                                  {item.specialty_name}
                                </span>
                              )}
                              {item.category && (
                                <span className="clinic-svc-chip chip-category">
                                  <FaTag />
                                  {item.category}
                                </span>
                              )}
                              {item.duration_minutes > 0 && (
                                <span className="clinic-svc-chip chip-duration">
                                  <FaClock />
                                  {item.duration_minutes} min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="clinic-service-price">
                          <strong>
                            {item.price ? `${parseFloat(item.price).toFixed(2)}` : "—"}
                          </strong>
                          <span>{item.price ? "RON" : "No price"}</span>
                        </div>
                      </div>

                      <div className="clinic-service-footer">
                        {editingId === item.id ? (
                          <>
                            <div className="clinic-service-edit-row">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editingPrice}
                                onChange={(e) => setEditingPrice(e.target.value)}
                                placeholder="New price (RON)"
                                autoFocus
                              />
                              <button className="svc-btn btn-save" onClick={() => handleUpdate(item.id)}>
                                <FaCheck /> Save
                              </button>
                              <button className="svc-btn btn-cancel" onClick={() => { setEditingId(null); setEditingPrice(""); }}>
                                <FaXmark />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <button
                              className="svc-btn btn-edit"
                              onClick={() => { setEditingId(item.id); setEditingPrice(item.price || ""); }}
                            >
                              <FaPen /> Edit Price
                            </button>
                            <button className="svc-btn btn-delete" onClick={() => handleDelete(item.id)}>
                              <FaTrash /> Remove
                            </button>
                          </>
                        )}
                      </div>
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

export default ClinicServices;