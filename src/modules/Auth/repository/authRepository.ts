import { apiClient, AuthResponse, LoginCredentials } from "@/services/authService"

export const authRepository =  {
        login: async (credentials: LoginCredentials): Promise<AuthResponse> =>  {
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
}