import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

let tokenGetter = null

/**
 * Configure the Clerk session token getter.
 * Called from top-level App when Clerk authentication state is initialized.
 */
export function setAuthTokenGetter(getter) {
  tokenGetter = getter
}

// Request interceptor: dynamically attach fresh Clerk session token
api.interceptors.request.use(
  async (config) => {
    // Only bypass auth check for public health checks
    const isPublic = config.url?.includes('/health') && !config.url?.includes('/private')

    if (tokenGetter) {
      try {
        const token = await tokenGetter()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        } else if (!isPublic) {
          return Promise.reject(new Error('AUTH_TOKEN_MISSING'))
        }
      } catch (err) {
        console.error('Failed to get Clerk session token:', err)
        if (!isPublic) {
          return Promise.reject(err)
        }
      }
    } else if (!isPublic) {
      // Prevent requests before authentication is ready
      return Promise.reject(new Error('AUTH_NOT_READY'))
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: handle 401, 403, network errors, and user feedback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress toasts for handled auth readiness checks
    if (error.message === 'AUTH_NOT_READY' || error.message === 'AUTH_TOKEN_MISSING') {
      return Promise.reject(error)
    }

    // If request explicitly opted out of global toast
    if (error.config?.skipToast) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      toast.error('Session expired or authentication required. Please sign in again.', {
        id: 'auth-session-expired',
      })
      return Promise.reject(error)
    }

    if (error.response?.status === 403) {
      toast.error('Access forbidden: Request origin or permission denied.', {
        id: 'auth-forbidden',
      })
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
