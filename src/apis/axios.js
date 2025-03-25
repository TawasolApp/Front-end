/**
 * To use this structure
 * import { axiosInstance as axios } from './apis/axios'
 */
import axios from "axios";


export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
})

export { axiosInstance };
