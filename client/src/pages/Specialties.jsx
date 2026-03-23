import {
  FaArrowRight,
  FaBrain,
  FaHeartPulse,
  FaShieldHeart,
  FaStethoscope,
  FaBaby,
  FaBone,
  FaEye,
  FaBacteria,
  FaLungs,
  FaVenus,
  FaCapsules,
  FaEarDeaf,
  FaHandHoldingMedical,
  FaKitMedical,
  FaVial
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/Specialties.css";

function Specialties() {
  const specialties = [
    {
      icon: <FaHeartPulse />,
      title: "Cardiology",
      text: "Comprehensive heart care, including hypertension management and cardiovascular screening.",
    },
    {
      icon: <FaBrain />,
      title: "Neurology",
      text: "Expert diagnosis for disorders of the nervous system, migraines, and cognitive health.",
    },
    {
      icon: <FaStethoscope />,
      title: "Internal Medicine",
      text: "Prevention, diagnosis, and treatment of adult diseases with a holistic approach.",
    },
    {
      icon: <FaBaby />,
      title: "Pediatrics",
      text: "Dedicated medical care for infants, children, and adolescents in a friendly environment.",
    },
    {
      icon: <FaVenus />,
      title: "Gynecology",
      text: "Specialized care for women's reproductive health and prenatal monitoring.",
    },
    {
      icon: <FaBone />,
      title: "Orthopedics",
      text: "Treatment for bone fractures, joint pain, and sports-related injuries.",
    },
    {
      icon: <FaBacteria />,
      title: "Dermatology",
      text: "Advanced treatment for skin, hair, and nail conditions, including skin cancer checks.",
    },
    {
      icon: <FaLungs />,
      title: "Pulmonology",
      text: "Specialized care for respiratory conditions, asthma, and chronic lung diseases.",
    },
    {
      icon: <FaEye />,
      title: "Ophthalmology",
      text: "Vision correction, cataract surgery, and comprehensive eye health exams.",
    },
    {
      icon: <FaCapsules />,
      title: "Psychiatry",
      text: "Support and treatment for mental health, anxiety, and emotional well-being.",
    },
    {
      icon: <FaEarDeaf />,
      title: "ENT (Otolaryngology)",
      text: "Diagnosis and treatment of ear, nose, throat, and head and neck disorders.",
    },
    {
      icon: <FaHandHoldingMedical />,
      title: "Endocrinology",
      text: "Management of hormonal imbalances, thyroid issues, and diabetes care.",
    },
    {
      icon: <FaVial />,
      title: "Urology",
      text: "Specialized care for urinary tract systems and male reproductive health.",
    },
   
    {
      icon: <FaKitMedical />,
      title: "General Surgery",
      text: "Surgical consultations and post-operative care for various medical conditions.",
    },
    {
      icon: <FaShieldHeart />,
      title: "Oncology",
      text: "Comprehensive cancer diagnosis, treatment planning, and supportive care.",
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
              Explore our diverse range of medical expertise. Select a specialty to 
              view available doctors and book your next consultation.
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