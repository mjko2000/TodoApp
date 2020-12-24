import { call, takeEvery, put } from "redux-saga/effects";

import {
    SEND_LOGIN, SEND_LOGIN_SUCCESS, SEND_LOGIN_ERR,
    SEND_LOGOUT, SEND_LOGOUT_SUCCESS
} from "../../actions/loginActions/login";
import auth from '@react-native-firebase/auth'

function* loginFlow(action: any) {
    console.log('asasdadasd',action)
    try {
        const response = yield auth().signInWithEmailAndPassword(action.data.email, action.data.password).then(value => value.user)
        console.log(response, "response saga")
        yield put({ type: SEND_LOGIN_SUCCESS, data: response });
    } catch (error) {
        console.log(error, 'errrr')
        yield put({ type: SEND_LOGIN_ERR, data: error.message });
    }
}

function* logoutFlow(action: any) {
    console.log('asasdadasd',action)
    try {
        const response = yield auth().signOut().then(value => {return {status: "SUCCESS"}})
        console.log(response, "response saga")
        yield put({ type: SEND_LOGOUT_SUCCESS, data: response });
    } catch (error) {
        console.log(error, 'errrr')
        yield put({ type: SEND_LOGOUT_SUCCESS, data: error.message });
    }
}

export function* watchLogin() {
    yield takeEvery(SEND_LOGIN, loginFlow);
}
export function* watchLogout() {
    yield takeEvery(SEND_LOGOUT, logoutFlow);
}

