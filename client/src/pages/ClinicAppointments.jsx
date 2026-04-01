import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/ClinicAppointments.css";
import { Link } from "react-router-dom";

function ClinicAppointments() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAppointments = async () => {
    try {
      const response = await api.get("/clinic/appointments");
      setData(response.data);
    } catch (err) {
      setError("Failed to load clinic appointments.");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(`/clinic/appointments/${appointmentId}/status`, { status });
      setSuccess(response.data.message || "Appointment updated.");
      await loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update clinic appointment.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="clinic-appointments-page">
              <div className="soft-card clinic-appointments-header">
                <h1>Clinic Appointments</h1>
                <p>Manage bookings created for your clinic.</p>
              </div>

              {error && <p className="clinic-appointments-message error">{error}</p>}
              {success && <p className="clinic-appointments-message success">{success}</p>}

              {!data && <p>Loading appointments...</p>}

              {data && (
                <div className="clinic-appointments-list">
                  {data.appointments.length === 0 && <p>No appointments available.</p>}

                  {data.appointments.map((item) => (
                    <article className="soft-card clinic-appointment-card" key={item.id}>
                      <h3>{item.patient_first_name} {item.patient_last_name}</h3>
                      <p>Dr. {item.doctor_first_name} {item.doctor_last_name}</p>
                      <span>{item.appointment_date} · {item.appointment_time}</span>
                      <strong>{item.status}</strong>

                      <Link to={`/clinic/patients/${item.patient_user_id}/files`} className="secondary-btn">
                        Review Files
                      </Link>

                      <div className="clinic-appointment-actions">
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

export default ClinicAppointments;