import baseApi from "./baseapi";

// =========================
// User Role
// =========================

export interface UserRole {
  id: number;
  name: string;
}

// =========================
// User
// =========================

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole | null;
}

// =========================
// Get All Users
// =========================

export const getAllUsers = async (): Promise<User[]> => {
  const response = await baseApi.get<User[]>(
    "/api/users"
  );

  return response.data;
};