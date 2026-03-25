import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/DoctorPatientDetails.css";

function DoctorPatientDetails() {
  const { patientUserId } = useParams();
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    appointmentId: "",
    noteText: "",
    recommendationText: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPatientDetails = async () => {
    try {
      const response = await api.get(`/doctor/patients/${patientUserId}`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patient details.");
    }
  };

  useEffect(() => {
    loadPatientDetails();
  }, [patientUserId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post(`/doctor/patients/${patientUserId}/notes`, formData);
      setSuccess(response.data.message || "Medical note added.");
      setFormData({
        appointmentId: "",
        noteText: "",
        recommendationText: "",
      });
      await loadPatientDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add medical note.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="doctor-patient-details-page">
              {!data && <p>{error || "Loading patient details..."}</p>}

              {data && (
                <>
                  <div className="soft-card doctor-patient-details-header">
                    <h1>{data.patient.first_name} {data.patient.last_name}</h1>
                    <p>{data.patient.email}</p>
                  </div>

                  <div className="doctor-patient-details-grid">
                    <article className="soft-card doctor-patient-section">
                      <h2>Patient Information</h2>
                      <p><strong>Phone:</strong> {data.patient.phone || "Not set"}</p>
                      <p><strong>Date of Birth:</strong> {data.patient.date_of_birth || "Not set"}</p>
                      <p><strong>Gender:</strong> {data.patient.gender || "Not set"}</p>
                      <p><strong>Blood Group:</strong> {data.patient.blood_group || "Not set"}</p>
                      <p><strong>Emergency Contact:</strong> {data.patient.emergency_contact_name || "Not set"}</p>
                      <p><strong>Emergency Phone:</strong> {data.patient.emergency_contact_phone || "Not set"}</p>
                      <p><strong>Medical Notes:</strong> {data.patient.medical_notes || "Not set"}</p>
                      <p>
                        <strong>Allergies:</strong>{" "}
                        {data.allergies.length > 0
                          ? data.allergies.map((a) => a.allergy_name).join(", ")
                          : "No allergies listed"}
                      </p>
                    </article>

                    <article className="soft-card doctor-patient-section">
                      <h2>Add Medical Note</h2>

                      <form className="doctor-note-form" onSubmit={handleSubmit}>
                        <label>Appointment</label>
                        <select
                          name="appointmentId"
                          value={formData.appointmentId}
                          onChange={handleChange}
                        >
                          <option value="">Optional appointment link</option>
                          {data.appointments.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.appointment_date} {item.appointment_time} - {item.status}
                            </option>
                          ))}
                        </select>

                        <label>Medical Note</label>
                        <textarea
                          name="noteText"
                          value={formData.noteText}
                          onChange={handleChange}
                          placeholder="Write the medical note"
                        />

                        <label>Recommendation</label>
                        <textarea
                          name="recommendationText"
                          value={formData.recommendationText}
                          onChange={handleChange}
                          placeholder="Write recommendations"
                        />

                        <button type="submit" className="primary-btn">
                          Save Medical Note
                        </button>
                      </form>

                      {error && <p className="doctor-note-message error">{error}</p>}
                      {success && <p className="doctor-note-message success">{success}</p>}
                    </article>
                  </div>

                  <article className="soft-card doctor-patient-section">
                    <h2>Medical Notes History</h2>

                    <div className="doctor-patient-notes-list">
                      {data.notes.length === 0 && <p>No notes available yet.</p>}

                      {data.notes.map((note) => (
                        <div className="doctor-patient-note-item" key={note.id}>
                          <h3>{note.created_at}</h3>
                          <p><strong>Note:</strong> {note.note_text}</p>
                          <p><strong>Recommendation:</strong> {note.recommendation_text || "No recommendation"}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default DoctorPatientDetails;