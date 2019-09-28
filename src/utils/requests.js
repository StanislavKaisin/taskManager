import axios from 'axios';
import * as api from './entyPoints';

export const axiosRequest = axios.create({
  baseURL: 'https://task-manager.goit.co.ua/api/'
});

axiosRequest.defaults.headers.post['Content-Type'] = 'application/json';
axiosRequest.defaults.headers.get['Content-Type'] = 'application/json';
axiosRequest.defaults.headers.put['Content-Type'] = 'application/json';

const setToken = token => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const fetchPosts = async token => {
  const res = await axiosRequest.get(api.url.getTasks());
  return res;
};

export const requestDeleteTask = async credentials => {
  const { id } = credentials;
  const res = await axiosRequest.delete(api.url.deleteTask(id));
  return res;
};

export const requestUpdateTask = async credentials => {
  const { id, data } = credentials;
  const res = await axiosRequest.patch(api.url.deleteTask(id), data);
  return res;
};

export const fetchAddForm = async (credentials, token) => {
  const res = await axiosRequest.post(api.url.addForm(), credentials, setToken(token));
  return res;
};
