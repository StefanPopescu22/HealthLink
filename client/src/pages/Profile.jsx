import {
  FaEnvelope,
  FaPenToSquare,
  FaPhone,
  FaShieldHeart,
  FaUser,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/Profile.css";

function Profile() {
  const personalInfo = [
    { label: "First Name", value: "Stefan" },
    { label: "Last Name", value: "Popescu" },
    { label: "Email", value: "stefan@example.com" },
    { label: "Phone", value: "+40 700 000 000" },
    { label: "Role", value: "Patient" },
  ];

  const medicalInfo = [
    { label: "Blood Group", value: "A+" },
    { label: "Allergies", value: "Penicillin" },
    { label: "Emergency Contact", value: "Not added yet" },
    { label: "Medical Notes", value: "No chronic conditions recorded." },
  ];

  return (
    <>
      <main className="profile-page">
        <div className="page-container">
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
                  <p>Manage your personal and medical information in one place.</p>
                </div>
              </div>
            </div>

            <button className="primary-btn">
              <FaPenToSquare />
              Edit Profile
            </button>
          </section>

          <section className="profile-content">
            <article className="soft-card profile-section-card">
              <div className="profile-section-header">
                <h2>Personal Information</h2>
                <p>Basic account and contact details.</p>
              </div>

              <div className="profile-info-grid">
                {personalInfo.map((item, index) => (
                  <div className="profile-info-item" key={index}>
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="soft-card profile-section-card">
              <div className="profile-section-header">
                <h2>Medical Information</h2>
                <p>Core health-related details stored in your account.</p>
              </div>

              <div className="profile-info-grid">
                {medicalInfo.map((item, index) => (
                  <div className="profile-info-item" key={index}>
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="profile-contact-cards">
            <article className="soft-card profile-contact-card">
              <div className="profile-contact-icon">
                <FaEnvelope />
              </div>
              <h3>Email Access</h3>
              <p>Keep your email updated for appointment and document notifications.</p>
            </article>

            <article className="soft-card profile-contact-card">
              <div className="profile-contact-icon">
                <FaPhone />
              </div>
              <h3>Phone Availability</h3>
              <p>Use a valid phone number for urgent healthcare communication.</p>
            </article>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Profile;