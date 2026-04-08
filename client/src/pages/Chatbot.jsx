import { useMemo, useState, useRef, useEffect } from "react";
import {
  FaArrowRight,
  FaNotesMedical,
  FaRobot,
  FaShieldHeart,
  FaStethoscope,
  FaUser,
  FaShieldVirus,
  FaPaperPlane,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/Chatbot.css";

const RESPONSES = [
  {
    keywords: ["chest", "heart", "breath", "shortness", "palpitation", "tachycardia", "angina"],
    specialty: "Cardiology",
    message:
      "Your symptoms may be related to the cardiovascular system. Please book a consultation with a Cardiologist as soon as possible. If the chest pain is sudden or severe, seek emergency care immediately.",
  },
  {
    keywords: ["skin", "rash", "itch", "acne", "eczema", "psoriasis", "hives", "spots", "blister", "dermatitis"],
    specialty: "Dermatology",
    message:
      "Your symptoms suggest a possible skin condition. A Dermatologist can examine and diagnose skin disorders. Upload any photos of the affected area before your appointment.",
  },
  {
    keywords: ["head", "headache", "migraine", "dizziness", "vertigo", "numbness", "tingling", "seizure", "tremor", "memory"],
    specialty: "Neurology",
    message:
      "Symptoms involving the head, nervous system or brain should be evaluated by a Neurologist. Track the frequency and triggers of your symptoms before the visit.",
  },
  {
    keywords: ["stomach", "abdomen", "nausea", "vomiting", "diarrhea", "constipation", "bloating", "acid", "reflux", "gastric", "bowel", "colon"],
    specialty: "Gastroenterology",
    message:
      "Digestive or gastrointestinal symptoms should be reviewed by a Gastroenterologist. Avoid self-medicating until you have a proper diagnosis.",
  },
  {
    keywords: ["bone", "joint", "knee", "back", "spine", "muscle", "fracture", "arthritis", "pain", "shoulder", "hip", "ankle", "wrist"],
    specialty: "Orthopedics",
    message:
      "Musculoskeletal symptoms such as joint pain, bone issues or mobility problems are best evaluated by an Orthopedic specialist. Consider an X-ray or MRI if the issue is persistent.",
  },
  {
    keywords: ["eye", "vision", "blurry", "sight", "retina", "cataract", "glaucoma", "conjunctivitis", "dry eyes"],
    specialty: "Ophthalmology",
    message:
      "Visual symptoms or eye discomfort should be assessed by an Ophthalmologist. Do not delay if you experience sudden vision changes or loss.",
  },
  {
    keywords: ["ear", "hearing", "tinnitus", "nose", "throat", "sinus", "snoring", "tonsil", "hoarse", "voice", "swallowing"],
    specialty: "ENT (Ear, Nose & Throat)",
    message:
      "Ear, nose and throat symptoms are handled by an ENT specialist. Chronic sinus issues, hearing changes or throat problems all benefit from early evaluation.",
  },
  {
    keywords: ["urine", "kidney", "bladder", "prostate", "urination", "frequent urination", "blood in urine", "uti", "urinary"],
    specialty: "Urology",
    message:
      "Urinary tract or kidney symptoms should be evaluated by a Urologist. A urine analysis is usually the first step in diagnosis.",
  },
  {
    keywords: ["hormone", "thyroid", "diabetes", "blood sugar", "insulin", "adrenal", "cortisol", "weight gain", "fatigue", "metabolic"],
    specialty: "Endocrinology",
    message:
      "Hormonal and metabolic symptoms — including thyroid disorders and diabetes — are managed by an Endocrinologist. Blood tests are typically required for initial diagnosis.",
  },
  {
    keywords: ["lung", "cough", "asthma", "bronchitis", "pneumonia", "breathing", "wheeze", "phlegm", "tuberculosis", "copd"],
    specialty: "Pulmonology",
    message:
      "Respiratory symptoms such as persistent cough, breathing difficulties or lung issues should be reviewed by a Pulmonologist. Spirometry or a chest X-ray may be ordered.",
  },
  {
    keywords: ["mental", "anxiety", "depression", "stress", "panic", "mood", "sleep", "insomnia", "phobia", "ocd", "trauma", "ptsd"],
    specialty: "Psychiatry / Psychology",
    message:
      "Mental health symptoms like anxiety, depression or mood changes deserve professional attention. A Psychiatrist or Psychologist can provide evaluation and support. You are not alone.",
  },
  {
    keywords: ["blood", "anemia", "clotting", "leukemia", "lymphoma", "bruising", "hemoglobin", "platelet"],
    specialty: "Hematology",
    message:
      "Blood-related symptoms or abnormal blood test results should be reviewed by a Hematologist. A complete blood count (CBC) is usually the first diagnostic step.",
  },
  {
    keywords: ["pregnant", "pregnancy", "menstrual", "period", "ovary", "uterus", "cervix", "gynecology", "fertility", "pcos", "endometriosis"],
    specialty: "Gynecology / Obstetrics",
    message:
      "Reproductive or gynecological concerns should be addressed by a Gynecologist. Regular check-ups are important for early detection of many conditions.",
  },
  {
    keywords: ["child", "baby", "infant", "toddler", "pediatric", "growth", "vaccination", "fever in child"],
    specialty: "Pediatrics",
    message:
      "Health concerns for children and infants are best handled by a Pediatrician, who specializes in childhood development, vaccinations and disease prevention.",
  },
  {
    keywords: ["allergy", "allergic", "pollen", "dust", "food allergy", "intolerance", "sneezing", "watery eyes", "anaphylaxis"],
    specialty: "Allergology / Immunology",
    message:
      "Allergic reactions, sensitivities or immune system concerns are managed by an Allergist or Immunologist. Allergy testing can help pinpoint the exact triggers.",
  },
  {
    keywords: ["cancer", "tumor", "oncology", "chemotherapy", "radiation", "biopsy", "malignant", "benign growth", "lump"],
    specialty: "Oncology",
    message:
      "Any concern involving a suspected tumor or cancer should be urgently evaluated by an Oncologist. Early diagnosis significantly improves treatment outcomes.",
  },
  {
    keywords: ["teeth", "gum", "dental", "tooth", "cavity", "wisdom", "root canal", "dentist", "jaw", "mouth"],
    specialty: "Dentistry / Stomatology",
    message:
      "Dental or oral health concerns are handled by a Dentist or Stomatologist. Regular checkups every 6 months are recommended even without symptoms.",
  },
  {
    keywords: ["nutrition", "diet", "obesity", "weight loss", "overweight", "bmi", "eating", "calories", "malnutrition"],
    specialty: "Nutrition / Dietetics",
    message:
      "Dietary concerns, weight management and nutritional deficiencies are best addressed by a Nutritionist or Dietitian, who can build a personalised plan.",
  },
  {
    keywords: ["rehabilitation", "physiotherapy", "recovery", "exercise", "mobility", "stroke recovery", "physical therapy"],
    specialty: "Physical Therapy / Rehabilitation",
    message:
      "Recovery from injury, surgery or stroke is supported by Physical Therapy. A rehabilitation specialist can design a structured recovery programme.",
  },
];

const FALLBACK = {
  specialty: "General Medicine",
  message:
    "Based on your description, a General Practitioner (GP) is a great first step. They can assess your overall health, order tests and refer you to the right specialist.",
};

function getBotReply(text) {
  const lower = text.toLowerCase();
  const match = RESPONSES.find((r) => r.keywords.some((kw) => lower.includes(kw)));
  const { specialty, message } = match || FALLBACK;
  return `Suggested specialty: ${specialty}.\n\n${message}`;
}

const SUGGESTIONS = [
  "I have chest pain and shortness of breath",
  "My skin is itchy and I have red spots",
  "I have frequent headaches and dizziness",
  "I feel anxious and can't sleep properly",
  "I have stomach pain and bloating",
  "My joints hurt and I have back pain",
  "I need help choosing the right specialist",
];

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello. I am your HealthLink AI Assistant.\n\nDescribe your symptoms in natural language and I will suggest a relevant medical specialty and the recommended next step.\n\nNote: this tool does not provide medical diagnoses — always consult a doctor.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: trimmed },
      { sender: "bot",  text: getBotReply(trimmed) },
    ]);
    setInput("");
  };

  const handleSuggestionClick = (text) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text },
      { sender: "bot",  text: getBotReply(text) },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <main className="chatbot-page">
        <div className="page-container">

          <section className="chatbot-hero">
            <div className="chatbot-hero-content">
              <div className="chatbot-badge">
                <FaShieldHeart />
                <span>Guided medical assistance</span>
              </div>

              <h1 className="chatbot-title">
                Smart <span className="gradient-text">AI symptom guidance</span>
              </h1>

              <p className="chatbot-subtitle">
                Describe your symptoms in natural language and receive a guided
                specialty suggestion to help you take the next medical step with
                more confidence.
              </p>

              <div className="chatbot-tags">
                <span><FaStethoscope /> Specialty Suggestions</span>
                <span><FaNotesMedical /> Guided Next Steps</span>
                <span><FaShieldVirus /> 19 Specialty Types</span>
              </div>
            </div>

            <div className="chatbot-info-card">
              <div className="chatbot-info-icon">
                <FaShieldHeart />
              </div>
              <h3>Important Notice</h3>
              <p>
                This assistant does <strong>not</strong> replace a doctor and
                does <strong>not</strong> provide a medical diagnosis. It helps
                guide you toward an appropriate specialty or clinic based on your
                described symptoms.
              </p>
              <ul className="chatbot-info-list">
                <li>Covers 19+ medical specialties</li>
                <li>Responds to natural language</li>
                <li>Always seek a real doctor for diagnosis</li>
              </ul>
            </div>
          </section>

          <section className="chatbot-layout">
            <article className="chatbot-chat-card">
              <div className="chatbot-chat-header">
                <div className="chatbot-chat-title">
                  <div className="chatbot-bot-icon"><FaRobot /></div>
                  <div>
                    <h2>HealthLink AI Assistant</h2>
                    <p>Symptom-based navigation support</p>
                  </div>
                </div>
                <span className="chatbot-live-pill">● Online</span>
              </div>

              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`chatbot-message-row ${message.sender === "user" ? "user-row" : "bot-row"}`}
                  >
                    <div className={`chatbot-message ${message.sender}`}>
                      <div className="chatbot-message-icon">
                        {message.sender === "user" ? <FaUser /> : <FaRobot />}
                      </div>
                      <div className="chatbot-message-content">
                        <strong>{message.sender === "user" ? "You" : "AI Assistant"}</strong>
                        {message.text.split("\n\n").map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chatbot-input-area">
                <div className="chatbot-input-wrapper">
                  <textarea
                    placeholder="Describe your symptoms or ask what specialist you may need... (Enter to send)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button
                  className="primary-btn chatbot-send-btn"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <FaPaperPlane />
                  Send
                </button>
              </div>
            </article>

            <aside className="chatbot-side-panel">
              <article className="chatbot-side-card">
                <h3>Try a suggestion</h3>
                <p className="chatbot-side-hint">Click any prompt to get an instant response.</p>
                <div className="chatbot-suggestions">
                  {SUGGESTIONS.map((item, index) => (
                    <button
                      key={index}
                      className="chatbot-suggestion-btn"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <FaArrowRight />
                      {item}
                    </button>
                  ))}
                </div>
              </article>

              <article className="chatbot-side-card">
                <h3>Specialties covered</h3>
                <div className="chatbot-specialty-chips">
                  {[
                    "Cardiology", "Dermatology", "Neurology", "Gastroenterology",
                    "Orthopedics", "Ophthalmology", "ENT", "Urology",
                    "Endocrinology", "Pulmonology", "Psychiatry", "Hematology",
                    "Gynecology", "Pediatrics", "Allergology", "Oncology",
                    "Dentistry", "Nutrition", "Physical Therapy",
                  ].map((s) => (
                    <span key={s} className="chatbot-specialty-chip">{s}</span>
                  ))}
                </div>
              </article>

              <article className="chatbot-side-card chatbot-how-card">
                <h3>How it helps</h3>
                <ul className="chatbot-help-list">
                  <li>Understands symptom descriptions</li>
                  <li>Suggests an appropriate specialty</li>
                  <li>Recommends safer next medical steps</li>
                  <li>Supports clinic discovery flows</li>
                </ul>
              </article>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Chatbot;