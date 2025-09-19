import axios from "axios"

const API_BASE_URL = "http://localhost:3001"

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)
export { apiClient}
export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name?: string
  role?: string
}

export interface AuthResponse {
  message: string
  user: User
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/api/v1/auth/login", credentials)

      // Store user data (token is handled by httpOnly cookie)
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user))
      }

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al iniciar sesión")
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/v1/auth/logout")
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>("/api/v1/auth/profile")
      return response.data.user
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener perfil")
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

export const authService = new AuthService()
export default authService
