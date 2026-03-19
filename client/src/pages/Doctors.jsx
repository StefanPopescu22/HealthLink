import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaMagnifyingGlass,
  FaShieldHeart,
  FaStar,
  FaStethoscope,
  FaUserDoctor,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/Doctors.css";

function Doctors() {
  const doctors = [
    {
      name: "Dr. Elena Popescu",
      specialty: "Cardiology",
      clinic: "MedFuture Clinic",
      experience: "12 years experience",
      rating: "4.9",
      description:
        "Focused on preventive cardiology, digital follow-up and long-term heart health management.",
    },
    {
      name: "Dr. Andrei Marinescu",
      specialty: "Internal Medicine",
      clinic: "Prime Diagnostic House",
      experience: "9 years experience",
      rating: "4.8",
      description:
        "Supports patients through structured consultations, diagnostics and coordinated treatment guidance.",
    },
    {
      name: "Dr. Ioana Petrescu",
      specialty: "Dermatology",
      clinic: "LifeCare Medical Hub",
      experience: "10 years experience",
      rating: "4.9",
      description:
        "Specialized in modern dermatology care, symptom evaluation and patient-centered communication.",
    },
    {
      name: "Dr. Victor Stan",
      specialty: "Neurology",
      clinic: "Urban Care Clinic",
      experience: "11 years experience",
      rating: "4.7",
      description:
        "Experienced in headache, dizziness and neurological symptom assessment with a calm, clear approach.",
    },
  ];

  return (
    <>
      <main className="doctors-page">
        <div className="page-container">
          <section className="doctors-hero">
            <div className="doctors-hero-content">
              <div className="doctors-badge">
                <FaShieldHeart />
                <span>Verified specialists</span>
              </div>

              <h1 className="doctors-title">
                Discover the right <span className="gradient-text">medical specialist</span>
              </h1>

              <p className="doctors-subtitle">
                Explore doctor profiles, specialties, clinic affiliations and patient
                ratings to make more confident healthcare choices.
              </p>
            </div>

            <div className="doctors-search-card soft-card">
              <div className="doctors-search-box">
                <FaMagnifyingGlass />
                <input type="text" placeholder="Search doctor or specialty" />
              </div>

              <div className="doctors-search-box">
                <FaStethoscope />
                <input type="text" placeholder="Filter by specialty" />
              </div>

              <button className="primary-btn doctors-search-btn">
                Search Doctors
                <FaArrowRight />
              </button>
            </div>
          </section>

          <section className="doctors-grid">
            {doctors.map((doctor, index) => (
              <article className="soft-card doctor-card-public" key={index}>
                <div className="doctor-card-top">
                  <div className="doctor-card-avatar">
                    <FaUserDoctor />
                  </div>

                  <div className="doctor-card-rating">
                    <FaStar />
                    <span>{doctor.rating}</span>
                  </div>
                </div>

                <h2>{doctor.name}</h2>
                <p className="doctor-card-specialty">{doctor.specialty}</p>
                <p className="doctor-card-clinic">{doctor.clinic}</p>
                <p className="doctor-card-description">{doctor.description}</p>

                <div className="doctor-card-meta">
                  <span>{doctor.experience}</span>
                </div>

                <div className="doctor-card-actions">
                  <Link to="/doctor-profile" className="secondary-btn">
                    View Profile
                  </Link>
                  <Link to="/appointments" className="primary-btn">
                    Book Visit
                  </Link>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Doctors;