import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import { login } from "../redux/user/userActions";
import { actionTypes } from "../redux/user/types";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    error: "",
  });

  const { email, password, error } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(login(email, password));

      if (response.type === actionTypes.LOGIN_SUCCESS) {
        navigate('/transport');
      } else {
        const errorResponse = response.payload.error; // Obtén el mensaje de error de la respuesta
        setFormData({ ...formData, error: errorResponse });
      }
    } catch (error) {
      setFormData({ ...formData, error: "Invalid email or password" });
    }
  };
  

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="login-button">
            Log In
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
      <div className="redirect-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default Login;
