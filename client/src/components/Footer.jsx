import { Link } from "react-router-dom";
import { FaHeartPulse, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <FaHeartPulse />
          </div>

          <div>
            <h3>HealthLink</h3>
            <p>
              Modern platform for managing medical services,
                appointments, documents and intelligent assistance.
            </p>
          </div>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4>Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/chatbot">AI Assistant</Link>
          </div>

          <div className="footer-column">
            <h4>Services</h4>
            <Link to="/clinics">Clinics</Link>
            <Link to="/doctor-profile">Doctors</Link>
            <Link to="/dashboard-patient">Patient Area</Link>
            <Link to="/dashboard-clinic">Clinic Area</Link>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <p>Email: contact@healthlink.ro</p>
            <p>Phone: +40 700 000 000</p>
          </div>
        </div>
      </div>

      <div className="page-container footer-divider"></div>

      <div className="page-container footer-bottom">
        <p>© 2026 HealthLink. All rights reserved.</p>

        <div className="footer-socials">
          <a href="#" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;