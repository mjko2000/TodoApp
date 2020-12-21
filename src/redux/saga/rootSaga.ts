import { all } from "redux-saga/effects";
import {watchLogin, watchLogout} from './login/loginSaga'
import {watchRegis} from './login/regisSaga'
export default function* rootSaga() {
	yield all([
		watchLogin(),
		watchRegis(),
		watchLogout()
	]);
}
