import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserGroup, FaUserDoctor } from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/DoctorPatients.css";

function DoctorPatients() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await api.get("/doctor/patients");
        setData(response.data);
      } catch (err) {
        setError("Failed to load patients.");
      }
    };

    loadPatients();
  }, []);

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="doctor-patients-page">
              <div className="doctor-patients-header soft-card">
                <h1>My Patients</h1>
                <p>Patients linked to your real appointments.</p>
              </div>

              {!data && <p>{error || "Loading patients..."}</p>}

              {data && (
                <div className="doctor-patients-grid">
                  {data.patients.length === 0 && <p>No patients available yet.</p>}

                  {data.patients.map((patient) => (
                    <article className="soft-card doctor-patient-card" key={patient.patient_user_id}>
                      <div className="doctor-patient-icon">
                        <FaUserGroup />
                      </div>

                      <h3>{patient.first_name} {patient.last_name}</h3>
                      <p>{patient.email}</p>
                      <span>{patient.phone || "No phone available"}</span>
                      <span>{patient.appointments_count} appointments</span>

                      <Link
                        to={`/doctor/patients/${patient.patient_user_id}`}
                        className="primary-btn"
                      >
                        Open Patient
                      </Link>
                    </article>
                  ))}
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

export default DoctorPatients;