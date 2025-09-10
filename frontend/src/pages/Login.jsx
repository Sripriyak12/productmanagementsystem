import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

function Login({ userType }) {
  return (
    <div className="auth-card-container">
      <LoginForm userType={userType} />

      {userType === "User" && (
        <p className="auth-link-text">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </p>
      )}

      {userType === "Admin" && (
        <p className="auth-link-text">
          Not an admin?{" "}
          <Link to="/login-user" className="auth-link">
            Login as a user
          </Link>
        </p>
      )}
    </div>
  );
}

export default Login;
