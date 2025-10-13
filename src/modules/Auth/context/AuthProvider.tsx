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
    enabled: !!localStorage.getItem("isAuthenticated"),
    retry: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState<Status>(
    Status.NOT_AUTHENTICATED,
  );

  useEffect(() => {
    console.log('useEffect')
     if (isLoading) {
      console.log('loading')
      setIsAuthenticated(Status.CHECKING);
      return
    } 
    if (user) {
      console.log(user)
      setIsAuthenticated(Status.AUTHENTICATED);
      return
    }
  }, [user]);

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
