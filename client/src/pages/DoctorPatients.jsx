import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserGroup,
  FaUserDoctor,
  FaCalendarCheck,
  FaEnvelope,
  FaPhone,
  FaArrowRight,
  FaXmark,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/DoctorPatients.css";

function DoctorPatients() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await api.get("/doctor/patients");
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load patients.");
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const patients = data?.patients || [];

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="doctor-patients-page">

              <div className="doctor-patients-header">
                <div className="doctor-patients-header-text">
                  <div className="doctor-patients-badge">
                    <FaUserDoctor />
                    Doctor Panel
                  </div>
                  <h1>My Patients</h1>
                  <p>Patients linked to your appointments on the platform.</p>
                </div>
                <div className="doctor-patients-header-meta">
                  <div className="doctor-patients-count">
                    <strong>{patients.length}</strong>
                    <span>Patients</span>
                  </div>
                  <div className="doctor-patients-count">
                    <strong>
                      {patients.reduce((s, p) => s + (p.appointments_count || 0), 0)}
                    </strong>
                    <span>Appointments</span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="doctor-patients-error">
                  <FaXmark /> {error}
                </p>
              )}

              {!loading && !error && patients.length > 0 && (
                <div className="doctor-patients-results">
                  <p className="doctor-patients-results-count">
                    Showing <strong>{patients.length}</strong>{" "}
                    {patients.length === 1 ? "patient" : "patients"}
                  </p>
                </div>
              )}

              {loading && (
                <div className="doctor-patients-loading">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="doctor-patient-skeleton" style={{ opacity: 1 - i * 0.12 }} />
                  ))}
                </div>
              )}

              {!loading && !error && (
                <div className="doctor-patients-grid">
                  {patients.length === 0 ? (
                    <div className="doctor-patients-empty">
                      <div className="doctor-patients-empty-icon">
                        <FaUserGroup />
                      </div>
                      <h3>No patients yet</h3>
                      <p>
                        Patients who have booked appointments with you will
                        appear here.
                      </p>
                    </div>
                  ) : (
                    patients.map((patient) => (
                      <PatientCard key={patient.patient_user_id} patient={patient} />
                    ))
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function PatientCard({ patient }) {
  return (
    <article className="doctor-patient-card">
      <div className="doctor-patient-card-body">
        <div className="doctor-patient-card-top">
          <div className="doctor-patient-icon">
            <FaUserGroup />
          </div>
          <div className="doctor-patient-appt-pill">
            <FaCalendarCheck />
            {patient.appointments_count || 0}{" "}
            {patient.appointments_count === 1 ? "appt" : "appts"}
          </div>
        </div>

        <h3>
          {patient.first_name} {patient.last_name}
        </h3>

        <p className="doctor-patient-email">
          <FaEnvelope />
          {patient.email}
        </p>

        <div className="doctor-patient-chips">
          {patient.phone ? (
            <span className="doctor-patient-chip">
              <FaPhone />
              {patient.phone}
            </span>
          ) : (
            <span className="doctor-patient-chip">No phone on file</span>
          )}
        </div>
      </div>

      <div className="doctor-patient-card-footer">
        <Link
          to={`/doctor/patients/${patient.patient_user_id}`}
          className="doctor-patient-open-btn"
        >
          Open Patient <FaArrowRight />
        </Link>
      </div>
    </article>
  );
}

export default DoctorPatients;