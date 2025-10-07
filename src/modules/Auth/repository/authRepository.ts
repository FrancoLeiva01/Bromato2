import { apiClient, AuthResponse, LoginCredentials } from "@/services/authService"

export const authRepository =  {
        login: async (credentials: LoginCredentials): Promise<AuthResponse> =>  {
        try {
          const response = await apiClient.post<AuthResponse>("auth/login", credentials)
  
          if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user))
          }
    
          return response.data
        } catch (error: any) {
          throw new Error(error.response?.data?.message || "Error al iniciar sesión")
        }
      },

       AuthgetMe: async () => {
    const { data } = await apiClient.get("auth/me");
    return data;
  },
  
};