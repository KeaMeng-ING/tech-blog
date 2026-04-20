import { api } from "@/lib/api";
import { ApiResponse, Category } from "@/types";

const validateId = (id: string): void => {
  if (!id?.trim()) throw new Error("Category ID is required");
};

const validateCategoryData = (data: { name?: string; slug?: string }): void => {
  if (data.name && typeof data.name !== "string") {
    throw new Error("Category name must be a string");
  }
  if (data.slug && typeof data.slug !== "string") {
    throw new Error("Category slug must be a string");
  }
};

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const res = await api.get<ApiResponse<Category[]>>("/categories");
    return res.data;
  },

  async getById(id: string): Promise<Category> {
    validateId(id);
    const res = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return res.data;
  },

  async create(data: { name: string; slug: string }): Promise<Category> {
    if (!data.name?.trim() || !data.slug?.trim()) {
      throw new Error("Category name and slug are required");
    }
    validateCategoryData(data);
    const res = await api.post<ApiResponse<Category>>("/categories", data);
    return res.data;
  },

  async update(
    id: string,
    data: { name?: string; slug?: string }
  ): Promise<Category> {
    validateId(id);
    validateCategoryData(data);
    const res = await api.patch<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    );
    return res.data;
  },

  async delete(id: string): Promise<void> {
    validateId(id);
    await api.delete(`/categories/${id}`);
  },
};