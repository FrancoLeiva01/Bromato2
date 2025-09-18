import axios from "axios"
import type { LoginCredentials, AuthResponse, User } from "../types/auth"

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  timeout: 10000,
})

// Interceptor para agregar token a las requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authService = {
  // Simular login (reemplazar con llamada real a la API)
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulación de delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulación de validación
    if (credentials.username === "admin" && credentials.password === "admin123") {
      const mockResponse: AuthResponse = {
        user: {
          id: "1",
          username: "admin",
          email: "admin@catamarca.gov.ar",
          role: "admin",
          fullName: "Administrador del Sistema",
          department: "Bromatología Municipal",
        },
        token: "mock-jwt-token-12345",
        refreshToken: "mock-refresh-token-67890",
      }
      return mockResponse
    } else {
      throw new Error("Credenciales incorrectas")
    }
    // const response = await api.post<AuthResponse>('/auth/login', credentials)
    // return response.data
  },

  async logout(): Promise<void> {
    // En producción, hacer llamada al backend para invalidar el token
    // await api.post('/auth/logout')

    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
  },

  async getCurrentUser(): Promise<User> {
    // En producción:
    // const response = await api.get<User>('/auth/me')
    // return response.data

    const userData = localStorage.getItem("userData")
    if (userData) {
      return JSON.parse(userData)
    }
    throw new Error("No hay usuario autenticado")
  },
}

export default api
