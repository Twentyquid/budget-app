import axios from 'axios'

const backendURL = import.meta.env.VITE_BACKEND_URL
export default axios.create({
  baseURL: backendURL,
})

export const apiWithCredentials = axios.create({
  baseURL: backendURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
