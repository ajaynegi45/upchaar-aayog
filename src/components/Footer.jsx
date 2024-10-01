import { FaGithub, FaLinkedin , FaTwitter } from "react-icons/fa";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-social-links">

          <a
            href="https://github.com/ajaynegi45"
            target="_blank"
            rel="noreferrer"
            className="footer-icon-link"
          >
            <FaGithub className="footer-icon" />
          </a>

          <a
            href="https://www.linkedin.com/in/ajaynegi45/"
            target="_blank"
            rel="noreferrer"
            className="footer-icon-link"
          >
            <FaLinkedin className="footer-icon" />
          </a>

          <a
            href="https://x.com/ajaynegi45"
            target="_blank"
            rel="noreferrer"
            className="footer-icon-link"
          >
            <FaTwitter className="footer-icon" />
          </a>

          {/*<a*/}
          {/*  href="mailto:ajaynegi3345@icloud.com" // Updated email link*/}
          {/*  className="footer-icon-link"*/}
          {/*>*/}
          {/*  <FaEnvelope className="footer-icon" />*/}
          {/*</a>*/}

        </div>
        <div className="footer-bottom">
          <p className="footer-text">
            Developed with <span className="heart">❤️</span> by Codies Coder
          </p>
          <p className="footer-year">
            © {new Date().getFullYear()} Upchaar Aayog. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
