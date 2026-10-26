import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => {
    toast.error('Failed to send network request.')
    return Promise.reject(error)
  }
)

// Response interceptor to automatically catch and toast server-side errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If request was explicitly configured to suppress global toast, skip
    if (error.config?.skipToast) {
      return Promise.reject(error)
    }

    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED' ? 'Request timed out' : null) ||
      (error.message === 'Network Error' ? 'Cannot reach SpendWise server' : null) ||
      error.message ||
      'Server error occurred'

    toast.error(serverMessage)
    return Promise.reject(error)
  }
)

/**
 * Helper to run any API request with a react-hot-toast promise
 * @param {Promise} requestPromise
 * @param {{ loading?: string, success?: string, error?: string }} options
 */
export function toastPromise(
  requestPromise,
  {
    loading = 'Processing...',
    success = 'Operation successful!',
    error = 'Operation failed',
  } = {}
) {
  return toast.promise(requestPromise, {
    loading,
    success: typeof success === 'function' ? success : () => success,
    error: (err) =>
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      error,
  })
}

export default api
