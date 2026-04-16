import { api, setToken, setUser, removeToken } from "@/lib/api";
import { ApiResponse, AuthResponse } from "@/types";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
      email,
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