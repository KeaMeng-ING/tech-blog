import { api } from "@/lib/api";
import { ApiResponse, Post, PostsResponse, CreatePostInput } from "@/types";

export const postsService = {
  async getAll(params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PostsResponse> {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const res = await api.get<ApiResponse<PostsResponse>>(
      `/posts?${query.toString()}`
    );
    return res.data;
  },

  async getById(id: string): Promise<Post> {
    const res = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return res.data;
  },

  async create(data: CreatePostInput): Promise<Post> {
    const res = await api.post<ApiResponse<Post>>("/posts", data);
    return res.data;
  },

  async update(id: string, data: Partial<CreatePostInput>): Promise<Post> {
    const res = await api.patch<ApiResponse<Post>>(`/posts/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};