import type { User, AuthCredentials, AuthResponse } from "@/types";
import { api, type LoginResponse } from "./api";

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<LoginResponse>("/api/v1/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: `${response.user.prenom} ${response.user.nom}`,
      role: this.mapRoleIdToRole(response.user.role_id),
      createdAt: response.user.created_at,
    };

    const token = typeof window !== "undefined" 
      ? localStorage.getItem("session_token") 
      : null;

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return {
      user,
      token: token || undefined,
    };
  },

  mapRoleIdToRole(roleId: string): "HOST" | "ADMIN" {
    if (roleId === "3" || roleId === "4") {
      return "ADMIN";
    }
    return "HOST";
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("session_token");
      localStorage.removeItem("user");
    }
  },

  getSessionToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("session_token");
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("session_token");
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  updateCurrentUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
};
