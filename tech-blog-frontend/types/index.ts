export type Role = "USER" | "ADMIN";
export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED";

export interface User {
  id: string;
  name?: string;
  email: string;
  role: Role;
  isDisabled: boolean;
  createdAt: string;
  subscriptions?: Subscription[];
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count?: { posts: number };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  content: string;
  thumbnailUrl?: string;
  source?: string;
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  categoryId?: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  shortDesc: string;
  content: string;
  thumbnailUrl?: string;
  source?: string;
  status: PostStatus;
  scheduledAt?: string;
  categoryId: string;
}

export interface Subscription {
  id: string;
  email: string;
  topics: string[];
  deliveryTime: string;
  isActive: boolean;
  createdAt: string;
}

export interface NewsletterHistory {
  id: string;
  topics: string[];
  totalSent: number;
  status: string;
  sentAt: string;
}

export interface DashboardStats {
  total: number;
  draft: number;
  scheduled: number;
  published: number;
  totalSubs: number;
  activeSubs: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}