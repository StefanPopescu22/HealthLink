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
  FaCheck,
  FaXmark,
  FaHeartPulse,
  FaLocationDot,
  FaCalendar,
  FaDroplet,
  FaTriangleExclamation,
  FaUserShield,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Profile.css";

const ROLE_ICONS = {
  patient: <FaHeartPulse />,
  doctor:  <FaStethoscope />,
  clinic:  <FaHospital />,
  admin:   <FaUserShield />,
};

function ProfileInfoItem({ label, value, editMode, name, type = "text", onChange, placeholder }) {
  return (
    <div className="profile-info-item">
      <strong>{label}</strong>
      {editMode ? (
        type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || label}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || label}
          />
        )
      ) : (
        <span>{value || "Not set"}</span>
      )}
    </div>
  );
}

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
        const res = await api.get("/profile/me");
        const data = res.data;
        setProfile(data);
        const d = data.details || {};
        setFormData({
          phone: data.phone || "",
          dateOfBirth: d.date_of_birth || "",
          gender: d.gender || "",
          bloodGroup: d.blood_group || "",
          emergencyContactName: d.emergency_contact_name || "",
          emergencyContactPhone: d.emergency_contact_phone || "",
          medicalNotes: d.medical_notes || "",
          allergiesText: (data.allergies || []).map((a) => a.allergy_name).join(", "),
          description: d.description || "",
          experienceYears: d.experience_years || "",
          scheduleInfo: d.schedule_info || "",
          city: d.city || "",
          address: d.address || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setMessage(""); setError("");
    try {
      const payload = { phone: formData.phone };

      if (profile.role === "patient") {
        Object.assign(payload, {
          dateOfBirth:          formData.dateOfBirth,
          gender:               formData.gender,
          bloodGroup:           formData.bloodGroup,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone:formData.emergencyContactPhone,
          medicalNotes:         formData.medicalNotes,
          allergies:            formData.allergiesText.split(",").map((i) => i.trim()).filter(Boolean),
        });
      }

      if (profile.role === "doctor") {
        Object.assign(payload, {
          description:    formData.description,
          experienceYears:formData.experienceYears,
          scheduleInfo:   formData.scheduleInfo,
        });
      }

      if (profile.role === "clinic") {
        Object.assign(payload, {
          city:        formData.city,
          address:     formData.address,
          description: formData.description,
        });
      }

      const res = await api.put("/profile/me", payload);
      setProfile(res.data.profile);
      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage(""); setError("");
  };

  if (!profile) {
    return (
      <>
        <main className="dashboard-screen">
          <div className="page-container dashboard-shell-grid">
            <DashboardSidebar />
            <div className="dashboard-page-content">
              {error ? (
                <p className="profile-message error"><FaXmark /> {error}</p>
              ) : (
                <div className="profile-loading">
                  <div className="profile-skeleton" style={{ height: 130 }} />
                  <div className="profile-skeleton" style={{ height: 280, opacity: 0.6 }} />
                </div>
              )}
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

              <section className="profile-hero">
                <div className="profile-hero-main">
                  <div className="profile-badge">
                    <FaShieldHeart />
                    <span>Secure personal workspace</span>
                  </div>
                  <div className="profile-title-row">
                    <div className="profile-avatar">
                      {ROLE_ICONS[profile.role] || <FaUser />}
                    </div>
                    <div>
                      <h1>
                        {profile.first_name} {profile.last_name}
                      </h1>
                      <p>Manage your account details and personal information.</p>
                    </div>
                  </div>
                </div>

                <div className="profile-hero-actions">
                  {editing ? (
                    <>
                      <button className="profile-edit-btn save" onClick={handleSave}>
                        <FaCheck /> Save Changes
                      </button>
                      <button className="profile-cancel-btn" onClick={handleCancel}>
                        <FaXmark /> Cancel
                      </button>
                    </>
                  ) : (
                    <button className="profile-edit-btn" onClick={() => setEditing(true)}>
                      <FaPenToSquare /> Edit Profile
                    </button>
                  )}
                </div>
              </section>

              {message && <p className="profile-message success"><FaCheck /> {message}</p>}
              {error   && <p className="profile-message error"><FaXmark /> {error}</p>}

              <section className="profile-content">
                <article className="profile-section-card">
                  <div className="profile-section-header">
                    <div className="profile-section-icon"><FaUser /></div>
                    <div>
                      <h2>Account Information</h2>
                      <p>Basic account and contact details.</p>
                    </div>
                  </div>
                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <strong>Full Name</strong>
                      <span>{profile.first_name} {profile.last_name}</span>
                    </div>
                    <div className="profile-info-item">
                      <strong>Email</strong>
                      <span>{profile.email}</span>
                    </div>
                    <div className="profile-info-item">
                      <strong>Role</strong>
                      <span className="role-badge">{profile.role}</span>
                    </div>
                    <ProfileInfoItem
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      editMode={editing}
                      onChange={handleChange}
                      placeholder="e.g. +40 721 000 000"
                    />
                  </div>
                </article>

                {profile.role === "patient" && (
                  <article className="profile-section-card">
                    <div className="profile-section-header">
                      <div className="profile-section-icon"><FaHeartPulse /></div>
                      <div>
                        <h2>Medical Information</h2>
                        <p>Health-related data for your patient profile.</p>
                      </div>
                    </div>
                    <div className="profile-info-grid">
                      <ProfileInfoItem label="Date of Birth"       name="dateOfBirth"          value={formData.dateOfBirth}           editMode={editing} onChange={handleChange} type="date" />
                      <ProfileInfoItem label="Gender"              name="gender"               value={formData.gender}                editMode={editing} onChange={handleChange} placeholder="e.g. Male, Female" />
                      <ProfileInfoItem label="Blood Group"         name="bloodGroup"           value={formData.bloodGroup}            editMode={editing} onChange={handleChange} placeholder="e.g. A+, O-" />
                      <ProfileInfoItem label="Emergency Contact"   name="emergencyContactName" value={formData.emergencyContactName}  editMode={editing} onChange={handleChange} />
                      <ProfileInfoItem label="Emergency Phone"     name="emergencyContactPhone"value={formData.emergencyContactPhone} editMode={editing} onChange={handleChange} />
                      <ProfileInfoItem label="Allergies"           name="allergiesText"        value={formData.allergiesText}         editMode={editing} onChange={handleChange} placeholder="e.g. Penicillin, Dust" />
                      <ProfileInfoItem label="Medical Notes"       name="medicalNotes"         value={formData.medicalNotes}          editMode={editing} onChange={handleChange} type="textarea" />
                    </div>
                  </article>
                )}

                {profile.role === "doctor" && (
                  <article className="profile-section-card">
                    <div className="profile-section-header">
                      <div className="profile-section-icon"><FaStethoscope /></div>
                      <div>
                        <h2>Professional Information</h2>
                        <p>Doctor-specific profile details.</p>
                      </div>
                    </div>
                    <div className="profile-info-grid">
                      <div className="profile-info-item"><strong>Clinic</strong><span>{profile.details?.clinic_name || "Not set"}</span></div>
                      <div className="profile-info-item"><strong>Clinic City</strong><span>{profile.details?.clinic_city || "Not set"}</span></div>
                      <div className="profile-info-item"><strong>Specialties</strong><span>{profile.details?.specialties || "Not set"}</span></div>
                      <ProfileInfoItem label="Experience (years)" name="experienceYears" value={formData.experienceYears} editMode={editing} onChange={handleChange} type="number" placeholder="e.g. 8" />
                      <ProfileInfoItem label="Description"        name="description"     value={formData.description}     editMode={editing} onChange={handleChange} type="textarea" />
                      <ProfileInfoItem label="Schedule Info"      name="scheduleInfo"    value={formData.scheduleInfo}    editMode={editing} onChange={handleChange} type="textarea" placeholder="e.g. Mon–Fri, 09:00–17:00" />
                    </div>
                  </article>
                )}

                {profile.role === "clinic" && (
                  <article className="profile-section-card">
                    <div className="profile-section-header">
                      <div className="profile-section-icon"><FaHospital /></div>
                      <div>
                        <h2>Clinic Information</h2>
                        <p>Clinic-specific profile details.</p>
                      </div>
                    </div>
                    <div className="profile-info-grid">
                      <div className="profile-info-item"><strong>Clinic Name</strong><span>{profile.details?.name || "Not set"}</span></div>
                      <div className="profile-info-item"><strong>Clinic Type</strong><span>{profile.details?.clinic_type || "Not set"}</span></div>
                      <ProfileInfoItem label="City"        name="city"        value={formData.city}        editMode={editing} onChange={handleChange} placeholder="e.g. Bucharest" />
                      <ProfileInfoItem label="Address"     name="address"     value={formData.address}     editMode={editing} onChange={handleChange} />
                      <ProfileInfoItem label="Description" name="description" value={formData.description} editMode={editing} onChange={handleChange} type="textarea" />
                    </div>
                  </article>
                )}

                {profile.role === "admin" && (
                  <article className="profile-section-card">
                    <div className="profile-section-header">
                      <div className="profile-section-icon"><FaUserShield /></div>
                      <div>
                        <h2>Administrator Information</h2>
                        <p>System-level account details.</p>
                      </div>
                    </div>
                    <div className="profile-info-grid">
                      <div className="profile-info-item"><strong>Access Level</strong><span>Full administrative control</span></div>
                      <div className="profile-info-item"><strong>Account Created</strong><span>{profile.created_at || "—"}</span></div>
                    </div>
                  </article>
                )}
              </section>

              <section className="profile-contact-cards">
                <article className="profile-contact-card">
                  <div className="profile-contact-icon"><FaEnvelope /></div>
                  <h3>Email Access</h3>
                  <p>Your email is used for secure login and system notifications.</p>
                </article>

                <article className="profile-contact-card">
                  <div className="profile-contact-icon">
                    {ROLE_ICONS[profile.role] || <FaClipboardList />}
                  </div>
                  <h3>Role-Based Profile</h3>
                  <p>Your profile adapts automatically to the permissions and data of your account role.</p>
                </article>

                <article className="profile-contact-card">
                  <div className="profile-contact-icon"><FaShieldHeart /></div>
                  <h3>Data Security</h3>
                  <p>All personal and medical information is stored securely and accessible only to you.</p>
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