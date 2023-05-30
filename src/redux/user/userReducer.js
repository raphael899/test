import { actionTypes } from "./types";

const initialState = {
  token: null,
  user: null,
  error: null,
  isAuthenticated: false, // Agrega la propiedad isAuthenticated inicializada en falso
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
        isAuthenticated: true, // Añade el campo isAuthenticated y establece su valor en true
      };
    case actionTypes.LOGIN_FAILURE:
    case actionTypes.REGISTER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isAuthenticated: false, // Asegúrate de establecer isAuthenticated en false en caso de fallo
      };
    case actionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
