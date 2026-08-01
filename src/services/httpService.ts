import axios from "axios"

import { urlPaths } from "@/constants/urlPaths"
import { getAuthToken, logoutAuthStore } from "@/stores/auth-store"

export const httpService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

httpService.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

httpService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutAuthStore()

      if (window.location.pathname !== urlPaths.login) {
        window.location.assign(urlPaths.login)
      }
    }

    return Promise.reject(error)
  },
)
