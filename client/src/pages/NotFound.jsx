import { Link } from "react-router-dom";
import { FaArrowLeft, FaTriangleExclamation } from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <>
      <main className="notfound-page">
        <div className="page-container">
          <section className="notfound-card soft-card">
            <div className="notfound-icon">
              <FaTriangleExclamation />
            </div>

            <h1>404</h1>
            <h2>Page not found</h2>
            <p>
              The page you are trying to access does not exist or may have been moved.
            </p>

            <Link to="/" className="primary-btn">
              <FaArrowLeft />
              Back to Home
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default NotFound;