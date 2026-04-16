import { api } from "@/lib/api";
import { ApiResponse, User, Role } from "@/types";

export const usersService = {
  async getAll(): Promise<User[]> {
    const res = await api.get<ApiResponse<User[]>>("/users");
    return res.data;
  },

  async changeRole(id: string, role: Role): Promise<User> {
    const res = await api.patch<ApiResponse<User>>(`/users/${id}/role`, {
      role,
    });
    return res.data;
  },

  async toggleDisable(id: string, isDisabled: boolean): Promise<User> {
    const res = await api.patch<ApiResponse<User>>(`/users/${id}/disable`, {
      isDisabled,
    });
    return res.data;
  },
};