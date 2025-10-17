import { createContext } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { AuthResponse, LoginCredentials, User } from "@/services/authService";

export enum Status {
  CHECKING = "CHECKING",
  AUTHENTICATED = "AUTHENTICATED",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UserContext {
  user: User | null | undefined;
  isAuthenticated: Status;
  loginUser?: UseMutationResult<
    AuthResponse,
    Error,
    LoginCredentials,
    unknown
  >;
  logout?: UseMutationResult<
    any,
    Error,
    void,
    unknown
  >;
}

const initialState: UserContext = {
  user: null,
  isAuthenticated: Status.NOT_AUTHENTICATED,
  loginUser: undefined,
  logout: undefined,
};

export const AuthContext = createContext<UserContext>(initialState);
