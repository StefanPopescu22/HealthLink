import {
  FaArrowRight,
  FaBrain,
  FaHeartPulse,
  FaShieldHeart,
  
  FaStethoscope,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/Specialties.css";

function Specialties() {
  const specialties = [
    {
      icon: <FaHeartPulse />,
      title: "Cardiology",
      text: "Heart-related consultations, preventive monitoring and long-term cardiovascular care.",
    },
    
    {
      icon: <FaBrain />,
      title: "Neurology",
      text: "Consultations for headaches, dizziness and neurological symptom review.",
    },
    {
      icon: <FaStethoscope />,
      title: "Internal Medicine",
      text: "Broad medical evaluation and guidance for complex or general symptoms.",
    },
  ];

  return (
    <>
      <main className="specialties-page">
        <div className="page-container">
          <section className="specialties-hero">
            <div className="specialties-badge">
              <FaShieldHeart />
              <span>Guided specialty discovery</span>
            </div>

            <h1 className="specialties-title">
              Browse medical <span className="gradient-text">specialties</span>
            </h1>

            <p className="specialties-subtitle">
              Understand the main areas of medical care and identify which specialty
              may be relevant for your symptoms or appointment needs.
            </p>
          </section>

          <section className="specialties-grid">
            {specialties.map((item, index) => (
              <article className="soft-card specialty-card" key={index}>
                <div className="specialty-icon-box">{item.icon}</div>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
                <button className="secondary-btn specialty-btn">
                  Learn More
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

export default Specialties;