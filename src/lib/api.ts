import type { 
  ApiUser, 
  Role, 
  CreateUserRequest, 
  UpdateUserRequest,
  Logement,
  CreateLogementRequest,
  LogementResponse,
  LogementsListResponse,
  ProfileResponse
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ApiError {
  error: string;
  details?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    role_id: string;
    created_at: string;
  };
}

export interface UsersResponse {
  users: ApiUser[];
  count: number;
}

export interface RolesResponse {
  roles: Role[];
}

export const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = typeof window !== "undefined" 
      ? localStorage.getItem("session_token") 
      : null;
    
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: `Erreur ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.error || "Une erreur est survenue");
    }

    const data = await response.json();

    const authHeader = response.headers.get("Authorization");
    if (authHeader && typeof window !== "undefined") {
      const extractedToken = authHeader.replace("Bearer ", "");
      localStorage.setItem("session_token", extractedToken);
    }

    return data;
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  },

  // ==================== USERS ====================

  async getUsers(): Promise<ApiUser[]> {
    const response = await this.get<UsersResponse>("/api/v1/users");
    return response.users || [];
  },

  async getRoles(): Promise<Role[]> {
    const response = await this.get<RolesResponse>("/api/v1/auth/roles");
    return response.roles || [];
  },

  async createUser(data: CreateUserRequest): Promise<void> {
    await this.post("/api/v1/users/register", data);
  },

  async updateUser(userId: string, data: UpdateUserRequest): Promise<void> {
    await this.put(`/api/v1/users/${userId}`, data);
  },

  async deleteUser(userId: string): Promise<void> {
    await this.delete(`/api/v1/users/${userId}`);
  },

  // ==================== LOGEMENTS ====================

  async createLogement(data: CreateLogementRequest): Promise<Logement> {
    const response = await this.post<LogementResponse>("/api/v1/logements", data);
    return response.logement;
  },

  async getLogementsByUser(userId: string): Promise<Logement[]> {
    const response = await this.get<LogementsListResponse>(`/api/v1/logements/user/${userId}`);
    return response.logements || [];
  },

  // ==================== PROFILE ====================

  async getProfile(): Promise<ProfileResponse> {
    return this.get<ProfileResponse>("/api/v1/users/profile");
  },
};
