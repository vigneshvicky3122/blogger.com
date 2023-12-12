import React from "react";
import icon from "../assets/blogger.png";

function Navbar() {
  return (
    <>
      <nav className="navbar bg-body-tertiary mb-5">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <div className="d-flex gap-2 align-items-center">
              <img src={icon} alt="Bootstrap" width="30" height="24" />
              <h4 className="fw-bold">Blogger.com</h4>
            </div>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title fw-bold" id="offcanvasNavbarLabel">
                <div className="d-flex gap-2 align-items-center">
                  <img src={icon} alt="Bootstrap" width="30" height="24" />
                  <h4 className="fw-bold">Blogger.com</h4>
                </div>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/new/blog">
                    Post
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
                    Account
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/profile">
                        <i className="bi bi-person-circle"></i> Profile
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="/login"
                        onClick={() => window.localStorage.clear()}
                      >
                        <i className="bi bi-box-arrow-right"></i> Log Out
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
