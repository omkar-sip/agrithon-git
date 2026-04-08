// src/services/api.ts — Base Axios client with interceptors
import axios from 'axios'
import { env } from '../config/env'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl || '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (!navigator.onLine) {
      return Promise.reject(new Error('OFFLINE'))
    }
    return Promise.reject(error)
  }
)
