import { useState } from "react";
import {
  FaArrowRight,
  FaBuilding,
  FaEnvelope,
  FaLock,
  FaLocationDot,
  FaPhone,
  FaUser,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/AdminCreateClinic.css";

function AdminCreateClinic() {
  const [formData, setFormData] = useState({
    contactFirstName: "",
    contactLastName: "",
    email: "",
    password: "",
    clinicName: "",
    clinicType: "clinic",
    city: "",
    address: "",
    phone: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/admin/clinics", formData);
      setSuccess(response.data.message || "Clinic created successfully.");

      setFormData({
        contactFirstName: "",
        contactLastName: "",
        email: "",
        password: "",
        clinicName: "",
        clinicType: "clinic",
        city: "",
        address: "",
        phone: "",
        description: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Clinic creation failed.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="admin-clinic-page">
              <div className="admin-clinic-header soft-card">
                <h1>Create Clinic Account</h1>
                <p>
                  Create a restricted clinic account and its platform profile.
                  This action is available only to system administrators.
                </p>
              </div>

              <form className="admin-clinic-form-card soft-card" onSubmit={handleSubmit}>
                <div className="admin-clinic-form-grid">
                  <div className="admin-clinic-input-group">
                    <label>Contact First Name</label>
                    <div className="admin-clinic-input-wrapper">
                      <FaUser />
                      <input
                        name="contactFirstName"
                        value={formData.contactFirstName}
                        onChange={handleChange}
                        placeholder="Contact first name"
                      />
                    </div>
                  </div>

                  <div className="admin-clinic-input-group">
                    <label>Contact Last Name</label>
                    <div className="admin-clinic-input-wrapper">
                      <FaUser />
                      <input
                        name="contactLastName"
                        value={formData.contactLastName}
                        onChange={handleChange}
                        placeholder="Contact last name"
                      />
                    </div>
                  </div>

                  <div className="admin-clinic-input-group">
                    <label>Login Email</label>
                    <div className="admin-clinic-input-wrapper">
                      <FaEnvelope />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Clinic login email"
                      />
                    </div>
                  </div>

                  <div className="admin-clinic-input-group">
                    <label>Temporary Password</label>
                    <div className="admin-clinic-input-wrapper">
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

                  <div className="admin-clinic-input-group">
                    <label>Clinic Name</label>
                    <div className="admin-clinic-input-wrapper">
                      <FaBuilding />
                      <input
                        name="clinicName"
                        value={formData.clinicName}
                        onChange={handleChange}
                        placeholder="Clinic name"
                      />
                    </div>
                  </div>

                  <div className="admin-clinic-input-group">
                    <label>Clinic Type</label>
                    <div className="admin-clinic-select-wrapper">
                      <select
                        name="clinicType"
                        value={formData.clinicType}
                        onChange={handleChange}
                      >
                        <option value="clinic">Clinic</option>
                        <option value="private_hospital">Private Hospital</option>
                        <option value="public_hospital">Public Hospital</option>
                        <option value="family_doctor">Family Doctor</option>
                        <option value="dental_office">Dental Office</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-clinic-input-group">
                    <label>City</label>
                    <div className="admin-clinic-input-wrapper">
                      <FaLocationDot />
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    </div>
                  </div>

                  <div className="admin-clinic-input-group full">
                    <label>Address</label>
                    <div className="admin-clinic-input-wrapper">
                      <FaLocationDot />
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Clinic address"
                      />
                    </div>
                  </div>

                  <div className="admin-clinic-input-group">
                    <label>Phone</label>
                    <div className="admin-clinic-input-wrapper">
                      <FaPhone />
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="admin-clinic-input-group full">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Clinic profile description"
                    />
                  </div>
                </div>

                {error && <p className="admin-clinic-message error">{error}</p>}
                {success && <p className="admin-clinic-message success">{success}</p>}

                <button type="submit" className="primary-btn admin-clinic-submit-btn">
                  Create Clinic
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

export default AdminCreateClinic;