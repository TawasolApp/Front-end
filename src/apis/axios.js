/**
 * To use this structure
 * import { axiosInstance as axios } from './apis/axios'
 */

import axios from 'axios';


const BASE_URL = "";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export {axiosInstance};