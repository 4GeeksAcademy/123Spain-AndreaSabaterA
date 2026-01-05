import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-sm bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          StarWars
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/characters">
                Characters
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contacts">
                Contacts
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/startships">
                StartShips
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/planets">
                Planets
              </Link>
            </li>
          </ul>

          {/* DROPDOWN */}
          <div className="dropdown ms-3">
            <button
              className="btn btn-warning dropdown-toggle rounded-pill px-4"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              ⭐ Favorites
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/favorites/characters">
                  Characters
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/favorites/planets">
                  Planets
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/favorites/startships">
                  StartShips
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
