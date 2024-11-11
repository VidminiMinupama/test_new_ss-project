import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const LoginRegister = () => {
  const [action, setAction] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate hook

  const registerLink = () => {
    setAction('active');
  }

  const loginLink = () => {
    setAction('');
  }

  // Handle form submission (for login)
  const handleLogin = (e) => {
    e.preventDefault();
    // You can add authentication logic here
    // For now, we'll redirect to the home page
    navigate('/home');  // Redirect to Home page after successful login
  }

  return (
    <div className={`wrapper ${action}`}>
      <div className="form-box login">
        <form onSubmit={handleLogin}>  {/* Add onSubmit handler */}
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input type="Password" placeholder="Password" required />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit">Login</button>

          <div className="register-link">
            <p>Don't have an account? <a href="#" onClick={registerLink}>Sign Up</a></p>
          </div>
        </form>
      </div>

      <div className="form-box Register">
        <form>
          <h1>Register</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input type="email" placeholder="Email" required />
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input type="Password" placeholder="Password" required />
            <FaLock className="icon" />
          </div>

          <div className="input-box">
            <input type="confirm password" placeholder="Confirm Password" required />
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> I agree to the terms & conditions
            </label>
          </div>

          <button type="submit">Register</button>

          <div className="register-link">
            <p>Already have an account? <a href="#" onClick={loginLink}>Sign In</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
