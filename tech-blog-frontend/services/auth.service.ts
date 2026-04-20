import { api, setToken, setUser, removeToken } from "@/lib/api";
import { ApiResponse, AuthResponse } from "@/types";

const validateLoginCredentials = (email: string, password: string): void => {
  if (!email?.trim()) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email format");
  }
};

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    validateLoginCredentials(email, password);
    const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
      email: email.toLowerCase(),
      password,
    });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout", {});
    } finally {
      removeToken();
    }
  },
};