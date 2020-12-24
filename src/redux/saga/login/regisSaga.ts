import { call, takeEvery, put } from "redux-saga/effects";

import {
    SEND_REGIS, SEND_REGIS_ERR, SEND_REGIS_SUCCESS
} from "../../actions/loginActions/login";
import auth from '@react-native-firebase/auth'

function* regisFlow(action: any) {
    console.log('asasdadasd',action)
    try {
        const response = yield auth().createUserWithEmailAndPassword(action.data.email, action.data.password)
          .then(value =>  value.user )
        response.user.updateProfile({displayName: action.data.username});
        auth().signOut()
        console.log(response, "response REGIS")
        yield put({ type: SEND_REGIS_SUCCESS, data: response });
    } catch (error) {
        console.log(error, 'errrr')
        yield put({ type: SEND_REGIS_ERR, data: error });
    }
}

export function* watchRegis() {
    yield takeEvery(SEND_REGIS, regisFlow);
}
