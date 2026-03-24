import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPenToSquare,
  FaPhone,
  FaShieldHeart,
  FaUser,
  FaHospital,
  FaStethoscope,
  FaClipboardList,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalNotes: "",
    allergiesText: "",
    description: "",
    experienceYears: "",
    scheduleInfo: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/profile/me");
        const data = response.data;
        setProfile(data);

        const details = data.details || {};

        setFormData({
          phone: data.phone || "",
          dateOfBirth: details.date_of_birth || "",
          gender: details.gender || "",
          bloodGroup: details.blood_group || "",
          emergencyContactName: details.emergency_contact_name || "",
          emergencyContactPhone: details.emergency_contact_phone || "",
          medicalNotes: details.medical_notes || "",
          allergiesText: (data.allergies || []).map((a) => a.allergy_name).join(", "),
          description: details.description || "",
          experienceYears: details.experience_years || "",
          scheduleInfo: details.schedule_info || "",
          city: details.city || "",
          address: details.address || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setMessage("");
    setError("");

    try {
      const payload = {
        phone: formData.phone,
      };

      if (profile.role === "patient") {
        payload.dateOfBirth = formData.dateOfBirth;
        payload.gender = formData.gender;
        payload.bloodGroup = formData.bloodGroup;
        payload.emergencyContactName = formData.emergencyContactName;
        payload.emergencyContactPhone = formData.emergencyContactPhone;
        payload.medicalNotes = formData.medicalNotes;
        payload.allergies = formData.allergiesText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      if (profile.role === "doctor") {
        payload.description = formData.description;
        payload.experienceYears = formData.experienceYears;
        payload.scheduleInfo = formData.scheduleInfo;
      }

      if (profile.role === "clinic") {
        payload.city = formData.city;
        payload.address = formData.address;
        payload.description = formData.description;
      }

      const response = await api.put("/profile/me", payload);
      setProfile(response.data.profile);
      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  if (!profile) {
    return (
      <>
        <main className="dashboard-screen">
          <div className="page-container dashboard-shell-grid">
            <DashboardSidebar />
            <div className="dashboard-page-content">
              <p>{error || "Loading profile..."}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="profile-page">
              <section className="profile-hero soft-card">
                <div className="profile-hero-main">
                  <div className="profile-badge">
                    <FaShieldHeart />
                    <span>Secure personal workspace</span>
                  </div>

                  <div className="profile-title-row">
                    <div className="profile-avatar">
                      <FaUser />
                    </div>

                    <div>
                      <h1>My Profile</h1>
                      <p>Manage your account details based on your role.</p>
                    </div>
                  </div>
                </div>

                <button
                  className="primary-btn"
                  onClick={() => (editing ? handleSave() : setEditing(true))}
                >
                  <FaPenToSquare />
                  {editing ? "Save Profile" : "Edit Profile"}
                </button>
              </section>

              {message && <p style={{ color: "green", marginBottom: "12px" }}>{message}</p>}
              {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

              <section className="profile-content">
                <article className="soft-card profile-section-card">
                  <div className="profile-section-header">
                    <h2>Account Information</h2>
                    <p>Basic account and contact details.</p>
                  </div>

                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <strong>First Name</strong>
                      <span>{profile.first_name}</span>
                    </div>

                    <div className="profile-info-item">
                      <strong>Last Name</strong>
                      <span>{profile.last_name}</span>
                    </div>

                    <div className="profile-info-item">
                      <strong>Email</strong>
                      <span>{profile.email}</span>
                    </div>

                    <div className="profile-info-item">
                      <strong>Role</strong>
                      <span>{profile.role}</span>
                    </div>

                    <div className="profile-info-item">
                      <strong>Phone</strong>
                      {editing ? (
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone number"
                        />
                      ) : (
                        <span>{formData.phone || "Not set"}</span>
                      )}
                    </div>
                  </div>
                </article>

                {profile.role === "patient" && (
                  <article className="soft-card profile-section-card">
                    <div className="profile-section-header">
                      <h2>Medical Information</h2>
                      <p>Health-related data for the patient profile.</p>
                    </div>

                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <strong>Date of Birth</strong>
                        {editing ? (
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                          />
                        ) : (
                          <span>{formData.dateOfBirth || "Not set"}</span>
                        )}
                      </div>

                      <div className="profile-info-item">
                        <strong>Gender</strong>
                        {editing ? (
                          <input
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            placeholder="Gender"
                          />
                        ) : (
                          <span>{formData.gender || "Not set"}</span>
                        )}
                      </div>

                      <div className="profile-info-item">
                        <strong>Blood Group</strong>
                        {editing ? (
                          <input
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            placeholder="Blood group"
                          />
                        ) : (
                          <span>{formData.bloodGroup || "Not set"}</span>
                        )}
                      </div>

                      <div className="profile-info-item">
                        <strong>Emergency Contact Name</strong>
                        {editing ? (
                          <input
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleChange}
                            placeholder="Emergency contact name"
                          />
                        ) : (
                          <span>{formData.emergencyContactName || "Not set"}</span>
                        )}
                      </div>

                      <div className="profile-info-item">
                        <strong>Emergency Contact Phone</strong>
                        {editing ? (
                          <input
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleChange}
                            placeholder="Emergency contact phone"
                          />
                        ) : (
                          <span>{formData.emergencyContactPhone || "Not set"}</span>
                        )}
                      </div>

                      <div className="profile-info-item">
                        <strong>Allergies</strong>
                        {editing ? (
                          <input
                            name="allergiesText"
                            value={formData.allergiesText}
                            onChange={handleChange}
                            placeholder="Example: Penicillin, Dust"
                          />
                        ) : (
                          <span>{formData.allergiesText || "Not set"}</span>
                        )}
                      </div>

                      <div className="profile-info-item">
                        <strong>Medical Notes</strong>
                        {editing ? (
                          <textarea
                            name="medicalNotes"
                            value={formData.medicalNotes}
                            onChange={handleChange}
                            placeholder="Medical notes"
                          />
                        ) : (
                          <span>{formData.medicalNotes || "Not set"}</span>
                        )}
                      </div>
                    </div>
                  </article>
                )}

                {profile.role === "doctor" && (
                  <article className="soft-card profile-section-card">
                    <div className="profile-section-header">
                      <h2>Professional Information</h2>
                      <p>Doctor-specific profile information.</p>
                    </div>

                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <strong>Clinic</strong>
                        <span>{profile.details?.clinic_name || "Not set"}</span>
                      </div>

                      <div className="profile-info-item">
                        <strong>Clinic City</strong>
                        <span>{profile.details?.clinic_city || "Not set"}</span>
                      </div>

                      <div className="profile-info-item">
                        <strong>Specialties</strong>
                        <span>{profile.details?.specialties || "Not set"}</span>
                      </div>

                      <div className="profile-info-item">
                        <strong>Experience Years</strong>
                        {editing ? (
                          <input
                            name="experienceYears"
                            type="number"
                            min="0"
                            value={formData.experienceYears}
                            onChange={handleChange}
                            placeholder="Years of experience"
                          />
                        ) : (
                          <span>{formData.experienceYears || "Not set"}</span>
                        )}
                      </div>

                      <div className="profile-info-item">
                        <strong>Description</strong>
                        {editing ? (
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Professional description"
                          />
                        ) : (
                          <span>{formData.description || "Not set"}</span>
                        )}
                      </div>

                      <div className="profile-info-item">
                        <strong>Schedule</strong>
                        {editing ? (
                          <textarea
                            name="scheduleInfo"
                            value={formData.scheduleInfo}
                            onChange={handleChange}
                            placeholder="Schedule information"
                          />
                        ) : (
                          <span>{formData.scheduleInfo || "Not set"}</span>
                        )}
                      </div>
                    </div>
                  </article>
                )}

                {profile.role === "clinic" && (
                  <article className="soft-card profile-section-card">
                    <div className="profile-section-header">
                      <h2>Clinic Information</h2>
                      <p>Clinic-specific profile information.</p>
                    </div>

                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <strong>Clinic Name</strong>
                        <span>{profile.details?.name || "Not set"}</span>
                      </div>

                      <div className="profile-info-item">
                        <strong>Clinic Type</strong>
                        <span>{profile.details?.clinic_type || "Not set"}</span>
                      </div>

                      <div className="profile-info-item">
                        <strong>City</strong>
                        {editing ? (
                          <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                          />
                        ) : (
                          <span>{formData.city || "Not set"}</span>
                        )}
                      </div>

                      <div className="profile-info-item">
                        <strong>Address</strong>
                        {editing ? (
                          <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                          />
                        ) : (
                          <span>{formData.address || "Not set"}</span>
                        )}
                      </div>

                      <div className="profile-info-item">
                        <strong>Description</strong>
                        {editing ? (
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Clinic description"
                          />
                        ) : (
                          <span>{formData.description || "Not set"}</span>
                        )}
                      </div>
                    </div>
                  </article>
                )}

                {profile.role === "admin" && (
                  <article className="soft-card profile-section-card">
                    <div className="profile-section-header">
                      <h2>Administrator Information</h2>
                      <p>System-level account information.</p>
                    </div>

                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <strong>Access Level</strong>
                        <span>Full administrative control</span>
                      </div>

                      <div className="profile-info-item">
                        <strong>Created At</strong>
                        <span>{profile.created_at}</span>
                      </div>
                    </div>
                  </article>
                )}
              </section>

              <section className="profile-contact-cards">
                <article className="soft-card profile-contact-card">
                  <div className="profile-contact-icon">
                    <FaEnvelope />
                  </div>
                  <h3>Email Access</h3>
                  <p>Keep your email updated for notifications and secure access.</p>
                </article>

                <article className="soft-card profile-contact-card">
                  <div className="profile-contact-icon">
                    {profile.role === "clinic" ? <FaHospital /> : profile.role === "doctor" ? <FaStethoscope /> : <FaPhone />}
                  </div>
                  <h3>Role-Based Information</h3>
                  <p>Your profile adapts automatically to the permissions and data of your account role.</p>
                </article>
              </section>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Profile;