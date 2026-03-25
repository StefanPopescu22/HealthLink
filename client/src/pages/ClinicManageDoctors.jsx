import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/ClinicManageDoctors.css";

function ClinicManageDoctors() {
  const [data, setData] = useState(null);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    description: "",
    experienceYears: "",
    scheduleInfo: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDoctors = async () => {
    try {
      const response = await api.get("/clinic/doctors");
      setData(response.data);
    } catch (err) {
      setError("Failed to load clinic doctors.");
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const startEdit = (doctor) => {
    setEditingDoctorId(doctor.id);
    setFormData({
      firstName: doctor.first_name || "",
      lastName: doctor.last_name || "",
      phone: doctor.phone || "",
      description: doctor.description || "",
      experienceYears: doctor.experience_years || "",
      scheduleInfo: doctor.schedule_info || "",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (doctorId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.put(`/clinic/doctors/${doctorId}`, formData);
      setSuccess(response.data.message || "Doctor updated successfully.");
      setEditingDoctorId(null);
      await loadDoctors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update doctor.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="clinic-manage-doctors-page">
              <div className="soft-card clinic-manage-doctors-header">
                <h1>Manage Clinic Doctors</h1>
                <p>Edit doctors assigned to your clinic.</p>
              </div>

              {error && <p className="clinic-manage-message error">{error}</p>}
              {success && <p className="clinic-manage-message success">{success}</p>}

              {!data && <p>Loading doctors...</p>}

              {data && (
                <div className="clinic-manage-doctors-list">
                  {data.doctors.length === 0 && <p>No doctors available yet.</p>}

                  {data.doctors.map((doctor) => (
                    <article className="soft-card clinic-manage-doctor-card" key={doctor.id}>
                      {editingDoctorId === doctor.id ? (
                        <div className="clinic-manage-form">
                          <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" />
                          <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
                          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                          <input name="experienceYears" type="number" min="0" value={formData.experienceYears} onChange={handleChange} placeholder="Experience years" />
                          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                          <textarea name="scheduleInfo" value={formData.scheduleInfo} onChange={handleChange} placeholder="Schedule info" />
                          <button className="primary-btn" onClick={() => handleSave(doctor.id)}>
                            Save Changes
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3>{doctor.first_name} {doctor.last_name}</h3>
                          <p>{doctor.email}</p>
                          <p>{doctor.specialties || "No specialties assigned"}</p>
                          <p>{doctor.phone || "No phone set"}</p>
                          <p>{doctor.description || "No description available"}</p>
                          <span>{doctor.experience_years || 0} years experience</span>
                          <span>{doctor.schedule_info || "No schedule available"}</span>

                          <button className="secondary-btn" onClick={() => startEdit(doctor)}>
                            Edit Doctor
                          </button>
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

export default ClinicManageDoctors;