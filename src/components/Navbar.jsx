import "./navbar.css";
import { Link } from "react-router-dom";
import "animate.css"; // For built-in animations

function Navbar() {
  return (
    <>
      <header className="navbar-header animate__animated animate__fadeInDown animate__delay-0.5s">
        <Link to="/" className="navbar-brand">
          <h1 className="title">Upchaar Aayog</h1>
        </Link>

        <nav className="navbar">
          <ul className="navbar-list">
            <li>
              <a
                className="navbar-link animate__animated animate__fadeInUp animate__delay-1s"
                href="/login"
              >
                Login
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className="navbar-backside-frame"></div>
    </>
  );
}

export default Navbar;
