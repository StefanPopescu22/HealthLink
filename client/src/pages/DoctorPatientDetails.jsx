import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/DoctorPatientDetails.css";

function DoctorPatientDetails() {
  const { patientUserId } = useParams();

  const [data, setData] = useState(null);

  const [noteForm, setNoteForm] = useState({
    appointmentId: "",
    noteText: "",
    recommendationText: "",
  });

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

  const loadPatientDetails = async () => {
    try {
      const response = await api.get(`/doctor/patients/${patientUserId}`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patient details.");
    }
  };

  useEffect(() => {
    loadPatientDetails();
  }, [patientUserId]);

  const handleNoteChange = (e) => {
    setNoteForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post(`/doctor/patients/${patientUserId}/notes`, noteForm);
      setSuccess(response.data.message || "Medical note added.");
      setNoteForm({
        appointmentId: "",
        noteText: "",
        recommendationText: "",
      });
      await loadPatientDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add medical note.");
    }
  };

  const handleDocumentFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setDocumentForm((prev) => ({
        ...prev,
        file: files?.[0] || null,
      }));
      return;
    }

    setDocumentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadDocument = async (e) => {
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

      setSuccess(response.data.message || "Document uploaded successfully.");
      setDocumentForm({
        title: "",
        category: "",
        file: null,
      });

      await loadPatientDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document.");
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

  const handleEditingDocumentChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setEditingDocumentForm((prev) => ({
        ...prev,
        file: files?.[0] || null,
      }));
      return;
    }

    setEditingDocumentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveDocument = async (documentId) => {
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
      await loadPatientDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update document.");
    }
  };

  const handleAnalysisFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setAnalysisForm((prev) => ({
        ...prev,
        file: files?.[0] || null,
      }));
      return;
    }

    setAnalysisForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadAnalysis = async (e) => {
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

      setSuccess(response.data.message || "Analysis uploaded successfully.");
      setAnalysisForm({
        title: "",
        analysisType: "",
        labName: "",
        resultStatus: "",
        file: null,
      });

      await loadPatientDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload analysis.");
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

  const handleEditingAnalysisChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setEditingAnalysisForm((prev) => ({
        ...prev,
        file: files?.[0] || null,
      }));
      return;
    }

    setEditingAnalysisForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAnalysis = async (analysisId) => {
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
      await loadPatientDetails();
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
            <section className="doctor-patient-details-page">
              {!data && <p>{error || "Loading patient details..."}</p>}

              {data && (
                <>
                  <div className="soft-card doctor-patient-details-header">
                    <h1>{data.patient.first_name} {data.patient.last_name}</h1>
                    <p>{data.patient.email}</p>
                  </div>

                  {error && <p className="doctor-note-message error">{error}</p>}
                  {success && <p className="doctor-note-message success">{success}</p>}

                  <div className="doctor-patient-details-grid">
                    <article className="soft-card doctor-patient-section">
                      <h2>Patient Information</h2>
                      <p><strong>Phone:</strong> {data.patient.phone || "Not set"}</p>
                      <p><strong>Date of Birth:</strong> {data.patient.date_of_birth || "Not set"}</p>
                      <p><strong>Gender:</strong> {data.patient.gender || "Not set"}</p>
                      <p><strong>Blood Group:</strong> {data.patient.blood_group || "Not set"}</p>
                      <p><strong>Emergency Contact:</strong> {data.patient.emergency_contact_name || "Not set"}</p>
                      <p><strong>Emergency Phone:</strong> {data.patient.emergency_contact_phone || "Not set"}</p>
                      <p><strong>Medical Notes:</strong> {data.patient.medical_notes || "Not set"}</p>
                      <p>
                        <strong>Allergies:</strong>{" "}
                        {data.allergies.length > 0
                          ? data.allergies.map((a) => a.allergy_name).join(", ")
                          : "No allergies listed"}
                      </p>
                    </article>

                    <article className="soft-card doctor-patient-section">
                      <h2>Add Medical Note</h2>

                      <form className="doctor-note-form" onSubmit={handleAddNote}>
                        <label>Appointment</label>
                        <select
                          name="appointmentId"
                          value={noteForm.appointmentId}
                          onChange={handleNoteChange}
                        >
                          <option value="">Optional appointment link</option>
                          {data.appointments.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.appointment_date} {item.appointment_time} - {item.status}
                            </option>
                          ))}
                        </select>

                        <label>Medical Note</label>
                        <textarea
                          name="noteText"
                          value={noteForm.noteText}
                          onChange={handleNoteChange}
                          placeholder="Write the medical note"
                        />

                        <label>Recommendation</label>
                        <textarea
                          name="recommendationText"
                          value={noteForm.recommendationText}
                          onChange={handleNoteChange}
                          placeholder="Write recommendations"
                        />

                        <button type="submit" className="primary-btn">
                          Save Medical Note
                        </button>
                      </form>
                    </article>
                  </div>

                  <div className="doctor-patient-files-upload-grid">
                    <form className="soft-card doctor-patient-section" onSubmit={handleUploadDocument}>
                      <h2>Upload Document</h2>
                      <input
                        name="title"
                        value={documentForm.title}
                        onChange={handleDocumentFormChange}
                        placeholder="Document title"

                      />
                      
                      <input
                        name="category"
                        value={documentForm.category}
                        onChange={handleDocumentFormChange}
                        placeholder="Category"
                      />
                      <input type="file" name="file" onChange={handleDocumentFormChange} />
                      <button type="submit" className="primary-btn">
                        Upload Document
                      </button>
                    </form>

                    <form className="soft-card doctor-patient-section" onSubmit={handleUploadAnalysis}>
                      <h2>Upload Analysis</h2>
                      <input
                        name="title"
                        value={analysisForm.title}
                        onChange={handleAnalysisFormChange}
                        placeholder="Analysis title"
                      />
                      
                      <input
                        name="analysisType"
                        value={analysisForm.analysisType}
                        onChange={handleAnalysisFormChange}
                        placeholder="Analysis type"
                      />
                      <input
                        name="labName"
                        value={analysisForm.labName}
                        onChange={handleAnalysisFormChange}
                        placeholder="Lab name"
                      />
                      <input
                        name="resultStatus"
                        value={analysisForm.resultStatus}
                        onChange={handleAnalysisFormChange}
                        placeholder="Result status"
                      />
                      <input type="file" name="file" onChange={handleAnalysisFormChange} />
                      <button type="submit" className="primary-btn">
                        Upload Analysis
                      </button>
                    </form>
                  </div>

                  <article className="soft-card doctor-patient-section">
                    <h2>Medical Notes History</h2>

                    <div className="doctor-patient-notes-list">
                      {data.notes.length === 0 && <p>No notes available yet.</p>}

                      {data.notes.map((note) => (
                        <div className="doctor-patient-note-item" key={note.id}>
                          <h3>{note.created_at}</h3>
                          <p><strong>Note:</strong> {note.note_text}</p>
                          <p><strong>Recommendation:</strong> {note.recommendation_text || "No recommendation"}</p>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="soft-card doctor-patient-section">
                    <h2>Patient Documents</h2>

                    <div className="doctor-patient-notes-list">
                      {data.documents.length === 0 && <p>No documents available.</p>}

                      {data.documents.map((doc) => (
                        <div className="doctor-patient-note-item" key={doc.id}>
                          {editingDocumentId === doc.id ? (
                            <div className="doctor-file-edit-form">
                              <input
                                name="title"
                                value={editingDocumentForm.title}
                                onChange={handleEditingDocumentChange}
                                placeholder="Document title"
                              />
                              <input
                                name="category"
                                value={editingDocumentForm.category}
                                onChange={handleEditingDocumentChange}
                                placeholder="Category"
                              />
                              <input
                                type="file"
                                name="file"
                                onChange={handleEditingDocumentChange}
                              />
                              <button className="primary-btn" onClick={() => handleSaveDocument(doc.id)}>
                                Save Document
                              </button>
                            </div>
                          ) : (
                            <>
                              <h3>{doc.title}</h3>
                              <p>{doc.category || "No category"}</p>
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

                  <article className="soft-card doctor-patient-section">
                    <h2>Patient Analyses</h2>

                    <div className="doctor-patient-notes-list">
                      {data.analyses.length === 0 && <p>No analyses available.</p>}

                      {data.analyses.map((analysis) => (
                        <div className="doctor-patient-note-item" key={analysis.id}>
                          {editingAnalysisId === analysis.id ? (
                            <div className="doctor-file-edit-form">
                              <input
                                name="title"
                                value={editingAnalysisForm.title}
                                onChange={handleEditingAnalysisChange}
                                placeholder="Analysis title"
                              />
                              <input
                                name="analysisType"
                                value={editingAnalysisForm.analysisType}
                                onChange={handleEditingAnalysisChange}
                                placeholder="Analysis type"
                              />
                              <input
                                name="labName"
                                value={editingAnalysisForm.labName}
                                onChange={handleEditingAnalysisChange}
                                placeholder="Lab name"
                              />
                              <input
                                name="resultStatus"
                                value={editingAnalysisForm.resultStatus}
                                onChange={handleEditingAnalysisChange}
                                placeholder="Result status"
                              />
                              <input
                                type="file"
                                name="file"
                                onChange={handleEditingAnalysisChange}
                              />
                              <button className="primary-btn" onClick={() => handleSaveAnalysis(analysis.id)}>
                                Save Analysis
                              </button>
                            </div>
                          ) : (
                            <>
                              <h3>{analysis.title}</h3>
                              <p>{analysis.analysis_type || "No analysis type"}</p>
                              <p>{analysis.result_status || "No result status"}</p>
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

export default DoctorPatientDetails;