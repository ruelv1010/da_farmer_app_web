// src/lib/api.ts
import axios from "axios"
import Cookies from "js-cookie"

const API_URL = import.meta.env.VITE_API_URL

interface ApiOptions {
  useAuth?: boolean
  useBranchId?: boolean
  customHeaders?: Record<string, string>
  responseType?: XMLHttpRequestResponseType
}

// Global session expiry handler (will be set by SessionProvider)
let globalSessionExpiryHandler: (() => void) | null = null

export const setGlobalSessionExpiryHandler = (handler: () => void) => {
  globalSessionExpiryHandler = handler
}

// Get token from cookies
const getToken = (): string | undefined => {
  const token = Cookies.get("authToken")
  return token
}

export const getBranchId = (): string | undefined => {
  try {
    const raw = Cookies.get("current_branch")

    if (!raw) return undefined

    const currentBranch = raw.replace(/^"|"$/g, "")
    return currentBranch
  } catch (error) {
    console.error("Failed to parse user cookie:", error)
    return undefined
  }
}

export const getCode = (): string | undefined => {
  try {
    const raw = Cookies.get("code")

    if (!raw) return undefined

    const currentBranch = raw.replace(/^"|"$/g, "")
    return currentBranch
  } catch (error) {
    console.error("Failed to parse user cookie:", error)
    return undefined
  }
}

// Create axios instance with interceptor
const axiosInstance = axios.create()

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response
  },
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Trigger session expiry modal instead of immediate redirect
      if (globalSessionExpiryHandler) {
        globalSessionExpiryHandler()
      }

      // Suppress the error from being logged to console to avoid API exposure
      // Create a new error without the response details
      const sanitizedError = new Error("Session expired")
      return Promise.reject(sanitizedError)
    }

    // Re-throw the error so it can still be handled by the calling code
    return Promise.reject(error)
  },
)

export const apiRequest = async <T = any>(
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  data: any = null,
  options: ApiOptions = {},
) => {
  const headers: Record<string, string> = {}

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  headers["Accept"] = "application/json"

  if (options.useAuth) {
    const token = getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    } else {
      console.warn("No token found in cookies.")
    }
  }

  if (options.useBranchId) {
    const branchId = getBranchId()
    if (branchId) {
      headers["X-Branch-Id"] = branchId
    }
  }

  if (options.customHeaders) {
    Object.entries(options.customHeaders).forEach(([key, value]) => {
      headers[key] = value
    })
  }

  const fullUrl = `${API_URL}${endpoint}`
  const config = {
    method,
    url: fullUrl,
    headers,
    data,
    responseType: options.responseType || "json",
  }

  // Use the axios instance with interceptor instead of direct axios.request
  return axiosInstance.request<T>(config)
}

// Example updateAttachment function
export const updateAttachment = async (attachmentId: string, data: FormData) => {
  return apiRequest("put", `/attachments/${attachmentId}`, data, {
    useAuth: true,
    useBranchId: true,
  })
}
