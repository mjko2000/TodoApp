import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import allReducers from './src/redux/reducers/index';
import rootSaga from './src/redux/saga/rootSaga';
const sagaMiddleware = createSagaMiddleware();
let store = createStore(allReducers, applyMiddleware(sagaMiddleware));
import AppContainer from './src/App';

const Root:React.FC = (props) => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}
export default Root;

sagaMiddleware.run(rootSaga);