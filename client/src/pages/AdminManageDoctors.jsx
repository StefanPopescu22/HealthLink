import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import {
  FaUserDoctor,
  FaHospital,
  FaStethoscope,
  FaClock,
  FaPhone,
  FaPen,
  FaCalendarDays,
  FaTrash,
  FaCheck,
  FaXmark,
  FaPlus,
  FaClockRotateLeft,
} from "react-icons/fa6";
import "../styles/AdminManageDoctors.css";

/* ── Weekday config ───────────────────────────────────────────── */
const WEEKDAYS = {
  0: { label: "Sunday",    abbr: "SUN" },
  1: { label: "Monday",    abbr: "MON" },
  2: { label: "Tuesday",   abbr: "TUE" },
  3: { label: "Wednesday", abbr: "WED" },
  4: { label: "Thursday",  abbr: "THU" },
  5: { label: "Friday",    abbr: "FRI" },
  6: { label: "Saturday",  abbr: "SAT" },
};

/* ── Helper: initials from name ──────────────────────────────── */
const initials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "DR";

/* ── Helper: format time ─────────────────────────────────────── */
const fmt = (t) => (t ? t.slice(0, 5) : "—");

/* ================================================================ */
function AdminManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [expandedScheduleId, setExpandedScheduleId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    description: "",
    experienceYears: "",
    scheduleInfo: "",
  });

  const [scheduleMap, setScheduleMap] = useState({});
  const [newScheduleFormMap, setNewScheduleFormMap] = useState({});
  const [editingScheduleMap, setEditingScheduleMap] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ── Load ─────────────────────────────────────────────────── */
  const loadDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const res = await api.get("/admin/doctors");
      setDoctors(res.data);
    } catch {
      setError("Failed to load doctors.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => { loadDoctors(); }, []);

  /* ── Doctor edit ──────────────────────────────────────────── */
  const startEdit = (doctor) => {
    setEditingDoctorId(doctor.id);
    setFormData({
      firstName:       doctor.first_name       || "",
      lastName:        doctor.last_name        || "",
      phone:           doctor.phone            || "",
      description:     doctor.description      || "",
      experienceYears: doctor.experience_years || "",
      scheduleInfo:    doctor.schedule_info    || "",
    });
  };

  const cancelEdit = () => setEditingDoctorId(null);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSaveDoctor = async (doctorId) => {
    setError(""); setSuccess("");
    try {
      const res = await api.put(`/admin/doctors/${doctorId}`, formData);
      setSuccess(res.data.message || "Doctor updated successfully.");
      setEditingDoctorId(null);
      await loadDoctors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update doctor.");
    }
  };

  /* ── Schedule ─────────────────────────────────────────────── */
  const loadDoctorSchedule = async (doctorId) => {
    try {
      const res = await api.get(`/admin/doctor-schedules/${doctorId}`);
      setScheduleMap((prev) => ({ ...prev, [doctorId]: res.data.schedule || [] }));
      setNewScheduleFormMap((prev) => ({
        ...prev,
        [doctorId]: { weekday: "1", startTime: "09:00", endTime: "17:00" },
      }));
    } catch {
      setError("Failed to load doctor schedule.");
    }
  };

  const toggleSchedulePanel = async (doctorId) => {
    if (expandedScheduleId === doctorId) {
      setExpandedScheduleId(null);
      return;
    }
    setExpandedScheduleId(doctorId);
    if (!scheduleMap[doctorId]) await loadDoctorSchedule(doctorId);
  };

  const updateNewField = (doctorId, field, value) =>
    setNewScheduleFormMap((prev) => ({
      ...prev,
      [doctorId]: {
        ...(prev[doctorId] || { weekday: "1", startTime: "09:00", endTime: "17:00" }),
        [field]: value,
      },
    }));

  const addInterval = async (doctorId) => {
    setError(""); setSuccess("");
    const form = newScheduleFormMap[doctorId];
    if (!form) return;
    try {
      const res = await api.post(`/admin/doctor-schedules/${doctorId}`, form);
      setSuccess(res.data.message || "Working interval created.");
      await loadDoctorSchedule(doctorId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create working interval.");
    }
  };

  const startEditSchedule = (doctorId, item) =>
    setEditingScheduleMap((prev) => ({
      ...prev,
      [item.id]: {
        doctorId,
        weekday:   String(item.weekday),
        startTime: fmt(item.start_time),
        endTime:   fmt(item.end_time),
      },
    }));

  const updateEditField = (scheduleId, field, value) =>
    setEditingScheduleMap((prev) => ({
      ...prev,
      [scheduleId]: { ...prev[scheduleId], [field]: value },
    }));

  const saveEditedSchedule = async (scheduleId) => {
    setError(""); setSuccess("");
    const payload = editingScheduleMap[scheduleId];
    if (!payload) return;
    try {
      const res = await api.put(`/admin/doctor-schedules/${scheduleId}`, payload);
      setSuccess(res.data.message || "Working interval updated.");
      setEditingScheduleMap((prev) => {
        const copy = { ...prev };
        delete copy[scheduleId];
        return copy;
      });
      await loadDoctorSchedule(payload.doctorId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update working interval.");
    }
  };

  const cancelEditSchedule = (scheduleId) =>
    setEditingScheduleMap((prev) => {
      const copy = { ...prev };
      delete copy[scheduleId];
      return copy;
    });

  const deleteInterval = async (doctorId, scheduleId) => {
    setError(""); setSuccess("");
    try {
      const res = await api.delete(`/admin/doctor-schedules/${scheduleId}`);
      setSuccess(res.data.message || "Working interval deleted.");
      await loadDoctorSchedule(doctorId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete working interval.");
    }
  };

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="admin-manage-doctors-page">

              {/* ── Header ──────────────────────────────────── */}
              <div className="admin-manage-doctors-header">
                <div className="admin-header-text">
                  <div className="admin-header-badge">
                    <FaUserDoctor />
                    Admin Panel
                  </div>
                  <h1>Manage Doctors</h1>
                  <p>
                    Edit doctor profiles, update contact details and configure
                    structured working schedules from one place.
                  </p>
                </div>

                <div className="admin-header-meta">
                  <div className="admin-doctor-count">
                    <strong>{doctors.length}</strong>
                    <span>Doctors total</span>
                  </div>
                </div>
              </div>

              {/* ── Feedback ────────────────────────────────── */}
              {error   && <p className="admin-manage-message error"><FaXmark /> {error}</p>}
              {success && <p className="admin-manage-message success"><FaCheck /> {success}</p>}

              {/* ── List ────────────────────────────────────── */}
              <div className="admin-manage-doctors-list">
                {loadingDoctors && (
                  <>
                    <div className="admin-doctor-skeleton" />
                    <div className="admin-doctor-skeleton" style={{ opacity: 0.6 }} />
                    <div className="admin-doctor-skeleton" style={{ opacity: 0.35 }} />
                  </>
                )}

                {!loadingDoctors && doctors.length === 0 && (
                  <div className="soft-card empty-state-card">No doctors registered yet.</div>
                )}

                {!loadingDoctors && doctors.map((doctor) => (
                  <article className="admin-manage-doctor-card" key={doctor.id}>

                    {/* ── Edit form ────────────────────────── */}
                    {editingDoctorId === doctor.id ? (
                      <div className="admin-manage-form">
                        <div className="admin-form-title">
                          <FaPen />
                          Editing: Dr. {doctor.first_name} {doctor.last_name}
                        </div>

                        <div className="admin-form-grid">
                          <div className="admin-form-group">
                            <label>First Name</label>
                            <input
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="First name"
                            />
                          </div>
                          <div className="admin-form-group">
                            <label>Last Name</label>
                            <input
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder="Last name"
                            />
                          </div>
                          <div className="admin-form-group">
                            <label>Phone</label>
                            <input
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Phone number"
                            />
                          </div>
                          <div className="admin-form-group">
                            <label>Years of Experience</label>
                            <input
                              name="experienceYears"
                              type="number"
                              min="0"
                              value={formData.experienceYears}
                              onChange={handleChange}
                              placeholder="e.g. 8"
                            />
                          </div>
                          <div className="admin-form-group full">
                            <label>Description</label>
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              placeholder="Professional bio or description..."
                            />
                          </div>
                          <div className="admin-form-group full">
                            <label>Schedule Summary (optional note)</label>
                            <textarea
                              name="scheduleInfo"
                              value={formData.scheduleInfo}
                              onChange={handleChange}
                              placeholder="e.g. Available Mon–Fri, 09:00–17:00"
                            />
                          </div>
                        </div>

                        <div className="admin-form-actions">
                          <button
                            className="primary-btn"
                            onClick={() => handleSaveDoctor(doctor.id)}
                          >
                            <FaCheck /> Save Changes
                          </button>
                          <button className="admin-btn-cancel" onClick={cancelEdit}>
                            <FaXmark /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Doctor view ─────────────────────── */
                      <>
                        <div className="admin-doctor-top">
                          <div className="admin-doctor-identity">
                            {/* Avatar */}
                            <div className="admin-doctor-avatar">
                              {initials(doctor.first_name, doctor.last_name)}
                            </div>

                            {/* Info */}
                            <div className="admin-doctor-info">
                              <h3>
                                Dr. {doctor.first_name} {doctor.last_name}
                              </h3>
                              <p className="doctor-email">{doctor.email}</p>

                              <div className="admin-doctor-chips">
                                {doctor.clinic_name && (
                                  <span className="admin-chip chip-clinic">
                                    <FaHospital />
                                    {doctor.clinic_name}
                                  </span>
                                )}
                                {doctor.specialties && (
                                  <span className="admin-chip chip-specialty">
                                    <FaStethoscope />
                                    {doctor.specialties}
                                  </span>
                                )}
                                <span className="admin-chip chip-exp">
                                  <FaClockRotateLeft />
                                  {doctor.experience_years || 0} yrs exp.
                                </span>
                                {doctor.phone && (
                                  <span className="admin-chip">
                                    <FaPhone />
                                    {doctor.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Details grid */}
                        {(doctor.description || doctor.schedule_info) && (
                          <div className="admin-doctor-details">
                            {doctor.description && (
                              <div className="admin-detail-item">
                                <span className="admin-detail-label">Description</span>
                                <span className="admin-detail-value">{doctor.description}</span>
                              </div>
                            )}
                            {doctor.schedule_info && (
                              <div className="admin-detail-item">
                                <span className="admin-detail-label">Schedule Note</span>
                                <span className="admin-detail-value">{doctor.schedule_info}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions bar */}
                        <div className="admin-manage-main-actions">
                          <button
                            className="admin-action-btn btn-edit"
                            onClick={() => startEdit(doctor)}
                          >
                            <FaPen /> Edit Doctor
                          </button>
                          <button
                            className={`admin-action-btn btn-schedule ${expandedScheduleId === doctor.id ? "active" : ""}`}
                            onClick={() => toggleSchedulePanel(doctor.id)}
                          >
                            <FaCalendarDays />
                            {expandedScheduleId === doctor.id
                              ? "Close Schedule"
                              : "Manage Schedule"}
                          </button>
                        </div>
                      </>
                    )}

                    {/* ── Schedule panel ───────────────────── */}
                    {expandedScheduleId === doctor.id && (
                      <section className="doctor-schedule-management-block">

                        {/* Header */}
                        <div className="schedule-block-header">
                          <h4>
                            <FaCalendarDays />
                            Working Schedule
                          </h4>
                          <span className="schedule-count">
                            {(scheduleMap[doctor.id] || []).length} intervals
                          </span>
                        </div>

                        {/* Add interval form */}
                        <div className="doctor-schedule-add-form">
                          <div className="schedule-field-wrap">
                            <span className="schedule-add-label">Day of week</span>
                            <select
                              value={newScheduleFormMap[doctor.id]?.weekday || "1"}
                              onChange={(e) => updateNewField(doctor.id, "weekday", e.target.value)}
                            >
                              {Object.entries(WEEKDAYS).map(([val, { label }]) => (
                                <option key={val} value={val}>{label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="schedule-field-wrap">
                            <span className="schedule-add-label">Start time</span>
                            <input
                              type="time"
                              value={newScheduleFormMap[doctor.id]?.startTime || "09:00"}
                              onChange={(e) => updateNewField(doctor.id, "startTime", e.target.value)}
                            />
                          </div>

                          <div className="schedule-field-wrap">
                            <span className="schedule-add-label">End time</span>
                            <input
                              type="time"
                              value={newScheduleFormMap[doctor.id]?.endTime || "17:00"}
                              onChange={(e) => updateNewField(doctor.id, "endTime", e.target.value)}
                            />
                          </div>

                          <button
                            className="primary-btn"
                            onClick={() => addInterval(doctor.id)}
                            style={{ minHeight: 48, alignSelf: "flex-end" }}
                          >
                            <FaPlus /> Add
                          </button>
                        </div>

                        {/* Intervals list */}
                        <div className="doctor-schedule-intervals-list">
                          {(scheduleMap[doctor.id] || []).length === 0 && (
                            <div className="schedule-empty-state">
                              <FaCalendarDays />
                              <span>No working intervals configured yet.</span>
                              <span style={{ fontSize: "0.82rem" }}>Use the form above to add the first one.</span>
                            </div>
                          )}

                          {(scheduleMap[doctor.id] || []).map((interval) => {
                            const isEditing = !!editingScheduleMap[interval.id];
                            const dayInfo = WEEKDAYS[interval.weekday] || { label: "Unknown", abbr: "???" };

                            return (
                              <article className="doctor-schedule-interval-card" key={interval.id}>
                                {isEditing ? (
                                  /* Edit row */
                                  <div className="doctor-schedule-edit-row" style={{ width: "100%" }}>
                                    <select
                                      value={editingScheduleMap[interval.id].weekday}
                                      onChange={(e) => updateEditField(interval.id, "weekday", e.target.value)}
                                    >
                                      {Object.entries(WEEKDAYS).map(([val, { label }]) => (
                                        <option key={val} value={val}>{label}</option>
                                      ))}
                                    </select>
                                    <input
                                      type="time"
                                      value={editingScheduleMap[interval.id].startTime}
                                      onChange={(e) => updateEditField(interval.id, "startTime", e.target.value)}
                                    />
                                    <input
                                      type="time"
                                      value={editingScheduleMap[interval.id].endTime}
                                      onChange={(e) => updateEditField(interval.id, "endTime", e.target.value)}
                                    />
                                    <div style={{ display: "flex", gap: 8 }}>
                                      <button
                                        className="interval-btn btn-edit-interval"
                                        onClick={() => saveEditedSchedule(interval.id)}
                                      >
                                        <FaCheck /> Save
                                      </button>
                                      <button
                                        className="interval-btn btn-delete-interval"
                                        onClick={() => cancelEditSchedule(interval.id)}
                                      >
                                        <FaXmark />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  /* View row */
                                  <>
                                    <div className="interval-info">
                                      <div className="interval-day">
                                        <span className="interval-day-abbr">{dayInfo.abbr}</span>
                                      </div>
                                      <div className="interval-text">
                                        <h5>{dayInfo.label}</h5>
                                        <p>
                                          <FaClock />
                                          {fmt(interval.start_time)} – {fmt(interval.end_time)}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="doctor-schedule-actions">
                                      <button
                                        className="interval-btn btn-edit-interval"
                                        onClick={() => startEditSchedule(doctor.id, interval)}
                                      >
                                        <FaPen /> Edit
                                      </button>
                                      <button
                                        className="interval-btn btn-delete-interval"
                                        onClick={() => deleteInterval(doctor.id, interval.id)}
                                      >
                                        <FaTrash /> Delete
                                      </button>
                                    </div>
                                  </>
                                )}
                              </article>
                            );
                          })}
                        </div>
                      </section>
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

export default AdminManageDoctors;