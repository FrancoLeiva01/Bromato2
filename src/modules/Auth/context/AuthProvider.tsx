// import { useQuery } from "@tanstack/react-query";
import { AuthContext, Status } from "./AuthContext";
import { useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { useAuth } from "../hook/useAuth";
import { User } from "@/services/authService";
import { useQuery } from "@tanstack/react-query";
import { authRepository } from "../repository/authRepository";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { logoutMutation, loginMutation } = useAuth();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: authRepository.AuthgetMe,
    staleTime: Infinity,
    enabled: !!localStorage.getItem("isAuthenticated"),
    retry: true,
  });
  const [isAuthenticated, setIsAuthenticated] = useState<Status>(
    Status.NOT_AUTHENTICATED
  );

  useEffect(() => {
    if (isLoading) {
      console.log("loading");
      setIsAuthenticated(Status.CHECKING);
    }
    if (user) {
      console.log(user);
      setIsAuthenticated(Status.AUTHENTICATED);
    }
      console.log(user);

    if (!user) {
      setIsAuthenticated(Status.NOT_AUTHENTICATED);
    }
  }, [user, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loginUser: loginMutation,
        logout: logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
