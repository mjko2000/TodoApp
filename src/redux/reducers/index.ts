import { combineReducers } from 'redux';
import {loginReducer, regisReducer} from './loginReducer/loginReducer'
const allReducers = combineReducers({
  loginReducer, regisReducer
});

export default allReducers;