// reducers.js
import { combineReducers } from 'redux';

// Importa tus reducers individuales aquí
import userReducer from './user/userReducer';
import transportReducer from './transport/transportReducer';

// Combina los reducers en un rootReducer
const rootReducer = combineReducers({
  user: userReducer,
  transport: transportReducer
});

export default rootReducer;
