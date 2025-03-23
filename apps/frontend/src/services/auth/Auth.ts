import axios, { AxiosError } from "axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./Auth.types";

export const register = async (
  registerData: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const { data } = await axios.post(
      `/api/management/auth/register`,
      registerData
    );
    return data;
  } catch (error) {
    console.error("Register API error:", (error as AxiosError).response?.data);
    throw error;
  }
};

export const login = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  try {
    const { data } = await axios.post(`/api/management/auth/login`, loginData);
    return data;
  } catch (error) {
    console.error("Register API error:", (error as AxiosError).response?.data);
    throw error;
  }
};
