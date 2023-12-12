import React from "react";
import icon from "../assets/blogger.png";

function Navbar() {
  return (
    <>
      <nav class="navbar bg-body-tertiary mb-5">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            <div class="d-flex gap-2 align-items-center">
              <img src={icon} alt="Bootstrap" width="30" height="24" />
              <h4 class="fw-bold">Blogger.com</h4>
            </div>
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div class="offcanvas-header">
              <h5 class="offcanvas-title fw-bold" id="offcanvasNavbarLabel">
                <div class="d-flex gap-2 align-items-center">
                  <img src={icon} alt="Bootstrap" width="30" height="24" />
                  <h4 class="fw-bold">Blogger.com</h4>
                </div>
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="/">
                    Home
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/new/blog">
                    Post
                  </a>
                </li>
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Account
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="/profile">
                        <i class="bi bi-person-circle"></i> Profile
                      </a>
                    </li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="/login"
                        onClick={() => window.localStorage.clear()}
                      >
                        <i class="bi bi-box-arrow-right"></i> Log Out
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <form class="d-flex mt-3" role="search">
                <input
                  class="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button class="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
