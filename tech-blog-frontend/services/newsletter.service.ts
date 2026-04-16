import { api } from "@/lib/api";
import { ApiResponse, Subscription, NewsletterHistory, DashboardStats } from "@/types";

export const newsletterService = {
  async getSubscriptions(params?: {
    topic?: string;
    status?: string;
    search?: string;
  }): Promise<Subscription[]> {
    const query = new URLSearchParams();
    if (params?.topic) query.set("topic", params.topic);
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const res = await api.get<ApiResponse<Subscription[]>>(
      `/subscription?${query.toString()}`
    );
    return res.data;
  },

  async pauseSubscription(id: string): Promise<void> {
    await api.patch(`/subscription/${id}/pause`, {});
  },

  async deleteSubscription(id: string): Promise<void> {
    await api.delete(`/subscription/${id}`);
  },

  async getHistory(): Promise<NewsletterHistory[]> {
    const res = await api.get<ApiResponse<NewsletterHistory[]>>(
      "/admin/newsletter/history"
    );
    return res.data;
  },

  async sendNewsletter(topics: string[]): Promise<{ message: string; postsFound: number }> {
    const res = await api.post<ApiResponse<{ message: string; postsFound: number }>>(
      "/admin/newsletter/send",
      { topics }
    );
    return res.data;
  },
};

export const adminService = {
  async getStats(): Promise<DashboardStats> {
    const res = await api.get<ApiResponse<DashboardStats>>("/admin/stats");
    return res.data;
  },
};