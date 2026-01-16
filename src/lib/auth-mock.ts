import Cookies from "js-cookie";
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

    // Generate mock token
    const token = `mock_token_${user.id}_${Date.now()}`;

    // Set session cookie (simulated)
    Cookies.set("session_token", token, {
      expires: 7, // 7 days
      secure: true,
      sameSite: "strict",
    });

    return {
      user,
      token,
    };
  },

  /**
   * Logout - clears session cookie
   */
  logout(): void {
    Cookies.remove("session_token");
  },

  /**
   * Get current session token
   */
  getSessionToken(): string | undefined {
    return Cookies.get("session_token");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!Cookies.get("session_token");
  },
};
