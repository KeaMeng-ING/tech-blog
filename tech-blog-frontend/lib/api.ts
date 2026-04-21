const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

type ErrorResponse = {
  message?: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function removeToken(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function setUser(user: object): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("user");
  if (!u) return null;

  try {
    return JSON.parse(u);
  } catch {
    // Reset corrupted user cache so protected routes can recover cleanly.
    localStorage.removeItem("user");
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const rawBody = await res.text();

  let data: T | ErrorResponse = {};
  if (rawBody && isJson) {
    try {
      data = JSON.parse(rawBody) as T | ErrorResponse;
    } catch {
      data = { message: "Server returned invalid JSON" };
    }
  } else if (rawBody) {
    data = { message: rawBody };
  }

  if (!res.ok) {
    const message =
      (data as ErrorResponse).message ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  if (!rawBody) {
    return {} as T;
  }

  if (!isJson) {
    throw new Error("Unexpected non-JSON response from API");
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
