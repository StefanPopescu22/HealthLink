import {
  FaArrowRight,
  FaDownload,
  FaFileMedical,
  FaMagnifyingGlass,
  FaNotesMedical,
  FaShieldHeart,
  FaUpload,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/MedicalAnalyses.css";
import DashboardSidebar from "../components/DashboardSidebar";

function MedicalAnalyses() {
  const analyses = [
    {
      title: "Complete Blood Count",
      type: "Laboratory Analysis",
      date: "March 12, 2026",
      result: "Reviewed",
    },
    {
      title: "Liver Function Panel",
      type: "Biochemistry",
      date: "February 20, 2026",
      result: "Available",
    },
    {
      title: "Vitamin D Test",
      type: "Hormonal Analysis",
      date: "January 14, 2026",
      result: "Reviewed",
    },
  ];

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
             <div className="page-container">
          <section className="analyses-hero">
            <div className="analyses-hero-content">
              <div className="analyses-badge">
                <FaShieldHeart />
                <span>Smart analysis management</span>
              </div>

              <h1 className="analyses-title">
                Access your <span className="gradient-text">medical analyses</span>
              </h1>

              <p className="analyses-subtitle">
                Review laboratory results, keep analysis history organized and maintain a
                clean digital archive for better communication with healthcare providers.
              </p>
            </div>

            <div className="analyses-side-card soft-card">
              <div className="analyses-search-box">
                <FaMagnifyingGlass />
                <input type="text" placeholder="Search analyses" />
              </div>

              <button className="primary-btn analyses-upload-btn">
                <FaUpload />
                Upload Analysis
              </button>
            </div>
          </section>

          <section className="analyses-grid">
            {analyses.map((item, index) => (
              <article className="soft-card analysis-card" key={index}>
                <div className="analysis-icon-box">
                  <FaNotesMedical />
                </div>

                <div className="analysis-content">
                  <h2>{item.title}</h2>
                  <p>{item.type}</p>

                  <div className="analysis-meta">
                    <span>{item.date}</span>
                    <span className={`analysis-result ${item.result.toLowerCase()}`}>
                      {item.result}
                    </span>
                  </div>
                </div>

                <button className="secondary-btn">
                  <FaDownload />
                  Download
                </button>
              </article>
            ))}
          </section>

          <section className="analyses-summary">
            <article className="soft-card analyses-summary-card">
              <div className="analysis-summary-icon">
                <FaFileMedical />
              </div>
              <h3>18 Total Analyses</h3>
              <p>Stored in your digital healthcare archive.</p>
            </article>

            <article className="soft-card analyses-summary-card">
              <div className="analysis-summary-icon">
                <FaNotesMedical />
              </div>
              <h3>6 Recent Uploads</h3>
              <p>Added in the last 60 days.</p>
            </article>
          </section>

          <section className="analyses-cta soft-card">
            <div>
              <h2>Keep your medical history complete</h2>
              <p>
                Upload new laboratory analyses and make them accessible for future
                consultations and digital medical workflows.
              </p>
            </div>

            <button className="primary-btn">
              Add New Analysis
              <FaArrowRight />
            </button>
          </section>
        </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default MedicalAnalyses;