/**
 * To use this structure
 * import { axiosInstance as axios } from './apis/axios'
 */

import axios from 'axios';


const BASE_URL = "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export {axiosInstance};