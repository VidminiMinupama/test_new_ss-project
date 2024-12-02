import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from 'axios';

const LoginRegister = () => {
  const [action, setAction] = useState('');
  const navigate = useNavigate();

  const registerLink = () => {
    setAction('active');
  };

  const loginLink = () => {
    setAction('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please check your email to verify your account.");
        navigate('/'); // Redirect to the home/login page after registration
      } else {
        alert(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error during registration:", error.message, error.stack);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert("Login successful!");
        navigate('/dashboard'); // Redirect to dashboard or a different route after successful login
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={`wrapper ${action}`}>
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
          <input type="text" placeholder="Username" name="username" required />
          <FaUser className="icon" />

          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" name="password" required />
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
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" name="username" required />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="email" placeholder="Email" name="email" required />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" name="password" required />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Confirm Password" name="confirmPassword" required />
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
