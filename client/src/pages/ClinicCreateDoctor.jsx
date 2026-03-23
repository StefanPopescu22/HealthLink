import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaClipboardList,
  FaEnvelope,
  FaHospital,
  FaLock,
  FaUser,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/ClinicCreateDoctor.css";

function ClinicCreateDoctor() {
  const [specialties, setSpecialties] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialtyIds: [],
    description: "",
    experienceYears: "",
    scheduleInfo: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [clinicRes, specialtiesRes] = await Promise.all([
          api.get("/clinic/me"),
          api.get("/meta/specialties"),
        ]);

        setClinic(clinicRes.data);
        setSpecialties(specialtiesRes.data);
      } catch (err) {
        setError("Failed to load clinic or specialties.");
      }
    };

    loadOptions();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSpecialtyToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.specialtyIds.includes(id);

      return {
        ...prev,
        specialtyIds: exists
          ? prev.specialtyIds.filter((item) => item !== id)
          : [...prev.specialtyIds, id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        specialtyIds: formData.specialtyIds,
        experienceYears: Number(formData.experienceYears) || 0,
      };

      const response = await api.post("/clinic/doctors", payload);
      setSuccess(response.data.message || "Doctor created successfully.");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        specialtyIds: [],
        description: "",
        experienceYears: "",
        scheduleInfo: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Doctor creation failed.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="clinic-doctor-page">
              <div className="clinic-doctor-header soft-card">
                <h1>Create Doctor for Your Clinic</h1>
                <p>
                  Add a doctor account directly under your clinic workspace.
                  The doctor will be linked automatically to your clinic.
                </p>

                {clinic && (
                  <div className="clinic-doctor-clinic-chip">
                    <FaHospital />
                    <span>{clinic.name}</span>
                  </div>
                )}
              </div>

              <form className="clinic-doctor-form-card soft-card" onSubmit={handleSubmit}>
                <div className="clinic-doctor-form-grid">
                  <div className="clinic-doctor-input-group">
                    <label>First Name</label>
                    <div className="clinic-doctor-input-wrapper">
                      <FaUser />
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                      />
                    </div>
                  </div>

                  <div className="clinic-doctor-input-group">
                    <label>Last Name</label>
                    <div className="clinic-doctor-input-wrapper">
                      <FaUser />
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div className="clinic-doctor-input-group">
                    <label>Login Email</label>
                    <div className="clinic-doctor-input-wrapper">
                      <FaEnvelope />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Doctor login email"
                      />
                    </div>
                  </div>

                  <div className="clinic-doctor-input-group">
                    <label>Temporary Password</label>
                    <div className="clinic-doctor-input-wrapper">
                      <FaLock />
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Temporary password"
                      />
                    </div>
                  </div>

                  <div className="clinic-doctor-input-group">
                    <label>Experience Years</label>
                    <div className="clinic-doctor-input-wrapper">
                      <FaClipboardList />
                      <input
                        name="experienceYears"
                        type="number"
                        min="0"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        placeholder="Years of experience"
                      />
                    </div>
                  </div>

                  <div className="clinic-doctor-input-group full">
                    <label>Specialties</label>
                    <div className="clinic-doctor-specialties-grid">
                      {specialties.map((specialty) => (
                        <label key={specialty.id} className="clinic-doctor-specialty-pill">
                          <input
                            type="checkbox"
                            checked={formData.specialtyIds.includes(specialty.id)}
                            onChange={() => handleSpecialtyToggle(specialty.id)}
                          />
                          <span>{specialty.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="clinic-doctor-input-group full">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Doctor profile description"
                    />
                  </div>

                  <div className="clinic-doctor-input-group full">
                    <label>Schedule Info</label>
                    <textarea
                      name="scheduleInfo"
                      value={formData.scheduleInfo}
                      onChange={handleChange}
                      placeholder="Example: Monday 09:00 - 15:00, Tuesday 10:00 - 17:00"
                    />
                  </div>
                </div>

                {error && <p className="clinic-doctor-message error">{error}</p>}
                {success && <p className="clinic-doctor-message success">{success}</p>}

                <button type="submit" className="primary-btn clinic-doctor-submit-btn">
                  Create Doctor
                  <FaArrowRight />
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

export default ClinicCreateDoctor;