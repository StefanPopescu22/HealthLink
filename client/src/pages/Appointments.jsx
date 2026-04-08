import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaClock,
  FaFilter,
  FaLocationDot,
  FaShieldHeart,
  FaStethoscope,
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
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotMeta, setSlotMeta] = useState(null);
  const [formData, setFormData] = useState({
    clinicId: "",
    doctorId: "",
    serviceId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [slotLoading, setSlotLoading] = useState(false);
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

  const loadClinicServices = async (clinicId) => {
    if (!clinicId) {
      setServices([]);
      return;
    }

    try {
      const response = await api.get("/public/services", {
        params: { clinicId },
      });
      setServices(response.data);
    } catch {
      setServices([]);
    }
  };

  const loadAvailableSlots = async (doctorId, appointmentDate, serviceId) => {
    if (!doctorId || !appointmentDate || !serviceId) {
      setAvailableSlots([]);
      setSlotMeta(null);
      return;
    }

    setSlotLoading(true);

    try {
      const response = await api.get(`/public/doctors/${doctorId}/available-slots`, {
        params: {
          date: appointmentDate,
          serviceId,
        },
      });

      setAvailableSlots(response.data.slots || []);
      setSlotMeta(response.data);
    } catch {
      setAvailableSlots([]);
      setSlotMeta(null);
    } finally {
      setSlotLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadClinicServices(formData.clinicId);
  }, [formData.clinicId]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      appointmentTime: "",
    }));

    loadAvailableSlots(
      formData.doctorId,
      formData.appointmentDate,
      formData.serviceId
    );
  }, [formData.doctorId, formData.appointmentDate, formData.serviceId]);

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
        serviceId: "",
        appointmentDate: "",
        appointmentTime: "",
      }));
      return;
    }

    if (name === "doctorId") {
      setFormData((prev) => ({
        ...prev,
        doctorId: value,
        appointmentTime: "",
      }));
      return;
    }

    if (name === "serviceId" || name === "appointmentDate") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        appointmentTime: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectSlot = (slot) => {
    setFormData((prev) => ({
      ...prev,
      appointmentTime: slot,
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
        serviceId: "",
        appointmentDate: "",
        appointmentTime: "",
        notes: "",
      });

      setServices([]);
      setAvailableSlots([]);
      setSlotMeta(null);

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
                    Select only automatically generated valid slots based on doctor schedule and service duration.
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
                  <p>Choose clinic, doctor, service and a generated valid slot.</p>
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
                    <label>Service</label>
                    <select
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleChange}
                      disabled={!formData.clinicId}
                    >
                      <option value="">Select service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} ({service.duration_minutes || 0} min)
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

                  <div className="appointment-form-group full">
                    <label>Available Slots</label>

                    <div className="soft-card doctor-working-hours-box">
                      {!formData.doctorId || !formData.serviceId || !formData.appointmentDate ? (
                        <p>Select doctor, service and date to see available slots.</p>
                      ) : slotLoading ? (
                        <p>Loading available slots...</p>
                      ) : availableSlots.length === 0 ? (
                        <p>No available slots for the selected date.</p>
                      ) : (
                        <>
                          <div className="doctor-working-hours-list">
                            {slotMeta?.workingIntervals?.map((interval) => (
                              <span key={interval.id} className="status-badge confirmed">
                                {interval.start_time} - {interval.end_time}
                              </span>
                            ))}
                          </div>

                          <p className="appointment-duration-hint">
                            Service duration: {slotMeta?.durationMinutes || 0} minutes
                          </p>

                          <div className="available-slots-grid">
                            {availableSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                className={`slot-chip ${formData.appointmentTime === slot ? "active" : ""}`}
                                onClick={() => handleSelectSlot(slot)}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
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
                            <p className="appointment-service-line">
                              <FaStethoscope /> {item.service_name || "Service not set"}
                            </p>

                            <div className="appointment-meta">
                              <span>
                                <FaLocationDot />
                                {item.clinic_name}
                              </span>
                              
                              {/* Formatare Data: dd-mm-yyyy */}
                              <span>
                                <FaCalendarCheck />
                                {new Date(item.appointment_date).toLocaleDateString('ro-RO', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                }).replace(/\./g, '-')}
                              </span>

                              {/* Formatare Ora: hh:mm */}
                              <span>
                                <FaClock />
                                {item.appointment_time?.split(':').slice(0, 2).join(':')}
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
                            <p className="appointment-service-line">
                              <FaStethoscope /> {item.service_name || "Service not set"}
                            </p>

                            <div className="appointment-meta">
                              <span>
                                <FaLocationDot />
                                {item.clinic_name}
                              </span>
                              
                              {/* Formatare Data: dd-mm-yyyy */}
                              <span>
                                <FaCalendarCheck />
                                {new Date(item.appointment_date).toLocaleDateString('ro-RO', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                }).replace(/\//g, '-')}
                              </span>

                              {/* Formatare Ora: hh:mm */}
                              <span>
                                <FaClock />
                                {item.appointment_time.split(':').slice(0, 2).join(':')}
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