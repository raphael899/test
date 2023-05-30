import axios from "axios";
import { actionTypes } from "./transportTypes";
import jwtDecode from "jwt-decode";
// import jwt from "jsonwebtoken";

export const addGround = (
  productType,
  quantity,
  deliveryDate,
  warehouse,
  shippingPrice,
  vehiclePlate
) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      console.log(token);
      const response = await axios.post(
        `${import.meta.env.VITE_API}/ground-shipping`,
        {
          productType,
          quantity,
          deliveryDate,
          warehouse,
          shippingPrice,
          vehiclePlate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Dispatch de la acción REGISTER_SUCCESS con los datos recibidos
      dispatch({
        type: actionTypes.TRANSPORT_CREATE_GROUND_SUCCESS,
        payload: {
          transportGround: response.data.transportGround,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: actionTypes.TRANSPORT_CREATE_GROUND_FAILURE,
        payload: "Failed",
      });
    }
  };
};

export const addMaritime = (
  productType,
  quantity,
  deliveryDate,
  port,
  shippingPrice,
  fleetNumber
) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API}/maritime-shipping`,
        {
          productType,
          quantity,
          deliveryDate,
          port,
          shippingPrice,
          fleetNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      // Dispatch de la acción REGISTER_SUCCESS con los datos recibidos
      dispatch({
        type: actionTypes.TRANSPORT_CREATE_MARIIME_SUCCESS,
        payload: {
          transportMaritime: response.data.transportMaritime,
        },
      });
    } catch (error) {
      dispatch({
        type: actionTypes.TRANSPORT_CREATE_MARIIME_FAILURE,
        payload: "Failed",
      });
    }
  };
};

export const listGround = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.Id;

      console.log(userID, "holaaaaa");

      const response = await axios.get(
        `${import.meta.env.VITE_API}/ground-shipping/${userID}`, // Utiliza una plantilla de cadena para incluir el valor de userID en la URL
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: actionTypes.LIST_TRANSPORT_GROUND_SUCCESS,
        payload: response.data,
        error: null,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.LIST_TRANSPORT_GROUND_FAILURE,
        payload: "Failed to get transport ground list",
      });
    }
  };
};

export const listMaritime = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.Id;

      const response = await axios.get(
        `${import.meta.env.VITE_API}/maritime-shipping/${userID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: actionTypes.LIST_TRANSPORT_MARIIME_SUCCESS,
        payload: response.data,
        error: null,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.LIST_TRANSPORT_MARIIME_FAILURE,
        payload: "Failed to get transport maritime list",
      });
    }
  };
};


export const updateGround = (
  id,
  productType,
  quantity,
  deliveryDate,
  warehouse,
  shippingPrice,
  vehiclePlate
) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API}/ground-shipping/${id}`,
        {
          productType,
          quantity,
          deliveryDate,
          warehouse,
          shippingPrice,
          vehiclePlate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Dispatch de la acción REGISTER_SUCCESS con los datos recibidos
      dispatch({
        type: actionTypes.TRANSPORT_CREATE_GROUND_SUCCESS_UPDATE,
        payload: {
          transportGround: response.data.transportGround,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: actionTypes.TRANSPORT_CREATE_GROUND_FAILURE_UPDATE,
        payload: "Failed",
      });
    }
  };
};


export const updateMaritime = (
  id,
  productType,
  quantity,
  deliveryDate,
  port,
  shippingPrice,
  fleetNumber
) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API}/maritime-shipping/${id}`,
        {
          productType,
          quantity,
          deliveryDate,
          port,
          shippingPrice,
          fleetNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      // Dispatch de la acción REGISTER_SUCCESS con los datos recibidos
      dispatch({
        type: actionTypes.TRANSPORT_CREATE_MARIIME_SUCCESS_UPDATE,
        payload: {
          transportMaritime: response.data.transportMaritime,
        },
      });
    } catch (error) {
      dispatch({
        type: actionTypes.TRANSPORT_CREATE_MARIIME_FAILURE_UPDATE,
        payload: "Failed",
      });
    }
  };
};

export const deleteGround = (transportId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API}/ground-shipping/${transportId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: actionTypes.DELETE_TRANSPORT_GROUND_SUCCESS,
        payload: transportId,
        error: null,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.DELETE_TRANSPORT_GROUND_FAILURE,
        payload: "Failed to delete transport ground",
      });
    }
  };
};

export const deleteMaritime = (transportId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API}/maritime-shipping/${transportId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: actionTypes.DELETE_TRANSPORT_MARIIME_SUCCESS,
        payload: transportId,
        error: null,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.DELETE_TRANSPORT_MARIIME_FAILURE,
        payload: "Failed to delete transport maritime",
      });
    }
  };
};


