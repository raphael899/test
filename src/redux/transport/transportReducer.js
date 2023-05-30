import { actionTypes } from "./transportTypes";

const initialState = {
  transportGround: null,
  transportMaritime: null,
  error: null,
  trasnportListGround: [],
  trasnportListMaritime: [],
};

const transportReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TRANSPORT_CREATE_GROUND_SUCCESS:
    case actionTypes.TRANSPORT_CREATE_GROUND_FAILURE:
      return {
        ...state,
        transportGround: action.payload.transportGround,
        error: null,
      };
    case actionTypes.TRANSPORT_CREATE_GROUND_SUCCESS_UPDATE:
    case actionTypes.TRANSPORT_CREATE_GROUND_FAILURE_UPDATE:
      return {
        ...state,
        transportGround: action.payload.transportGround,
        error: null,
      };
    case actionTypes.TRANSPORT_CREATE_MARIIME_SUCCESS:
    case actionTypes.TRANSPORT_CREATE_MARIIME_FAILURE:
      return {
        ...state,
        transportMaritime: action.payload.transportMaritime,
        error: null,
      };
    case actionTypes.TRANSPORT_CREATE_MARIIME_SUCCESS_UPDATE:
    case actionTypes.TRANSPORT_CREATE_MARIIME_FAILURE_UPDATE:
      return {
        ...state,
        transportMaritime: action.payload.transportMaritime,
        error: null,
      };
    case actionTypes.LIST_TRANSPORT_GROUND_SUCCESS:
      return {
        ...state,
        trasnportListGround: action.payload,
        error: null,
      };
    case actionTypes.LIST_TRANSPORT_GROUND_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.LIST_TRANSPORT_MARIIME_SUCCESS:
      return {
        ...state,
        trasnportListMaritime: action.payload,
        error: null,
      };
    case actionTypes.LIST_TRANSPORT_MARIIME_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.DELETE_TRANSPORT_GROUND_SUCCESS:
      return {
        ...state,
        trasnportListGround: state.trasnportListGround.filter(
          (transport) => transport.id !== action.payload
        ),
        error: null,
      };
    case actionTypes.DELETE_TRANSPORT_GROUND_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.DELETE_TRANSPORT_MARIIME_SUCCESS:
      return {
        ...state,
        trasnportListMaritime: state.trasnportListMaritime.filter(
          (transport) => transport.id !== action.payload
        ),
        error: null,
      };
    case actionTypes.DELETE_TRANSPORT_MARIIME_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default transportReducer;
