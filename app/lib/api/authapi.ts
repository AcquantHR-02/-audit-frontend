import baseApi from "./baseapi";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await baseApi.post<LoginResponse>(
    "/api/auth/login",
    data
  );

  return response.data;
};

export const registerUser = async (
  data: RegisterRequest
) => {
  const response = await baseApi.post(
    "/api/auth/register",
    data
  );

  return response.data;
};