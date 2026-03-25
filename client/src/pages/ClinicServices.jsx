import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/ClinicServices.css";

function ClinicServices() {
  const [data, setData] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editingPrice, setEditingPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [clinicServicesRes, publicServicesRes] = await Promise.all([
        api.get("/clinic/services"),
        api.get("/public/services"),
      ]);

      setData(clinicServicesRes.data);
      setAllServices(publicServicesRes.data);
    } catch (err) {
      setError("Failed to load clinic services.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/clinic/services", {
        serviceId: Number(formData.serviceId),
        price: formData.price,
      });

      setSuccess(response.data.message || "Service added.");
      setFormData({ serviceId: "", price: "" });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add clinic service.");
    }
  };

  const handleUpdate = async (clinicServiceId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.put(`/clinic/services/${clinicServiceId}`, {
        price: editingPrice,
      });

      setSuccess(response.data.message || "Service updated.");
      setEditingId(null);
      setEditingPrice("");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update clinic service.");
    }
  };

  const handleDelete = async (clinicServiceId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.delete(`/clinic/services/${clinicServiceId}`);
      setSuccess(response.data.message || "Service removed.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove clinic service.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="clinic-services-page">
              <div className="soft-card clinic-services-header">
                <h1>Clinic Services</h1>
                <p>Assign global services to your clinic and set prices.</p>
              </div>

              <form className="soft-card clinic-services-form" onSubmit={handleAdd}>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, serviceId: e.target.value }))}
                >
                  <option value="">Select service</option>
                  {allServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="Price"
                />

                <button type="submit" className="primary-btn">
                  Add Service
                </button>
              </form>

              {error && <p className="clinic-services-message error">{error}</p>}
              {success && <p className="clinic-services-message success">{success}</p>}

              {!data && <p>Loading clinic services...</p>}

              {data && (
                <div className="clinic-services-list">
                  {data.services.length === 0 && <p>No clinic services assigned yet.</p>}

                  {data.services.map((item) => (
                    <article className="soft-card clinic-service-card" key={item.id}>
                      <h3>{item.name}</h3>
                      <p>{item.category}</p>
                      <span>{item.duration_minutes || 0} min</span>

                      {editingId === item.id ? (
                        <div className="clinic-service-edit-row">
                          <input
                            type="number"
                            step="0.01"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(e.target.value)}
                            placeholder="Price"
                          />
                          <button className="primary-btn" onClick={() => handleUpdate(item.id)}>
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <strong>{item.price ? `${item.price} RON` : "No price set"}</strong>
                          <div className="clinic-service-actions">
                            <button
                              className="secondary-btn"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditingPrice(item.price || "");
                              }}
                            >
                              Edit Price
                            </button>
                            <button
                              className="secondary-btn"
                              onClick={() => handleDelete(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ClinicServices;