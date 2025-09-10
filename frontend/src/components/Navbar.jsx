import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Productify</Link>

      <div className="navbar-center">
        <span className="user-info">
          Welcome, <strong>{user.username}</strong>
          {user.role === "admin" && <span className="admin-badge">Admin</span>}
        </span>
      </div>

      <div className="navbar-right">
        {user?.role === "admin" && (
          <Link to="/add-product" className="nav-btn admin-btn">
            + Add Product
          </Link>
        )}
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme === "light" ? "#333" : "#f0f0f0"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="theme-icon"
          >
            {theme === "light" ? (
              <>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </>
            ) : (
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            )}
          </svg>
        </button>
        <button onClick={logout} className="nav-btn logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
