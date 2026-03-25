import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/AdminServices.css";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    durationMinutes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: "",
    category: "",
    description: "",
    durationMinutes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadServices = async () => {
    try {
      const response = await api.get("/admin/services");
      setServices(response.data);
    } catch {
      setError("Failed to load services.");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/admin/services", formData);
      setSuccess(response.data.message || "Service created.");
      setFormData({
        name: "",
        category: "",
        description: "",
        durationMinutes: "",
      });
      await loadServices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create service.");
    }
  };

  const handleUpdate = async (serviceId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.put(`/admin/services/${serviceId}`, editingData);
      setSuccess(response.data.message || "Service updated.");
      setEditingId(null);
      await loadServices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update service.");
    }
  };

  const handleDelete = async (serviceId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.delete(`/admin/services/${serviceId}`);
      setSuccess(response.data.message || "Service deleted.");
      await loadServices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete service.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="admin-services-page">
              <div className="soft-card admin-services-header">
                <h1>Admin Services Catalog</h1>
                <p>Create, edit and remove global medical services.</p>
              </div>

              <form className="soft-card admin-services-form" onSubmit={handleCreate}>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Service name"
                />
                <input
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Category"
                />
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, durationMinutes: e.target.value }))}
                  placeholder="Duration minutes"
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                />
                <button type="submit" className="primary-btn">
                  Create Service
                </button>
              </form>

              {error && <p className="admin-services-message error">{error}</p>}
              {success && <p className="admin-services-message success">{success}</p>}

              <div className="admin-services-list">
                {services.length === 0 && <p>No services available.</p>}

                {services.map((service) => (
                  <article className="soft-card admin-service-card" key={service.id}>
                    {editingId === service.id ? (
                      <div className="admin-service-edit">
                        <input
                          value={editingData.name}
                          onChange={(e) => setEditingData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                        <input
                          value={editingData.category}
                          onChange={(e) => setEditingData((prev) => ({ ...prev, category: e.target.value }))}
                        />
                        <input
                          type="number"
                          value={editingData.durationMinutes}
                          onChange={(e) => setEditingData((prev) => ({ ...prev, durationMinutes: e.target.value }))}
                        />
                        <textarea
                          value={editingData.description}
                          onChange={(e) => setEditingData((prev) => ({ ...prev, description: e.target.value }))}
                        />
                        <button className="primary-btn" onClick={() => handleUpdate(service.id)}>
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3>{service.name}</h3>
                        <p>{service.category}</p>
                        <span>{service.duration_minutes || 0} min</span>
                        <span>{service.clinics_count || 0} clinics</span>
                        <p>{service.description || "No description available."}</p>

                        <div className="admin-service-actions">
                          <button
                            className="secondary-btn"
                            onClick={() => {
                              setEditingId(service.id);
                              setEditingData({
                                name: service.name || "",
                                category: service.category || "",
                                description: service.description || "",
                                durationMinutes: service.duration_minutes || "",
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button className="secondary-btn" onClick={() => handleDelete(service.id)}>
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

export default AdminServices;