import {
  FaArrowRight,
  FaClock,
  FaFilter,
  FaShieldHeart,
  FaStethoscope,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/Services.css";

function Services() {
  const services = [
    {
      title: "Cardiology Consultation",
      category: "Specialist Consultation",
      duration: "30 min",
      description:
        "Evaluation of cardiovascular symptoms, preventive guidance and follow-up planning.",
    },
    {
      title: "Dermatology Evaluation",
      category: "Skin Health",
      duration: "25 min",
      description:
        "Assessment of rashes, irritation, skin changes and specialist treatment guidance.",
    },
    {
      title: "Internal Medicine Visit",
      category: "General Medical Review",
      duration: "35 min",
      description:
        "Broad consultation covering symptoms, diagnostic direction and next-step recommendations.",
    },
    {
      title: "Neurology Consultation",
      category: "Specialist Consultation",
      duration: "40 min",
      description:
        "Assessment of headaches, dizziness, neurological symptoms and referral decisions.",
    },
    {
      title: "Laboratory Analysis Package",
      category: "Diagnostics",
      duration: "20 min",
      description:
        "Structured collection flow for common blood and biochemistry analysis packages.",
    },
    {
      title: "Preventive Check-up",
      category: "Screening",
      duration: "45 min",
      description:
        "Routine health screening to support early detection and general health monitoring.",
    },
  ];

  return (
    <>
      <main className="services-page">
        <div className="page-container">
          <section className="services-hero">
            <div className="services-hero-content">
              <div className="services-badge">
                <FaShieldHeart />
                <span>Structured medical services</span>
              </div>

              <h1 className="services-title">
                Explore available <span className="gradient-text">medical services</span>
              </h1>

              <p className="services-subtitle">
                Review healthcare services by specialty, visit type and estimated duration
                through a modern and patient-friendly interface.
              </p>
            </div>
          </section>

          <section className="services-filter-row">
            <button className="services-filter active">
              <FaFilter />
              <span>All Services</span>
            </button>
            <button className="services-filter">Consultations</button>
            <button className="services-filter">Diagnostics</button>
            <button className="services-filter">Screening</button>
          </section>

          <section className="services-grid">
            {services.map((service, index) => (
              <article className="soft-card service-card" key={index}>
                <div className="service-icon-box">
                  <FaStethoscope />
                </div>

                <h2>{service.title}</h2>
                <p className="service-category">{service.category}</p>
                <p className="service-description">{service.description}</p>

                <div className="service-meta">
                  <span>
                    <FaClock />
                    {service.duration}
                  </span>
                </div>

                <button className="primary-btn service-btn">
                  Select Service
                  <FaArrowRight />
                </button>
              </article>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Services;