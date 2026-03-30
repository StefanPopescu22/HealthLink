import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaUserDoctor, FaHospitalUser } from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import WorkingHoursEditor from "../components/WorkingHoursEditor";
import api from "../services/api";
import "../styles/ClinicCreateDoctor.css";

function ClinicCreateDoctor() {
  const [specialties, setSpecialties] = useState([]);
  const [clinicName, setClinicName] = useState("");
  const [workingHours, setWorkingHours] = useState([
    { weekday: 1, startTime: "09:00", endTime: "15:00" },
  ]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialtyIds: [],
    experienceYears: "",
    description: "",
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const specResponse = await api.get("/meta/specialties");
        setSpecialties(specResponse.data || []);
      } catch (err) {
        console.error("Eroare la încărcarea specialităților:", err);
      }
    };

    const loadClinicProfile = async () => {
      try {
        const profileResponse = await api.get("/clinic/profile");
        if (profileResponse.data && profileResponse.data.name) {
          setClinicName(profileResponse.data.name);
        }
      } catch (err) {
        console.warn("Ruta pentru profilul clinicii nu este completă în backend.");
      }
    };

    loadSpecialties();
    loadClinicProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
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
    
    if (fieldErrors.specialtyIds) {
      setFieldErrors((prev) => ({ ...prev, specialtyIds: null }));
    }
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
    
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (formData.experienceYears === "" || Number(formData.experienceYears) < 0) {
      errors.experienceYears = "Please enter valid experience years.";
    }

    if (formData.specialtyIds.length === 0) {
      errors.specialtyIds = "Please select at least one specialty.";
    }

    if (workingHours.length === 0) {
      setGeneralError("Please set at least one working interval for the doctor.");
      return false;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccess("");

    if (!validateFields()) {
      return;
    }

    try {
      const response = await api.post("/clinic/doctors", {
        ...formData,
        workingHours,
      });

      setSuccess(response.data.message || "Doctor profile created successfully.");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        specialtyIds: [],
        experienceYears: "",
        description: "",
      });
      setWorkingHours([{ weekday: 1, startTime: "09:00", endTime: "15:00" }]);
    } catch (err) {
      setGeneralError(err.response?.data?.message || "Failed to create doctor.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          
          <div className="dashboard-page-content">
            <section className="clinic-doctor-page">
              
              <div className="soft-card clinic-doctor-header">
                <h1>Create Doctor</h1>
                <p>Create a doctor account for your clinic and set the weekly schedule.</p>
                <div className="clinic-doctor-clinic-chip">
                  <FaHospitalUser /> {clinicName ? clinicName : "Clinic Administration"}
                </div>
              </div>

              <form className="soft-card clinic-doctor-form-card" onSubmit={handleSubmit}>
                <div className="clinic-doctor-form-grid">
                  
                  {/* First Name */}
                  <div className="clinic-doctor-input-group">
                    <label htmlFor="firstName">First Name</label>
                    <div className={`clinic-doctor-input-wrapper ${fieldErrors.firstName ? 'has-error' : ''}`}>
                      <FaUser />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="e.g. Ion"
                      />
                    </div>
                    {fieldErrors.firstName && <span className="clinic-doctor-field-error">{fieldErrors.firstName}</span>}
                  </div>

                  {/* Last Name */}
                  <div className="clinic-doctor-input-group">
                    <label htmlFor="lastName">Last Name</label>
                    <div className={`clinic-doctor-input-wrapper ${fieldErrors.lastName ? 'has-error' : ''}`}>
                      <FaUser />
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="e.g. Popescu"
                      />
                    </div>
                    {fieldErrors.lastName && <span className="clinic-doctor-field-error">{fieldErrors.lastName}</span>}
                  </div>

                  {/* Email */}
                  <div className="clinic-doctor-input-group">
                    <label htmlFor="email">Email Address</label>
                    <div className={`clinic-doctor-input-wrapper ${fieldErrors.email ? 'has-error' : ''}`}>
                      <FaEnvelope />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="doctor@clinic.com"
                      />
                    </div>
                    {fieldErrors.email && <span className="clinic-doctor-field-error">{fieldErrors.email}</span>}
                  </div>

                  {/* Password */}
                  <div className="clinic-doctor-input-group">
                    <label htmlFor="password">Password</label>
                    <div className={`clinic-doctor-input-wrapper ${fieldErrors.password ? 'has-error' : ''}`}>
                      <FaLock />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Secure password"
                      />
                    </div>
                    {fieldErrors.password && <span className="clinic-doctor-field-error">{fieldErrors.password}</span>}
                  </div>

                  {/* Experience */}
                  <div className="clinic-doctor-input-group">
                    <label htmlFor="experienceYears">Experience (Years)</label>
                    <div className={`clinic-doctor-input-wrapper ${fieldErrors.experienceYears ? 'has-error' : ''}`}>
                      <FaUserDoctor />
                      <input
                        id="experienceYears"
                        name="experienceYears"
                        type="number"
                        min="0"
                        autoComplete="off"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        placeholder="e.g. 10"
                      />
                    </div>
                    {fieldErrors.experienceYears && <span className="clinic-doctor-field-error">{fieldErrors.experienceYears}</span>}
                  </div>

                  {/* Description */}
                  <div className="clinic-doctor-input-group full">
                    <label htmlFor="description">Professional Description</label>
                    <textarea
                      id="description"
                      name="description"
                      autoComplete="off"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description of the doctor's background and expertise..."
                    />
                  </div>

                  {/* Specialties */}
                  <div className="clinic-doctor-input-group full">
                    <label>Specialties</label>
                    <div className="clinic-doctor-specialties-grid">
                      {specialties.map((specialty) => {
                        const isChecked = formData.specialtyIds.includes(specialty.id);
                        const checkboxId = `specialty-${specialty.id}`;
                        return (
                          <label 
                            key={specialty.id} 
                            htmlFor={checkboxId}
                            className={`clinic-doctor-specialty-pill ${isChecked ? "active" : ""}`}
                          >
                            <input
                              id={checkboxId}
                              type="checkbox"
                              name="specialtyIds"
                              checked={isChecked}
                              onChange={() => toggleSpecialty(specialty.id)}
                            />
                            {specialty.name}
                          </label>
                        );
                      })}
                    </div>
                    {fieldErrors.specialtyIds && <span className="clinic-doctor-field-error">{fieldErrors.specialtyIds}</span>}
                  </div>

                </div>

                <div style={{ marginTop: '24px' }}>
                  <WorkingHoursEditor
                    workingHours={workingHours}
                    setWorkingHours={setWorkingHours}
                  />
                </div>

                {generalError && <p className="clinic-doctor-message error">{generalError}</p>}
                {success && <p className="clinic-doctor-message success">{success}</p>}

                <button type="submit" className="primary-btn clinic-doctor-submit-btn">
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

export default ClinicCreateDoctor;