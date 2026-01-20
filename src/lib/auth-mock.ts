import type { User, AuthCredentials, AuthResponse } from "@/types";
import { api, type LoginResponse } from "./api";

/**
 * Service d'authentification connecté au backend
 */
export const authService = {
  /**
   * Connexion avec email et mot de passe
   * @param credentials - Email et mot de passe
   * @returns Promise<AuthResponse> - Objet utilisateur et token
   * @throws Error si les identifiants sont invalides
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<LoginResponse>("/api/v1/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      // Convertir la réponse du backend au format frontend
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: `${response.user.prenom} ${response.user.nom}`,
        role: this.mapRoleIdToRole(response.user.role_id),
        createdAt: response.user.created_at,
      };

      // Le token est déjà stocké dans localStorage par l'API
      const token = typeof window !== "undefined" 
        ? localStorage.getItem("session_token") 
        : null;

      // Stocker aussi l'utilisateur
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return {
        user,
        token: token || undefined,
      };
    } catch (error) {
      // Relancer l'erreur avec le message approprié
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erreur de connexion");
    }
  },

  /**
   * Mapper le role_id du backend vers le rôle frontend
   */
  mapRoleIdToRole(roleId: string): "HOST" | "ADMIN" {
    // Mapper les IDs de rôles du backend vers les rôles frontend
    // 1 = Client, 2 = Loueur, 3 = Admin, 4 = Super Admin
    if (roleId === "3" || roleId === "4") {
      return "ADMIN";
    }
    return "HOST";
  },

  /**
   * Déconnexion - supprime la session
   */
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("session_token");
      localStorage.removeItem("user");
    }
  },

  /**
   * Obtenir le token de session actuel
   */
  getSessionToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("session_token");
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("session_token");
  },

  /**
   * Obtenir l'utilisateur actuel depuis le stockage
   */
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
};
