import { useAuthStore } from "../store/authStore";
import api from "./axios";

type LoginData = {
  identifier: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  created_at: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};

export type RegisterResponse = {
  user: User;
};


export type RefreshResponse = {
  accessToken: string;
};

export const loginApi = async (
  data: LoginData
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );

  console.log("LOGIN RESPONSE:", response.data);

  return response.data;
};

export const registerApi = async (
  data: RegisterData
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    data
  );

  console.log("REGISTER RESPONSE:", response.data);

  return response.data;
};

export const refreshApi = async (): Promise<RefreshResponse> => {
  const response = await api.post<RefreshResponse>("/auth/refresh");

  return response.data;
};