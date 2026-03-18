import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaFilter,
  FaHospital,
  FaLocationDot,
  FaMagnifyingGlass,
  FaShieldHeart,
  FaStar,
  FaStethoscope,
  FaUserDoctor,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/Clinics.css";

function Clinics() {
  const clinics = [
    {
      name: "MedFuture Clinic",
      specialty: "Cardiology · Internal Medicine · Diagnostics",
      city: "Bucharest",
      rating: "4.9",
      doctors: "24 doctors",
      description:
        "Modern multidisciplinary clinic focused on preventive care, diagnostics and specialist consultations.",
    },
    {
      name: "LifeCare Medical Hub",
      specialty: "Dermatology · Endocrinology · Laboratory",
      city: "Sibiu",
      rating: "4.8",
      doctors: "18 doctors",
      description:
        "Integrated healthcare center offering rapid appointments, medical analyses and digital records.",
    },
    {
      name: "Nova Health Center",
      specialty: "Pediatrics · Neurology · General Medicine",
      city: "Cluj-Napoca",
      rating: "4.7",
      doctors: "16 doctors",
      description:
        "Patient-focused medical center with a strong emphasis on coordinated care and clear communication.",
    },
    {
      name: "Urban Care Clinic",
      specialty: "Orthopedics · Imaging · Recovery",
      city: "Timișoara",
      rating: "4.8",
      doctors: "21 doctors",
      description:
        "Contemporary clinic designed for efficient booking, specialist coordination and document management.",
    },
    {
      name: "Prime Diagnostic House",
      specialty: "Radiology · Cardiology · Internal Medicine",
      city: "Brașov",
      rating: "4.6",
      doctors: "14 doctors",
      description:
        "Reliable healthcare provider offering advanced diagnostic services and specialty consultations.",
    },
    {
      name: "Harmony Medical Point",
      specialty: "Dermatology · Gynecology · Nutrition",
      city: "Oradea",
      rating: "4.9",
      doctors: "12 doctors",
      description:
        "Well-rated private clinic with a modern digital workflow and patient-centered medical services.",
    },
  ];

  const filters = [
    "All Clinics",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Diagnostics",
    "Dental",
  ];

  return (
    <>
      <main className="clinics-page">
        <div className="page-container">
          <section className="clinics-hero">
            <div className="clinics-hero-content">
              <div className="clinics-badge">
                <FaShieldHeart />
                <span>Trusted healthcare discovery</span>
              </div>

              <h1 className="clinics-title">
                Find the right <span className="gradient-text">clinic for your needs</span>
              </h1>

              <p className="clinics-subtitle">
                Explore modern healthcare providers by city, specialty and rating.
                Compare medical services, discover doctors and schedule care with confidence.
              </p>
            </div>

            <div className="clinics-search-card soft-card">
              <div className="clinics-search-top">
                <h3>Search Medical Providers</h3>
                <p>Use filters to narrow your healthcare options.</p>
              </div>

              <div className="clinics-search-grid">
                <div className="clinics-input">
                  <FaMagnifyingGlass />
                  <input type="text" placeholder="Search clinic name" />
                </div>

                <div className="clinics-input">
                  <FaLocationDot />
                  <input type="text" placeholder="Choose city" />
                </div>

                <div className="clinics-select">
                  <FaStethoscope />
                  <select>
                    <option>All specialties</option>
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                    <option>Neurology</option>
                    <option>Pediatrics</option>
                  </select>
                </div>
              </div>

              <button className="primary-btn clinics-search-btn">
                Search Clinics
                <FaArrowRight />
              </button>
            </div>
          </section>

          <section className="clinics-filter-row">
            {filters.map((filter, index) => (
              <button key={index} className={`clinics-filter-pill ${index === 0 ? "active" : ""}`}>
                <FaFilter />
                <span>{filter}</span>
              </button>
            ))}
          </section>

          <section className="clinics-grid">
            {clinics.map((clinic, index) => (
              <article className="soft-card clinic-card" key={index}>
                <div className="clinic-card-top">
                  <div className="clinic-card-icon">
                    <FaHospital />
                  </div>

                  <div className="clinic-rating">
                    <FaStar />
                    <span>{clinic.rating}</span>
                  </div>
                </div>

                <h2>{clinic.name}</h2>
                <p className="clinic-specialty">{clinic.specialty}</p>
                <p className="clinic-description">{clinic.description}</p>

                <div className="clinic-meta">
                  <span>
                    <FaLocationDot />
                    {clinic.city}
                  </span>
                  <span>
                    <FaUserDoctor />
                    {clinic.doctors}
                  </span>
                </div>

                <div className="clinic-actions">
                  <Link to="/clinic-profile" className="secondary-btn">
                    View Profile
                  </Link>
                  <Link to="/dashboard-patient" className="primary-btn clinic-book-btn">
                    <FaCalendarCheck />
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

export default Clinics;