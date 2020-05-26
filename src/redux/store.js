import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import rootReducer from './reducer';
import thunk from 'redux-thunk';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { composeWithDevTools } from 'redux-devtools-extension';

import displayingDaysInCalendar from '../redux/middlewares/displayingDaysInCalendar.js';

//=========== axios instance ===============================

const client = axios.create({
  baseURL: 'https://task-manager.goit.co.ua/api/',
  // baseURL: 'http://192.168.89.246:5000/api/',

  responseType: 'json'
});

// Add a request interceptor
client.interceptors.request.use(function(config) {
  const token = store.getState().session.token;
  config.headers.Authorization = `Bearer ${token}`;
  // config.headers.Authorization = token;

  return config;
});

//============================================================

const middleWares = [thunk, axiosMiddleware(client), displayingDaysInCalendar];
const enhancer = composeWithDevTools(applyMiddleware(...middleWares));

const configureStore = () => {
  const store = createStore(rootReducer, enhancer);

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./reducer', () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  return store;
};

export const store = configureStore();
export const persistor = persistStore(store);
