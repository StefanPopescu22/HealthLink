import { useMemo, useState } from "react";
import {
  FaArrowRight,
  FaNotesMedical,
  FaRobot,
  FaShieldHeart,
  FaStethoscope,
  FaUser,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/Chatbot.css";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello. I am your HealthLink AI Assistant. Describe your symptoms and I will suggest a relevant medical specialty and the next step.",
    },
  ]);
  const [input, setInput] = useState("");

  const suggestions = useMemo(
    () => [
      "I have chest pain and shortness of breath",
      "My skin is itchy and I have red spots",
      "I have headaches and dizziness",
      "I need help choosing the right specialist",
    ],
    []
  );

  const getBotReply = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes("chest") || lower.includes("heart") || lower.includes("breath")) {
      return "Suggested specialty: Cardiology. Recommended next step: book a consultation with a cardiologist and seek urgent medical help if symptoms become severe.";
    }

    if (lower.includes("skin") || lower.includes("rash") || lower.includes("itch")) {
      return "Suggested specialty: Dermatology. Recommended next step: schedule a dermatology consultation and upload any recent related documents.";
    }

    if (lower.includes("head") || lower.includes("dizziness") || lower.includes("migraine")) {
      return "Suggested specialty: Neurology or Internal Medicine. Recommended next step: book a specialist consultation and monitor how often symptoms occur.";
    }

    return "Suggested specialty: General Medicine. Recommended next step: start with an initial consultation so the doctor can evaluate symptoms and guide you further.";
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: "user", text: trimmed };
    const botMessage = { sender: "bot", text: getBotReply(trimmed) };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const handleSuggestionClick = (text) => {
    const userMessage = { sender: "user", text };
    const botMessage = { sender: "bot", text: getBotReply(text) };

    setMessages((prev) => [...prev, userMessage, botMessage]);
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
                specialty suggestion to help you take the next medical step more confidently.
              </p>

              <div className="chatbot-tags">
                <span>
                  <FaStethoscope />
                  Specialty Suggestions
                </span>
                <span>
                  <FaNotesMedical />
                  Guided Next Steps
                </span>
                <span>
                 
                  Better Care Navigation
                </span>
              </div>
            </div>

            <div className="chatbot-info-card soft-card">
              <h3>Important Notice</h3>
              <p>
                This assistant does not replace a doctor and does not provide a medical diagnosis.
                It helps guide you toward an appropriate specialty or clinic.
              </p>
            </div>
          </section>

          <section className="chatbot-layout">
            <article className="soft-card chatbot-chat-card">
              <div className="chatbot-chat-header">
                <div className="chatbot-chat-title">
                  <div className="chatbot-bot-icon">
                    <FaRobot />
                  </div>
                  <div>
                    <h2>HealthLink AI Assistant</h2>
                    <p>Symptom-based navigation support</p>
                  </div>
                </div>

                <span className="chatbot-live-pill">Online</span>
              </div>

              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`chatbot-message-row ${
                      message.sender === "user" ? "user-row" : "bot-row"
                    }`}
                  >
                    <div className={`chatbot-message ${message.sender}`}>
                      <div className="chatbot-message-icon">
                        {message.sender === "user" ? <FaUser /> : <FaRobot />}
                      </div>

                      <div className="chatbot-message-content">
                        <strong>{message.sender === "user" ? "You" : "AI Assistant"}</strong>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chatbot-input-area">
                <div className="chatbot-input-wrapper">
                  <textarea
                    placeholder="Describe your symptoms or ask what specialist you may need..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>

                <button className="primary-btn chatbot-send-btn" onClick={handleSend}>
                  Send
                  <FaArrowRight />
                </button>
              </div>
            </article>

            <aside className="chatbot-side-panel">
              <article className="soft-card chatbot-side-card">
                <h3>Try a suggestion</h3>
                <div className="chatbot-suggestions">
                  {suggestions.map((item, index) => (
                    <button
                      key={index}
                      className="chatbot-suggestion-btn"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </article>

              <article className="soft-card chatbot-side-card">
                <h3>How it helps</h3>
                <ul className="chatbot-help-list">
                  <li>Understands symptom descriptions</li>
                  <li>Suggests an appropriate specialty</li>
                  <li>Encourages safer next medical steps</li>
                  <li>Can support clinic discovery flows</li>
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