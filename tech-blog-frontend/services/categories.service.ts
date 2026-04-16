import { api } from "@/lib/api";
import { ApiResponse, Category } from "@/types";

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const res = await api.get<ApiResponse<Category[]>>("/categories");
    return res.data;
  },

  async create(data: { name: string; slug: string }): Promise<Category> {
    const res = await api.post<ApiResponse<Category>>("/categories", data);
    return res.data;
  },

  async update(
    id: string,
    data: { name?: string; slug?: string }
  ): Promise<Category> {
    const res = await api.patch<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    );
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};