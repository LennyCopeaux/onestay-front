import type { User, AuthCredentials, AuthResponse } from "@/types";

/**
 * Mock Users Database
 */
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "host@demo.com",
    name: "Hôte Démo",
    role: "HOST",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "admin@demo.com",
    name: "Admin Démo",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  },
];

/**
 * Mock Authentication Service
 * Simulates network delay and validates credentials
 */
export const authService = {
  /**
   * Login with email and password
   * @param credentials - Email and password
   * @returns Promise<AuthResponse> - User object and token
   * @throws Error if credentials are invalid
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulate network delay (1000ms)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user by email
    const user = MOCK_USERS.find((u) => u.email === credentials.email);

    // Valider les identifiants
    if (!user) {
      throw new Error("Identifiants invalides");
    }

    // Vérifier le mot de passe selon le rôle
    let isValidPassword = false;
    if (user.role === "HOST" && credentials.password === "password123") {
      isValidPassword = true;
    } else if (user.role === "ADMIN" && credentials.password === "admin123") {
      isValidPassword = true;
    }

    if (!isValidPassword) {
      throw new Error("Identifiants invalides");
    }

    // Générer un token mock
    const token = `mock_token_${user.id}_${Date.now()}`;

    // Stocker dans localStorage (plus simple que les cookies)
    if (typeof window !== "undefined") {
      localStorage.setItem("session_token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return {
      user,
      token,
    };
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
