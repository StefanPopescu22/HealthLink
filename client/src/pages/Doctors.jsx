import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaMagnifyingGlass,
  FaShieldHeart,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Doctors.css";

function Doctors() {
  const [searchParams] = useSearchParams();

  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    specialty: "",
    clinicId: "",
    specialtyId: searchParams.get("specialtyId") || "",
    serviceId: searchParams.get("serviceId") || "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDoctors = async (currentFilters = filters) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/public/doctors", { params: currentFilters });
      setDoctors(response.data);
    } catch {
      setError("Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors({
      ...filters,
      specialtyId: searchParams.get("specialtyId") || "",
      serviceId: searchParams.get("serviceId") || "",
    });

    const loadClinics = async () => {
      try {
        const response = await api.get("/public/clinics");
        setClinics(response.data);
      } catch {
        // ignore quietly
      }
    };

    loadClinics();
  }, [searchParams]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadDoctors(filters);
  };

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
                Doctors can be filtered directly from specialties and services pages.
              </p>
            </div>
          </section>

          <form className="doctors-search-toolbar soft-card" onSubmit={handleSearch}>
            <div className="doctors-search-box">
              <FaMagnifyingGlass />
              <input
                type="text"
                name="q"
                placeholder="Doctor name or clinic"
                value={filters.q}
                onChange={handleFilterChange}
              />
            </div>

            <input
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              placeholder="Specialty"
              className="doctor-filter-input"
            />

            <select
              name="clinicId"
              value={filters.clinicId}
              onChange={handleFilterChange}
              className="doctor-filter-input"
            >
              <option value="">All clinics</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>

            <button type="submit" className="primary-btn doctors-search-btn">
              Search
            </button>
          </form>

          {loading && <p>Loading doctors...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <section className="doctors-grid">
              {doctors.map((doctor) => (
                <article className="soft-card doctor-card-public" key={doctor.id}>
                  <div className="doctor-card-top">
                    <div className="doctor-card-avatar">
                      <FaUserDoctor />
                    </div>

                    <div className="doctor-card-rating">
                      <FaStar />
                      <span>{doctor.rating || "0.0"}</span>
                    </div>
                  </div>

                  <h2>{doctor.first_name} {doctor.last_name}</h2>
                  <p className="doctor-card-specialty">
                    {doctor.specialties || "No specialties assigned"}
                  </p>
                  <p className="doctor-card-clinic">{doctor.clinic_name}</p>
                  <p className="doctor-card-description">
                    {doctor.description || "No description available."}
                  </p>

                  <div className="doctor-card-meta">
                    <span>{doctor.experience_years || 0} years experience</span>
                  </div>

                  <div className="doctor-card-actions">
                    <Link to={`/doctors/${doctor.id}`} className="secondary-btn">
                      View Profile
                    </Link>
                    <Link to="/appointments" className="primary-btn">
                      Book Visit
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Doctors;