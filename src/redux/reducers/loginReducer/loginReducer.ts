import {
  SEND_LOGIN, SEND_LOGIN_SUCCESS,
  SEND_LOGOUT, SEND_LOGIN_ERR, SEND_LOGOUT_SUCCESS,
  SEND_REGIS, SEND_REGIS_ERR, SEND_REGIS_SUCCESS
} from '../../actions/loginActions/login'

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
      return { ...state, user: action.data, loading: false }
    case SEND_LOGIN_ERR:
      return { ...state, error: action.data, loading: false }
    case SEND_LOGOUT:
      return { ...state, loading: true }
    case SEND_LOGOUT_SUCCESS:
      return initLogin
    default:
      return state
  }
}

const initRegis = {
  loggedIn: false,
  user: null,
  error: '',
  loading: false
}

export function regisReducer(state = initRegis, action: any) {
  switch (action.type) {
    case SEND_REGIS:
      return { ...state, loading: true }
    case SEND_REGIS_SUCCESS:
      return { ...state, user: action.data, loading: false }
    case SEND_REGIS_ERR:
      return { ...state, error: action.data, loading: false }
    default:
      return state
  }
}