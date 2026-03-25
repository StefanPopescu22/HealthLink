import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/DoctorAppointments.css";

function DoctorAppointments() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAppointments = async () => {
    try {
      const response = await api.get("/doctor/appointments");
      setData(response.data);
    } catch (err) {
      setError("Failed to load doctor appointments.");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(`/doctor/appointments/${appointmentId}/status`, { status });
      setSuccess(response.data.message || "Appointment updated.");
      await loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="doctor-appointments-page">
              <div className="soft-card doctor-appointments-header">
                <h1>Doctor Appointments</h1>
                <p>Manage appointments assigned to your doctor account.</p>
              </div>

              {error && <p className="doctor-appointments-message error">{error}</p>}
              {success && <p className="doctor-appointments-message success">{success}</p>}

              {!data && <p>Loading appointments...</p>}

              {data && (
                <div className="doctor-appointments-list">
                  {data.appointments.length === 0 && <p>No appointments available.</p>}

                  {data.appointments.map((item) => (
                    <article className="soft-card doctor-appointment-card" key={item.id}>
                      <h3>{item.patient_first_name} {item.patient_last_name}</h3>
                      <p>{item.clinic_name}</p>
                      <p>{item.patient_phone || "No phone available"}</p>
                      <span>{item.appointment_date} · {item.appointment_time}</span>
                      <strong>{item.status}</strong>

                      <div className="doctor-appointment-actions">
                        <button className="secondary-btn" onClick={() => updateStatus(item.id, "confirmed")}>
                          Confirm
                        </button>
                        <button className="secondary-btn" onClick={() => updateStatus(item.id, "completed")}>
                          Complete
                        </button>
                        <button className="secondary-btn" onClick={() => updateStatus(item.id, "cancelled")}>
                          Cancel
                        </button>
                      </div>
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

export default DoctorAppointments;