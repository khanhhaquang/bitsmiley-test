import axios from 'axios'
import { DOMAIN_URL } from './settings'

const axiosInstance = axios.create({
  baseURL: DOMAIN_URL.API,
  headers: {
    accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json'
  }
})

export default axiosInstance
