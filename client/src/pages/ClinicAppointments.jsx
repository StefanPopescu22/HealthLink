import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import {
  FaCalendarCheck,
  FaUserDoctor,
  FaCalendarDays,
  FaClock,
  FaCheck,
  FaXmark,
  FaFolderOpen,
  FaCircleCheck,
} from "react-icons/fa6";
import "../styles/ClinicAppointments.css";

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

function ClinicAppointments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/clinic/appointments");
      setData(res.data);
    } catch {
      setError("Failed to load clinic appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAppointments(); }, []);

  const updateStatus = async (appointmentId, status) => {
    setError(""); setSuccess("");
    try {
      const res = await api.patch(`/clinic/appointments/${appointmentId}/status`, { status });
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
            <section className="clinic-appointments-page">

              <div className="clinic-appointments-header">
                <div className="clinic-appt-header-text">
                  <div className="clinic-appt-badge">
                    <FaCalendarCheck />
                    Clinic Panel
                  </div>
                  <h1>Clinic Appointments</h1>
                  <p>Review, confirm and manage all bookings created for your clinic.</p>
                </div>
                <div className="clinic-appt-header-meta">
                  <div className="clinic-appt-count">
                    <strong>{appointments.length}</strong>
                    <span>Total</span>
                  </div>
                  <div className="clinic-appt-count">
                    <strong>
                      {appointments.filter((a) => a.status === "pending").length}
                    </strong>
                    <span>Pending</span>
                  </div>
                </div>
              </div>

              {error   && <p className="clinic-appointments-message error"><FaXmark /> {error}</p>}
              {success && <p className="clinic-appointments-message success"><FaCheck /> {success}</p>}

              <div className="clinic-appointments-list">
                {loading && (
                  <>
                    <div className="clinic-appt-skeleton" />
                    <div className="clinic-appt-skeleton" style={{ opacity: 0.6 }} />
                    <div className="clinic-appt-skeleton" style={{ opacity: 0.35 }} />
                  </>
                )}

                {!loading && appointments.length === 0 && (
                  <div className="clinic-appt-empty">
                    <FaCalendarDays />
                    <h3>No appointments yet</h3>
                    <p>Bookings created for your clinic will appear here.</p>
                  </div>
                )}

                {!loading && appointments.map((item) => (
                  <article className="clinic-appointment-card" key={item.id}>
                    <div className="clinic-appt-body">
                      <div className="clinic-appt-main">
                        <div className="clinic-appt-avatar">
                          {initials(item.patient_first_name, item.patient_last_name)}
                        </div>

                        <div className="clinic-appt-info">
                          <h3>
                            {item.patient_first_name} {item.patient_last_name}
                          </h3>
                          <p className="clinic-appt-doctor">
                            <FaUserDoctor />
                            Dr. {item.doctor_first_name} {item.doctor_last_name}
                          </p>
                          <div className="clinic-appt-meta">
                            <span className="clinic-appt-chip">
                              <FaCalendarDays />
                              {formatDate(item.appointment_date)}
                            </span>
                            <span className="clinic-appt-chip">
                              <FaClock />
                              {formatTime(item.appointment_time)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="clinic-appt-right">
                        <span className={`status-badge ${item.status?.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="clinic-appt-footer">
                      <Link
                        to={`/clinic/patients/${item.patient_user_id}/files`}
                        className="clinic-appt-review-btn"
                      >
                        <FaFolderOpen />
                        Review Files
                      </Link>

                      <div className="clinic-appointment-actions">
                        <button
                          className="appt-action-btn btn-confirm"
                          onClick={() => updateStatus(item.id, "confirmed")}
                          disabled={item.status === "confirmed" || item.status === "completed" || item.status === "cancelled"}
                        >
                          <FaCheck /> Confirm
                        </button>

                        <button
                          className="appt-action-btn btn-complete"
                          onClick={() => updateStatus(item.id, "completed")}
                          disabled={item.status === "completed" || item.status === "cancelled"}
                        >
                          <FaCircleCheck /> Complete
                        </button>

                        <button
                          className="appt-action-btn btn-cancel"
                          onClick={() => updateStatus(item.id, "cancelled")}
                          disabled={item.status === "cancelled" || item.status === "completed"}
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

export default ClinicAppointments;