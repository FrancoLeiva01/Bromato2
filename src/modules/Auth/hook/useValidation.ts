import { useQuery } from "@tanstack/react-query";
import { authRepository } from "../repository/authRepository";
import { User } from "@/services/authService";

const useAuthValidations = () => {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: authRepository.AuthgetMe,
    retry: true,
    staleTime: 1000 * 60 * 5,
  });

  return { userData, isLoading, error };
};

export default useAuthValidations;