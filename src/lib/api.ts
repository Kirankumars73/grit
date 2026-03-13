const API_BASE = "https://blog-api-grit.onrender.com";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

function getToken(): string | null {
  return localStorage.getItem("grit_token");
}

export function setToken(token: string): void {
  localStorage.setItem("grit_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("grit_token");
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || json.detail || `API Error: ${res.status}`);
  }

  return json;
}

// Auth
export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

export async function signin(email: string, password: string) {
  const res = await apiFetch<{ token: string; user: AuthUser }>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.data;
}

export async function signup(email: string, password: string) {
  const res = await apiFetch<{ token: string; user: AuthUser }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.data;
}

export async function getMe() {
  const res = await apiFetch<AuthUser>("/auth/me");
  return res.data;
}

// Posts
export interface Post {
  title: string;
  body: string;
  author: string;
  status: string;
}

export async function getPosts() {
  const res = await apiFetch<Post[]>("/posts");
  return res.data;
}

export async function getPublishedPosts() {
  const res = await apiFetch<Post[]>("/posts/published");
  return res.data;
}

export async function getPostsByAuthor() {
  const res = await apiFetch<Post[]>("/posts/by-author");
  return res.data;
}

export async function createPost(data: {
  title: string;
  body: string;
  status: string;
}) {
  const res = await apiFetch<Post>("/posts/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deletePost(id: string) {
  const res = await apiFetch<null>("/post", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  return res;
}

// Comments
export interface Comment {
  post_id: string;
  author: string;
  content: string;
}

export async function getCommentsByPost(postTitle: string) {
  const res = await apiFetch<Comment[]>(
    `/comments/by-post?value=${encodeURIComponent(postTitle)}`
  );
  return res.data;
}

export async function createComment(postId: string, content: string) {
  const res = await apiFetch<{ id: string }>("/comments", {
    method: "POST",
    body: JSON.stringify({ post_id: postId, content }),
  });
  return res.data;
}
