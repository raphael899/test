import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/RegisterUser.css";
import { register } from "../redux/user/userActions";
import { actionTypes } from "../redux/user/types";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error } = useSelector(state => state.user); // Obtener el estado de error desde Redux

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(register(name, email, password)); // Dispatch de la acción de registro

      if (response.type === actionTypes.REGISTER_SUCCESS) {
        navigate('/transport'); // Redirigir al usuario a la página de transporte
      } else {
        const errorResponse = response.payload.error; // Obtén el mensaje de error de la respuesta
        setFormData({ ...formData, error: errorResponse });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <div className="alert error">{error}</div>} {/* Mostrar la alerta de error si existe */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="register-button">
            Register
          </button>
        </div>
      </form>
      <div className="redirect-link">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default Register;
