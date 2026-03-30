import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaHospital, FaUserDoctor } from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import WorkingHoursEditor from "../components/WorkingHoursEditor";
import api from "../services/api";
import { validateDoctorForm } from "../utils/formValidators";
import "../styles/AdminCreateDoctor.css";

function AdminCreateDoctor() {
  const [clinics, setClinics] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [workingHours, setWorkingHours] = useState([
    { weekday: 1, startTime: "09:00", endTime: "15:00" },
  ]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    clinicId: "",
    specialtyIds: [],
    experienceYears: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clinicsRes, specialtiesRes] = await Promise.all([
          api.get("/admin/clinics/options"),
          api.get("/meta/specialties"),
        ]);

        setClinics(clinicsRes.data || []);
        setSpecialties(specialtiesRes.data || []);
      } catch {
        setError("Failed to load form data.");
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleSpecialty = (specialtyId) => {
    setFormData((prev) => {
      const exists = prev.specialtyIds.includes(specialtyId);

      return {
        ...prev,
        specialtyIds: exists
          ? prev.specialtyIds.filter((id) => id !== specialtyId)
          : [...prev.specialtyIds, specialtyId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationMessage = validateDoctorForm(formData, workingHours);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      const response = await api.post("/admin/doctors", {
        ...formData,
        workingHours,
      });

      setSuccess(response.data.message || "Doctor created successfully.");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        clinicId: "",
        specialtyIds: [],
        experienceYears: "",
        description: "",
      });

      setWorkingHours([{ weekday: 1, startTime: "09:00", endTime: "15:00" }]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create doctor.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          
          <div className="dashboard-page-content">
            <section className="admin-doctor-page">
              
              <div className="soft-card admin-doctor-header">
                <h1>Create Doctor</h1>
                <p>Create a doctor account and set the structured weekly schedule.</p>
              </div>

              <form className="soft-card admin-doctor-form-card" onSubmit={handleSubmit}>
                <div className="admin-doctor-form-grid">
                  
                  {/* First Name */}
                  <div className="admin-doctor-input-group">
                    <label>First Name</label>
                    <div className="admin-doctor-input-wrapper">
                      <FaUser />
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="e.g. Ion"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="admin-doctor-input-group">
                    <label>Last Name</label>
                    <div className="admin-doctor-input-wrapper">
                      <FaUser />
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="e.g. Popescu"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="admin-doctor-input-group">
                    <label>Email Address</label>
                    <div className="admin-doctor-input-wrapper">
                      <FaEnvelope />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="doctor@clinic.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="admin-doctor-input-group">
                    <label>Password</label>
                    <div className="admin-doctor-input-wrapper">
                      <FaLock />
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Secure password"
                      />
                    </div>
                  </div>

                  {/* Clinic Select */}
                  <div className="admin-doctor-input-group">
                    <label>Assign to Clinic</label>
                    <div className="admin-doctor-select-wrapper">
                      <FaHospital />
                      <select name="clinicId" value={formData.clinicId} onChange={handleChange}>
                        <option value="">Select a clinic...</option>
                        {clinics.map((clinic) => (
                          <option key={clinic.id} value={clinic.id}>
                            {clinic.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Experience Years */}
                  <div className="admin-doctor-input-group">
                    <label>Experience (Years)</label>
                    <div className="admin-doctor-input-wrapper">
                      <FaUserDoctor />
                      <input
                        name="experienceYears"
                        type="number"
                        min="0"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        placeholder="e.g. 5"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="admin-doctor-input-group full">
                    <label>Professional Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description of the doctor's background and expertise..."
                    />
                  </div>

                  {/* Specialties Checkboxes */}
                  <div className="admin-doctor-input-group full">
                    <label>Specialties</label>
                    <div className="admin-doctor-specialties-grid">
                      {specialties.map((specialty) => {
                        const isChecked = formData.specialtyIds.includes(specialty.id);
                        return (
                          <label 
                            key={specialty.id} 
                            className={`admin-doctor-specialty-pill ${isChecked ? "active" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSpecialty(specialty.id)}
                            />
                            {specialty.name}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Working Hours Editor */}
                <div style={{ marginTop: '24px' }}>
                  <WorkingHoursEditor
                    workingHours={workingHours}
                    setWorkingHours={setWorkingHours}
                  />
                </div>

                {error && <p className="admin-doctor-message error">{error}</p>}
                {success && <p className="admin-doctor-message success">{success}</p>}

                <button type="submit" className="primary-btn admin-doctor-submit-btn">
                  Create Doctor Profile
                </button>
              </form>

            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminCreateDoctor;