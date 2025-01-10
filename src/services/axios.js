import axios from 'axios'
// import {BASE_URL} from './apis'
const BASE_URL = import.meta.env.VITE_APP_BASE_URL
 const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 300000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'ngrok-skip-browser-warning': '69420',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  export default axiosInstance;

