// userActions.js

import axios from "axios";
import { actionTypes } from "./types"; // Importa los actionTypes desde el archivo correcto

// Acción para realizar el inicio de sesión
export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/users/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Dispatch de la acción LOGIN_SUCCESS con los datos recibidos
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
          token: response.data.token,
          user: response.data.data,
          error: null,
        },
      });

      // Guardar el token en localStorage
      localStorage.setItem("token", response.data.token);

      return {
        type: actionTypes.LOGIN_SUCCESS,
        payload: response.data,
      };
    } catch (error) {
      // Dispatch de la acción LOGIN_FAILURE con el error recibido
      dispatch({
        type: actionTypes.LOGIN_FAILURE,
        payload: "Failed to log in",
      });

      return {
        type: actionTypes.LOGIN_FAILURE,
        payload: error.message,
      };
    }
  };
};

// Acción para realizar el registro de un nuevo usuario
export const register = (name, email, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/users/register`,
        { name, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
        payload: {
          token: response.data.token,
          user: response.data.user,
        },
      });
      // Guardar el token en localStorage
      localStorage.setItem("token", response.data.token);
      // Dispatch de la acción REGISTER_SUCCESS con los datos recibidos

      return {
        type: actionTypes.REGISTER_SUCCESS,
        payload: response.data,
      };
    } catch (error) {
      console.log(error ,"holaaa");
      // Dispatch de la acción REGISTER_FAILURE con el error recibido
      dispatch({
        type: actionTypes.REGISTER_FAILURE,
        payload: "Failed to register user",
      });

      return {
        type: actionTypes.REGISTER_FAILURE,
        payload: error.message,
      };
    }
  };
};

export const setAuthenticated = (isAuthenticated) => {
  return {
    type: actionTypes.SET_AUTHENTICATED,
    payload: isAuthenticated,
  };
};