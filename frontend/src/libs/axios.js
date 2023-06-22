import axios from 'axios';

export const publicAx = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

export const privateAx = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});
