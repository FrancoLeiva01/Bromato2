// import { useQuery } from "@tanstack/react-query";
import { AuthContext, Status } from "./AuthContext";
import { useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { useAuth } from "../hook/useAuth";
import { User } from "@/services/authService";
import { useQuery } from "@tanstack/react-query";
import { authRepository } from "../repository/authRepository";


export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {  logoutMutation, loginMutation } = useAuth();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: authRepository.AuthgetMe,
    staleTime: Infinity,
    // enabled: !!token,
    retry:true, 
  });
  const [isAuthenticated, setIsAuthenticated] = useState<Status>(
    Status.AUTHENTICATED,
  );

  useEffect(() => {
     if (isLoading) {
      setIsAuthenticated(Status.CHECKING);
      return
    } 
    if (user) {
      setIsAuthenticated(Status.AUTHENTICATED);
      return
    }
  }, [user, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loginUser: loginMutation,
        logout: logoutMutation.mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
