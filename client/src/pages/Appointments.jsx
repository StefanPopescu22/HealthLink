import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaClock,
  FaFilter,
  FaLocationDot,
  FaShieldHeart,
  FaUserDoctor,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import { validateAppointmentForm } from "../utils/formValidators";
import "../styles/Appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    clinicId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [appointmentsRes, clinicsRes, doctorsRes] = await Promise.all([
        api.get("/appointments/my"),
        api.get("/public/clinics"),
        api.get("/public/doctors"),
      ]);

      setAppointments(appointmentsRes.data);
      setClinics(clinicsRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      setError("Failed to load appointments data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDoctors = useMemo(() => {
    if (!formData.clinicId) return [];
    return doctors.filter((doctor) => String(doctor.clinic_id) === String(formData.clinicId));
  }, [doctors, formData.clinicId]);

  const upcomingAppointments = appointments.filter(
    (item) => item.status === "pending" || item.status === "confirmed"
  );

  const historyAppointments = appointments.filter(
    (item) => item.status === "completed" || item.status === "cancelled"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "clinicId") {
      setFormData((prev) => ({
        ...prev,
        clinicId: value,
        doctorId: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationMessage = validateAppointmentForm(formData);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/appointments", formData);
      setSuccess(response.data.message || "Appointment created successfully.");

      setFormData({
        clinicId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        notes: "",
      });

      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(`/appointments/${appointmentId}/cancel`);
      setSuccess(response.data.message || "Appointment cancelled.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel appointment.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="appointments-page">
              <section className="appointments-hero">
                <div className="appointments-hero-content">
                  <div className="appointments-badge">
                    <FaShieldHeart />
                    <span>Structured appointment management</span>
                  </div>

                  <h1 className="appointments-title">
                    Manage your <span className="gradient-text">medical appointments</span>
                  </h1>

                  <p className="appointments-subtitle">
                    Book real appointments, review upcoming visits and keep your healthcare
                    schedule organized in one connected workspace.
                  </p>

                  <div className="appointments-actions">
                    <Link to="/clinics" className="secondary-btn">
                      Browse Clinics
                    </Link>
                  </div>
                </div>

                <div className="appointments-side-card soft-card">
                  <div className="appointments-side-header">
                    <span>Appointments Summary</span>
                    <span className="appointments-side-pill">Live</span>
                  </div>

                  <div className="appointments-side-grid">
                    <div className="appointments-side-item">
                      <strong>Upcoming</strong>
                      <span>{upcomingAppointments.length} scheduled visits</span>
                    </div>
                    <div className="appointments-side-item">
                      <strong>History</strong>
                      <span>{historyAppointments.length} previous entries</span>
                    </div>
                    <div className="appointments-side-item">
                      <strong>Clinics</strong>
                      <span>{clinics.length} available clinics</span>
                    </div>
                    <div className="appointments-side-item">
                      <strong>Doctors</strong>
                      <span>{doctors.length} listed doctors</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="soft-card appointment-booking-card">
                <div className="appointments-section-heading">
                  <h2>Book New Appointment</h2>
                  <p>Create a new medical appointment using real clinics and doctors.</p>
                </div>

                <form className="appointment-form-grid" onSubmit={handleCreateAppointment}>
                  <div className="appointment-form-group">
                    <label>Clinic</label>
                    <select name="clinicId" value={formData.clinicId} onChange={handleChange}>
                      <option value="">Select clinic</option>
                      {clinics.map((clinic) => (
                        <option key={clinic.id} value={clinic.id}>
                          {clinic.name} {clinic.city ? `- ${clinic.city}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="appointment-form-group">
                    <label>Doctor</label>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      disabled={!formData.clinicId}
                    >
                      <option value="">Select doctor</option>
                      {filteredDoctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.first_name} {doctor.last_name} - {doctor.specialties || "No specialty"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="appointment-form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name="appointmentDate"
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.appointmentDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="appointment-form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="appointment-form-group full">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Optional appointment notes"
                    />
                  </div>

                  <div className="appointment-form-group full">
                    <button type="submit" className="primary-btn" disabled={submitting}>
                      {submitting ? "Creating..." : "Create Appointment"}
                      <FaArrowRight />
                    </button>
                  </div>
                </form>

                {error && <p className="appointment-message error">{error}</p>}
                {success && <p className="appointment-message success">{success}</p>}
              </section>

              <section className="appointments-filter-row">
                <button className="appointments-filter active" type="button">
                  <FaFilter />
                  <span>Live Data</span>
                </button>
              </section>

              {loading ? (
                <div className="soft-card empty-state-card">Loading appointments...</div>
              ) : (
                <section className="appointments-content">
                  <div className="appointments-column">
                    <div className="appointments-section-heading">
                      <h2>Upcoming Appointments</h2>
                      <p>Your pending and confirmed real appointments.</p>
                    </div>

                    <div className="appointments-list">
                      {upcomingAppointments.length === 0 && (
                        <div className="soft-card empty-state-card">No upcoming appointments yet.</div>
                      )}

                      {upcomingAppointments.map((item) => (
                        <article className="soft-card appointment-card" key={item.id}>
                          <div className="appointment-main">
                            <div className="appointment-icon">
                              <FaUserDoctor />
                            </div>

                            <div className="appointment-content">
                              <h3>
                                Dr. {item.doctor_first_name} {item.doctor_last_name}
                              </h3>
                              <p>{item.clinic_name}</p>

                              <div className="appointment-meta">
                                <span>
                                  <FaLocationDot />
                                  {item.clinic_name}
                                </span>
                                <span>
                                  <FaCalendarCheck />
                                  {item.appointment_date}
                                </span>
                                <span>
                                  <FaClock />
                                  {item.appointment_time}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="appointment-card-right">
                            <div className={`status-badge ${item.status.toLowerCase()}`}>
                              {item.status}
                            </div>

                            {item.status !== "cancelled" && item.status !== "completed" && (
                              <button
                                className="secondary-btn appointment-cancel-btn"
                                onClick={() => handleCancelAppointment(item.id)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="appointments-column">
                    <div className="appointments-section-heading">
                      <h2>Appointment History</h2>
                      <p>Your completed and cancelled consultations.</p>
                    </div>

                    <div className="appointments-list">
                      {historyAppointments.length === 0 && (
                        <div className="soft-card empty-state-card">No appointment history yet.</div>
                      )}

                      {historyAppointments.map((item) => (
                        <article className="soft-card appointment-card" key={item.id}>
                          <div className="appointment-main">
                            <div className="appointment-icon">
                              <FaUserDoctor />
                            </div>

                            <div className="appointment-content">
                              <h3>
                                Dr. {item.doctor_first_name} {item.doctor_last_name}
                              </h3>
                              <p>{item.clinic_name}</p>

                              <div className="appointment-meta">
                                <span>
                                  <FaLocationDot />
                                  {item.clinic_name}
                                </span>
                                <span>
                                  <FaCalendarCheck />
                                  {item.appointment_date}
                                </span>
                                <span>
                                  <FaClock />
                                  {item.appointment_time}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className={`status-badge ${item.status.toLowerCase()}`}>
                            {item.status}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Appointments;