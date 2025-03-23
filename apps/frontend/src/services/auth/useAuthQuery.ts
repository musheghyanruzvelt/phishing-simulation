import { useMutation } from "@tanstack/react-query";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./Auth.types";
import { login, register } from "./Auth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { setAuthData } from "./Auth.utils";
import { ApiError } from "@/common/types";

const useLoginMutation = () => {
  const navigate = useNavigate();
  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: (data) => login(data),
    onSuccess: (data) => {
      setAuthData(data);
      navigate(ROUTES.ROOT);
    },
    onError: (error) => {
      console.error("Login failed:", error.response?.data);
    },
  });
};

const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation<RegisterResponse, ApiError, RegisterRequest>({
    mutationFn: (data) => register(data),
    onSuccess: (data) => {
      setAuthData(data);
      navigate(ROUTES.ROOT);
    },
    onError: (error) => {
      console.error("Registration failed:", error.response?.data);
    },
  });
};

export const useAuthQuery = () => {
  return {
    useLoginMutation,
    useRegisterMutation,
  };
};
