export const SEND_LOGIN = 'SEND_LOGIN'
export const SEND_LOGIN_SUCCESS = 'SEND_LOGIN_SUCCESS'
export const SEND_LOGIN_ERR = 'SEND_LOGIN_ERR'
export const SEND_LOGOUT = 'SEND_LOGOUT'
export const SEND_LOGOUT_SUCCESS = 'SEND_LOGOUT_SUCCESS'

export const SEND_REGIS = 'SEND_REGIS'
export const SEND_REGIS_SUCCESS = 'SEND_REGIS_SUCCESS'
export const SEND_REGIS_ERR = 'SEND_REGIS_ERR'

export function sendLoginAction(email: string, password: string)  {
  return {
    type: SEND_LOGIN,
    data: {email: email, password: password}
  }
}
export function sendRegisAction(username: String,email: string, password: string)  {
  return {
    type: SEND_REGIS,
    data: {username: username, email: email, password: password}
  }
}
export function sendLogout()  {
  return {
    type: SEND_LOGOUT,
    data: null
  }
}
