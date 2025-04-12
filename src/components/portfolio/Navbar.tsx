import React from 'react';
import signatureLogo from './images/signature Logo.png';
import lineImage from './images/line.svg';

const Navbar: React.FC = () => (
  <nav className="navbar fixed-top py-2 navbar-expand-lg">
    <div className="container">
      <a className="navbar-brand" href="#">
        <img src={signatureLogo} alt="logo" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="#home">
              <span className="oneword">/</span>home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#projects">
              <span className="oneword">/</span>projects
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#about-me">
              <span className="oneword">/</span>about-me
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#pricing">
              <span className="oneword">/</span>pricing
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#contact-me">
              <span className="oneword">/</span>contact-me
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              EN
            </a>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="/pl-pl.html">
                  PL
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
