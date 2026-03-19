import {
  FaArrowRight,
  FaDownload,
  FaFileLines,
  FaMagnifyingGlass,
  FaShieldHeart,
  FaTrash,
  FaUpload,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/MedicalDocuments.css";

function MedicalDocuments() {
  const documents = [
    {
      title: "Cardiology Prescription",
      category: "Prescription",
      date: "March 10, 2026",
      size: "1.2 MB",
    },
    {
      title: "Hospital Discharge Summary",
      category: "Medical Report",
      date: "February 24, 2026",
      size: "2.6 MB",
    },
    {
      title: "Dermatology Consultation Notes",
      category: "Consultation Document",
      date: "January 18, 2026",
      size: "850 KB",
    },
  ];

  return (
    <>
      <main className="documents-page">
        <div className="page-container">
          <section className="documents-hero">
            <div className="documents-hero-content">
              <div className="documents-badge">
                <FaShieldHeart />
                <span>Protected medical file storage</span>
              </div>

              <h1 className="documents-title">
                Your <span className="gradient-text">medical documents</span>
              </h1>

              <p className="documents-subtitle">
                Organize reports, prescriptions and consultation files in one secure
                digital repository designed for fast access and structured management.
              </p>
            </div>

            <div className="documents-side-card soft-card">
              <div className="documents-search-box">
                <FaMagnifyingGlass />
                <input type="text" placeholder="Search documents" />
              </div>

              <button className="primary-btn documents-upload-btn">
                <FaUpload />
                Upload Document
              </button>
            </div>
          </section>

          <section className="documents-grid">
            {documents.map((doc, index) => (
              <article className="soft-card document-card" key={index}>
                <div className="document-icon-box">
                  <FaFileLines />
                </div>

                <div className="document-content">
                  <h2>{doc.title}</h2>
                  <p>{doc.category}</p>

                  <div className="document-meta">
                    <span>{doc.date}</span>
                    <span>{doc.size}</span>
                  </div>
                </div>

                <div className="document-actions">
                  <button className="secondary-btn">
                    <FaDownload />
                    Download
                  </button>
                  <button className="secondary-btn danger-btn">
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="documents-cta soft-card">
            <div>
              <h2>Need structured healthcare storage?</h2>
              <p>
                Keep prescriptions, medical summaries and consultation files available
                for future visits and doctor communication.
              </p>
            </div>

            <button className="primary-btn">
              Upload New File
              <FaArrowRight />
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default MedicalDocuments;