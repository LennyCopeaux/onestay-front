/**
 * Configuration de l'API
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Types pour les réponses de l'API
 */
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

/**
 * Service API pour communiquer avec le backend
 */
export const api = {
  /**
   * Effectue une requête HTTP avec gestion des erreurs
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Ajouter le token d'authentification si disponible
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

    try {
      const response = await fetch(url, config);

      // Gérer les erreurs HTTP
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: `Erreur ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.error || "Une erreur est survenue");
      }

      const data = await response.json();

      // Extraire le token du header Authorization si présent
      // Note: Pour que cela fonctionne, le backend doit exposer le header Authorization dans CORS
      // Sinon, le backend devrait retourner le token dans le body de la réponse
      try {
        const authHeader = response.headers.get("Authorization");
        if (authHeader && typeof window !== "undefined") {
          const token = authHeader.replace("Bearer ", "");
          localStorage.setItem("session_token", token);
        }
      } catch {
        // Les headers peuvent ne pas être accessibles à cause de CORS
        // Dans ce cas, le backend devrait retourner le token dans le body
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erreur de connexion au serveur");
    }
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  },
};
