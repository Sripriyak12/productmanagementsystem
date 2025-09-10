import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="auth-card-container">
      <RegisterForm />
      <p className="auth-link-text">
        Already have an account?{" "}
        <Link to="/login-user" className="auth-link">
          Login here
        </Link>
      </p>
    </div>
  );
}

export default Register;
