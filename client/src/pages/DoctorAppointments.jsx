import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import {
  FaCalendarCheck,
  FaUserDoctor,
  FaCalendarDays,
  FaClock,
  FaHospital,
  FaPhone,
  FaCheck,
  FaXmark,
  FaCircleCheck,
} from "react-icons/fa6";
import "../styles/DoctorAppointments.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
};

const formatTime = (timeStr) => (timeStr ? timeStr.slice(0, 5) : "—");

const initials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "P";

function DoctorAppointments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/doctor/appointments");
      setData(res.data);
    } catch {
      setError("Failed to load doctor appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAppointments(); }, []);

  const updateStatus = async (appointmentId, status) => {
    setError(""); setSuccess("");
    try {
      const res = await api.patch(`/doctor/appointments/${appointmentId}/status`, { status });
      setSuccess(res.data.message || "Appointment updated.");
      await loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment.");
    }
  };

  const appointments = data?.appointments || [];

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="doctor-appointments-page">

              <div className="doctor-appointments-header">
                <div className="doctor-appt-header-text">
                  <div className="doctor-appt-badge">
                    <FaUserDoctor />
                    Doctor Panel
                  </div>
                  <h1>My Appointments</h1>
                  <p>Review and manage all appointments assigned to your account.</p>
                </div>
                <div className="doctor-appt-header-meta">
                  <div className="doctor-appt-count">
                    <strong>{appointments.length}</strong>
                    <span>Total</span>
                  </div>
                  <div className="doctor-appt-count">
                    <strong>
                      {appointments.filter((a) => a.status === "pending").length}
                    </strong>
                    <span>Pending</span>
                  </div>
                </div>
              </div>

              {error   && <p className="doctor-appointments-message error"><FaXmark /> {error}</p>}
              {success && <p className="doctor-appointments-message success"><FaCheck /> {success}</p>}

              <div className="doctor-appointments-list">
                {loading && (
                  <>
                    <div className="doctor-appt-skeleton" />
                    <div className="doctor-appt-skeleton" style={{ opacity: 0.6 }} />
                    <div className="doctor-appt-skeleton" style={{ opacity: 0.35 }} />
                  </>
                )}

                {!loading && appointments.length === 0 && (
                  <div className="doctor-appt-empty">
                    <FaCalendarDays />
                    <h3>No appointments yet</h3>
                    <p>Appointments assigned to your account will appear here.</p>
                  </div>
                )}

                {!loading && appointments.map((item) => (
                  <article className="doctor-appointment-card" key={item.id}>
                    <div className="doctor-appt-body">
                      <div className="doctor-appt-main">
                        <div className="doctor-appt-avatar">
                          {initials(item.patient_first_name, item.patient_last_name)}
                        </div>

                        <div className="doctor-appt-info">
                          <h3>
                            {item.patient_first_name} {item.patient_last_name}
                          </h3>

                          {item.clinic_name && (
                            <p className="doctor-appt-clinic">
                              <FaHospital />
                              {item.clinic_name}
                            </p>
                          )}

                          {item.patient_phone && (
                            <p className="doctor-appt-phone">
                              <FaPhone />
                              {item.patient_phone}
                            </p>
                          )}

                          <div className="doctor-appt-meta">
                            <span className="doctor-appt-chip">
                              <FaCalendarDays />
                              {formatDate(item.appointment_date)}
                            </span>
                            <span className="doctor-appt-chip">
                              <FaClock />
                              {formatTime(item.appointment_time)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="doctor-appt-right">
                        <span className={`status-badge ${item.status?.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="doctor-appt-footer">
                      <div className="doctor-appointment-actions">
                        <button
                          className="doc-appt-btn btn-confirm"
                          onClick={() => updateStatus(item.id, "confirmed")}
                          disabled={
                            item.status === "confirmed" ||
                            item.status === "completed" ||
                            item.status === "cancelled"
                          }
                        >
                          <FaCheck /> Confirm
                        </button>

                        <button
                          className="doc-appt-btn btn-complete"
                          onClick={() => updateStatus(item.id, "completed")}
                          disabled={
                            item.status === "completed" ||
                            item.status === "cancelled"
                          }
                        >
                          <FaCircleCheck /> Complete
                        </button>

                        <button
                          className="doc-appt-btn btn-cancel"
                          onClick={() => updateStatus(item.id, "cancelled")}
                          disabled={
                            item.status === "cancelled" ||
                            item.status === "completed"
                          }
                        >
                          <FaXmark /> Cancel
                        </button>
                      </div>
                    </div>
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

export default DoctorAppointments;