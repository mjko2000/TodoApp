import {
  SEND_LOGIN, SEND_LOGIN_SUCCESS,
  SEND_LOGOUT, SEND_LOGIN_ERR, SEND_LOGOUT_SUCCESS,
  SEND_REGIS, SEND_REGIS_ERR, SEND_REGIS_SUCCESS, RETSET_LOGIN, SEND_REGIS_RESET
} from '../../actions/loginActions/login'
import {userData} from '../../../config/setting'
const initLogin = {
  loggedIn: false,
  user: null,
  error: '',
  loading: false
}

export function loginReducer(state = initLogin, action: any) {
  switch (action.type) {
    case SEND_LOGIN:
      return { ...state, loading: true }
    case SEND_LOGIN_SUCCESS:
      const user = action.data;
      if(user){
        userData.id = user.uid
        userData.username = user.displayName
        userData.email = user.email
        userData.avatar = user.photoURL
      }
      return { ...state, user: action.data, loading: false }
    case SEND_LOGIN_ERR:
      return { ...state, error: action.data, loading: false }
    case SEND_LOGOUT:
      return { ...state, loading: true }
    case RETSET_LOGIN:
      return initLogin
    case SEND_LOGOUT_SUCCESS:
      return initLogin
    default:
      return state
  }
}

const initRegis = {
  loggedIn: false,
  status: null,
  message: '',
  loading: false
}

export function regisReducer(state = initRegis, action: any) {
  switch (action.type) {
    case SEND_REGIS:
      return { ...state, loading: true }
    case SEND_REGIS_SUCCESS:
      return { ...state, status: action.data.status, message: action.data.message, loading: false }
    case SEND_REGIS_ERR:
      return { ...state, status: action.data.status, message: action.data.message, loading: false }
    case SEND_REGIS_RESET:
      return initRegis
    default:
      return state
  }
}