import { api } from "@/lib/api";
import { ApiResponse, User, Role } from "@/types";

const validateId = (id: string): void => {
  if (!id?.trim()) throw new Error("User ID is required");
};

const validateRole = (role: Role): void => {
  if (!role || !["USER", "ADMIN"].includes(role)) {
    throw new Error("Invalid role provided");
  }
};

export const usersService = {
  async getAll(): Promise<User[]> {
    const res = await api.get<ApiResponse<User[]>>("/users");
    return res.data;
  },

  async getById(id: string): Promise<User> {
    validateId(id);
    const res = await api.get<ApiResponse<User>>(`/users/${id}`);
    return res.data;
  },

  async changeRole(id: string, role: Role): Promise<User> {
    validateId(id);
    validateRole(role);
    const res = await api.patch<ApiResponse<User>>(`/users/${id}/role`, {
      role,
    });
    return res.data;
  },

  async toggleDisable(id: string, isDisabled: boolean): Promise<User> {
    validateId(id);
    if (typeof isDisabled !== "boolean") {
      throw new Error("isDisabled must be a boolean");
    }
    const res = await api.patch<ApiResponse<User>>(`/users/${id}/disable`, {
      isDisabled,
    });
    return res.data;
  },
};