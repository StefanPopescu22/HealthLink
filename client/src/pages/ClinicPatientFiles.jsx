import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/ClinicPatientFiles.css";

function ClinicPatientFiles() {
  const { patientUserId } = useParams();

  const [data, setData] = useState(null);

  const [documentForm, setDocumentForm] = useState({
    title: "",
    category: "",
    file: null,
  });

  const [analysisForm, setAnalysisForm] = useState({
    title: "",
    analysisType: "",
    labName: "",
    resultStatus: "",
    file: null,
  });

  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [editingDocumentForm, setEditingDocumentForm] = useState({
    title: "",
    category: "",
    file: null,
  });

  const [editingAnalysisId, setEditingAnalysisId] = useState(null);
  const [editingAnalysisForm, setEditingAnalysisForm] = useState({
    title: "",
    analysisType: "",
    labName: "",
    resultStatus: "",
    file: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFiles = async () => {
    try {
      const response = await api.get(`/clinic/patients/${patientUserId}/files`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patient files.");
    }
  };

  useEffect(() => {
    loadFiles();
  }, [patientUserId]);

  const uploadDocument = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!documentForm.title || !documentForm.file) {
      setError("Document title and file are required.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("patientUserId", patientUserId);
      payload.append("title", documentForm.title);
      payload.append("category", documentForm.category);
      payload.append("file", documentForm.file);

      const response = await api.post("/documents/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(response.data.message || "Document uploaded.");
      setDocumentForm({
        title: "",
        category: "",
        file: null,
      });

      await loadFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document.");
    }
  };

  const uploadAnalysis = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!analysisForm.title || !analysisForm.file) {
      setError("Analysis title and file are required.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("patientUserId", patientUserId);
      payload.append("title", analysisForm.title);
      payload.append("analysisType", analysisForm.analysisType);
      payload.append("labName", analysisForm.labName);
      payload.append("resultStatus", analysisForm.resultStatus);
      payload.append("file", analysisForm.file);

      const response = await api.post("/analyses/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(response.data.message || "Analysis uploaded.");
      setAnalysisForm({
        title: "",
        analysisType: "",
        labName: "",
        resultStatus: "",
        file: null,
      });

      await loadFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload analysis.");
    }
  };

  const startEditDocument = (doc) => {
    setEditingDocumentId(doc.id);
    setEditingDocumentForm({
      title: doc.title || "",
      category: doc.category || "",
      file: null,
    });
  };

  const saveEditedDocument = async (documentId) => {
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();
      payload.append("title", editingDocumentForm.title);
      payload.append("category", editingDocumentForm.category);

      if (editingDocumentForm.file) {
        payload.append("file", editingDocumentForm.file);
      }

      const response = await api.put(`/documents/${documentId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(response.data.message || "Document updated successfully.");
      setEditingDocumentId(null);
      await loadFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update document.");
    }
  };

  const startEditAnalysis = (analysis) => {
    setEditingAnalysisId(analysis.id);
    setEditingAnalysisForm({
      title: analysis.title || "",
      analysisType: analysis.analysis_type || "",
      labName: analysis.lab_name || "",
      resultStatus: analysis.result_status || "",
      file: null,
    });
  };

  const saveEditedAnalysis = async (analysisId) => {
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();
      payload.append("title", editingAnalysisForm.title);
      payload.append("analysisType", editingAnalysisForm.analysisType);
      payload.append("labName", editingAnalysisForm.labName);
      payload.append("resultStatus", editingAnalysisForm.resultStatus);

      if (editingAnalysisForm.file) {
        payload.append("file", editingAnalysisForm.file);
      }

      const response = await api.put(`/analyses/${analysisId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(response.data.message || "Analysis updated successfully.");
      setEditingAnalysisId(null);
      await loadFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update analysis.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="clinic-patient-files-page">
              {!data && <p>{error || "Loading patient files..."}</p>}

              {data && (
                <>
                  <div className="soft-card clinic-patient-files-header">
                    <h1>{data.patient.first_name} {data.patient.last_name}</h1>
                    <p>{data.patient.email}</p>
                  </div>

                  <div className="clinic-patient-upload-grid">
                    <form className="soft-card clinic-patient-files-card" onSubmit={uploadDocument}>
                      <h2>Upload Document</h2>
                      <input
                        value={documentForm.title}
                        onChange={(e) => setDocumentForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Document title"
                      />
                      <input
                        value={documentForm.category}
                        onChange={(e) => setDocumentForm((prev) => ({ ...prev, category: e.target.value }))}
                        placeholder="Category"
                      />
                      <input
                        type="file"
                        onChange={(e) => setDocumentForm((prev) => ({ ...prev, file: e.target.files[0] || null }))}
                      />
                      <button type="submit" className="primary-btn">Upload Document</button>
                    </form>

                    <form className="soft-card clinic-patient-files-card" onSubmit={uploadAnalysis}>
                      <h2>Upload Analysis</h2>
                      <input
                        value={analysisForm.title}
                        onChange={(e) => setAnalysisForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Analysis title"
                      />
                      <input
                        value={analysisForm.analysisType}
                        onChange={(e) => setAnalysisForm((prev) => ({ ...prev, analysisType: e.target.value }))}
                        placeholder="Analysis type"
                      />
                      <input
                        value={analysisForm.labName}
                        onChange={(e) => setAnalysisForm((prev) => ({ ...prev, labName: e.target.value }))}
                        placeholder="Lab name"
                      />
                      <input
                        value={analysisForm.resultStatus}
                        onChange={(e) => setAnalysisForm((prev) => ({ ...prev, resultStatus: e.target.value }))}
                        placeholder="Result status"
                      />
                      <input
                        type="file"
                        onChange={(e) => setAnalysisForm((prev) => ({ ...prev, file: e.target.files[0] || null }))}
                      />
                      <button type="submit" className="primary-btn">Upload Analysis</button>
                    </form>
                  </div>

                  {error && <p className="clinic-patient-files-message error">{error}</p>}
                  {success && <p className="clinic-patient-files-message success">{success}</p>}

                  <div className="clinic-patient-files-grid">
                    <article className="soft-card clinic-patient-files-card">
                      <h2>Documents for This Patient</h2>

                      <div className="clinic-patient-files-list">
                        {data.documents.length === 0 && <p>No documents available.</p>}

                        {data.documents.map((doc) => (
                          <div className="clinic-patient-file-item" key={doc.id}>
                            {editingDocumentId === doc.id ? (
                              <div className="clinic-patient-file-edit-form">
                                <input
                                  value={editingDocumentForm.title}
                                  onChange={(e) =>
                                    setEditingDocumentForm((prev) => ({ ...prev, title: e.target.value }))
                                  }
                                  placeholder="Document title"
                                />
                                <input
                                  value={editingDocumentForm.category}
                                  onChange={(e) =>
                                    setEditingDocumentForm((prev) => ({ ...prev, category: e.target.value }))
                                  }
                                  placeholder="Category"
                                />
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    setEditingDocumentForm((prev) => ({ ...prev, file: e.target.files[0] || null }))
                                  }
                                />
                                <button className="primary-btn" onClick={() => saveEditedDocument(doc.id)}>
                                  Save Document
                                </button>
                              </div>
                            ) : (
                              <>
                                <h3>{doc.title}</h3>
                                <p>{doc.category || "No category"}</p>
                                <p>
                                  Uploaded by:{" "}
                                  {doc.created_by_first_name
                                    ? `${doc.created_by_first_name} ${doc.created_by_last_name} (${doc.created_by_role})`
                                    : "Unknown"}
                                </p>
                                <a href={`http://localhost:5000${doc.file_path}`} target="_blank" rel="noreferrer">
                                  Open document
                                </a>
                                <button className="secondary-btn" onClick={() => startEditDocument(doc)}>
                                  Edit Document
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="soft-card clinic-patient-files-card">
                      <h2>Analyses for This Patient</h2>

                      <div className="clinic-patient-files-list">
                        {data.analyses.length === 0 && <p>No analyses available.</p>}

                        {data.analyses.map((analysis) => (
                          <div className="clinic-patient-file-item" key={analysis.id}>
                            {editingAnalysisId === analysis.id ? (
                              <div className="clinic-patient-file-edit-form">
                                <input
                                  value={editingAnalysisForm.title}
                                  onChange={(e) =>
                                    setEditingAnalysisForm((prev) => ({ ...prev, title: e.target.value }))
                                  }
                                  placeholder="Analysis title"
                                />
                                <input
                                  value={editingAnalysisForm.analysisType}
                                  onChange={(e) =>
                                    setEditingAnalysisForm((prev) => ({ ...prev, analysisType: e.target.value }))
                                  }
                                  placeholder="Analysis type"
                                />
                                <input
                                  value={editingAnalysisForm.labName}
                                  onChange={(e) =>
                                    setEditingAnalysisForm((prev) => ({ ...prev, labName: e.target.value }))
                                  }
                                  placeholder="Lab name"
                                />
                                <input
                                  value={editingAnalysisForm.resultStatus}
                                  onChange={(e) =>
                                    setEditingAnalysisForm((prev) => ({ ...prev, resultStatus: e.target.value }))
                                  }
                                  placeholder="Result status"
                                />
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    setEditingAnalysisForm((prev) => ({ ...prev, file: e.target.files[0] || null }))
                                  }
                                />
                                <button className="primary-btn" onClick={() => saveEditedAnalysis(analysis.id)}>
                                  Save Analysis
                                </button>
                              </div>
                            ) : (
                              <>
                                <h3>{analysis.title}</h3>
                                <p>{analysis.analysis_type || "No analysis type"}</p>
                                <p>{analysis.result_status || "No result status"}</p>
                                <p>
                                  Uploaded by:{" "}
                                  {analysis.created_by_first_name
                                    ? `${analysis.created_by_first_name} ${analysis.created_by_last_name} (${analysis.created_by_role})`
                                    : "Unknown"}
                                </p>
                                <a href={`http://localhost:5000${analysis.file_path}`} target="_blank" rel="noreferrer">
                                  Open analysis
                                </a>
                                <button className="secondary-btn" onClick={() => startEditAnalysis(analysis)}>
                                  Edit Analysis
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </article>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ClinicPatientFiles;