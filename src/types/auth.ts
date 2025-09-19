export interface User {
  id: string
  email: string
  name?: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: User
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}
