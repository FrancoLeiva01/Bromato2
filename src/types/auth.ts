export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "user" | "inspector"
  fullName: string
  department?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}
