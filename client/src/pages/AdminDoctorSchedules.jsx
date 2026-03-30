import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/DoctorSchedules.css";

const weekdayLabels = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function AdminDoctorSchedules() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorData, setDoctorData] = useState(null);
  const [formData, setFormData] = useState({
    weekday: "1",
    startTime: "09:00",
    endTime: "15:00",
  });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    weekday: "1",
    startTime: "09:00",
    endTime: "15:00",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDoctors = async () => {
    try {
      const response = await api.get("/admin/doctor-schedules/doctors");
      setDoctors(response.data || []);
    } catch {
      setError("Failed to load doctors.");
    }
  };

  const loadSchedule = async (doctorId) => {
    if (!doctorId) {
      setDoctorData(null);
      return;
    }

    try {
      const response = await api.get(`/admin/doctor-schedules/${doctorId}`);
      setDoctorData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load doctor schedule.");
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    loadSchedule(selectedDoctorId);
  }, [selectedDoctorId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post(`/admin/doctor-schedules/${selectedDoctorId}`, formData);
      setSuccess(response.data.message || "Working interval created.");
      await loadSchedule(selectedDoctorId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create working interval.");
    }
  };

  const handleUpdate = async (scheduleId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.put(`/admin/doctor-schedules/${scheduleId}`, editingData);
      setSuccess(response.data.message || "Working interval updated.");
      setEditingId(null);
      await loadSchedule(selectedDoctorId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update working interval.");
    }
  };

  const handleDelete = async (scheduleId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.delete(`/admin/doctor-schedules/${scheduleId}`);
      setSuccess(response.data.message || "Working interval deleted.");
      await loadSchedule(selectedDoctorId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete working interval.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="doctor-schedules-page">
              <div className="soft-card doctor-schedules-header">
                <h1>Admin Doctor Working Hours</h1>
                <p>Manage weekly working intervals for any doctor in the platform.</p>
              </div>

              <div className="soft-card doctor-schedules-selector">
                <label>Select doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                >
                  <option value="">Choose doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.first_name} {doctor.last_name} {doctor.clinic_name ? `- ${doctor.clinic_name}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="doctor-schedules-message error">{error}</p>}
              {success && <p className="doctor-schedules-message success">{success}</p>}

              {selectedDoctorId && (
                <>
                  <form className="soft-card doctor-schedules-form" onSubmit={handleCreate}>
                    <h2>Add Working Interval</h2>

                    <select
                      value={formData.weekday}
                      onChange={(e) => setFormData((prev) => ({ ...prev, weekday: e.target.value }))}
                    >
                      {Object.entries(weekdayLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                    />

                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                    />

                    <button type="submit" className="primary-btn">
                      Add Interval
                    </button>
                  </form>

                  <div className="doctor-schedules-list">
                    {!doctorData && <p>Loading schedule...</p>}

                    {doctorData && doctorData.schedule.length === 0 && (
                      <div className="soft-card empty-state-card">No working intervals yet.</div>
                    )}

                    {doctorData &&
                      doctorData.schedule.map((item) => (
                        <article className="soft-card doctor-schedule-card" key={item.id}>
                          {editingId === item.id ? (
                            <div className="doctor-schedule-edit-row">
                              <select
                                value={editingData.weekday}
                                onChange={(e) =>
                                  setEditingData((prev) => ({
                                    ...prev,
                                    weekday: e.target.value,
                                  }))
                                }
                              >
                                {Object.entries(weekdayLabels).map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>

                              <input
                                type="time"
                                value={editingData.startTime}
                                onChange={(e) =>
                                  setEditingData((prev) => ({
                                    ...prev,
                                    startTime: e.target.value,
                                  }))
                                }
                              />

                              <input
                                type="time"
                                value={editingData.endTime}
                                onChange={(e) =>
                                  setEditingData((prev) => ({
                                    ...prev,
                                    endTime: e.target.value,
                                  }))
                                }
                              />

                              <button className="primary-btn" onClick={() => handleUpdate(item.id)}>
                                Save
                              </button>
                            </div>
                          ) : (
                            <>
                              <h3>{weekdayLabels[item.weekday]}</h3>
                              <p>{item.start_time} - {item.end_time}</p>

                              <div className="doctor-schedule-actions">
                                <button
                                  className="secondary-btn"
                                  onClick={() => {
                                    setEditingId(item.id);
                                    setEditingData({
                                      weekday: String(item.weekday),
                                      startTime: item.start_time.slice(0, 5),
                                      endTime: item.end_time.slice(0, 5),
                                    });
                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  className="secondary-btn"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </article>
                      ))}
                  </div>
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

export default AdminDoctorSchedules;