import React from 'react';
import { Link } from 'react-router-dom';

function RoleSelection() {
  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <h1>Welcome to Productify</h1>
        <p>Please select your role to continue</p>
        <div className="role-buttons">
          <Link to="/login-admin" className="role-btn admin">
            I am an Admin
          </Link>
          <Link to="/login-user" className="role-btn user">
            I am a User
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
