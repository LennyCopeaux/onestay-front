// ==================== LOGEMENT (Backend) ====================

export type LogementStatus = 1 | 2; // 1 = brouillon, 2 = publié

export interface Logement {
  id: string;
  nom_bien: string;
  description: string;
  adresse: string;
  ville: string;
  pays: string;
  user_id: string;
  status: LogementStatus;
  created_at: string;
  updated_at?: string;
}

export interface CreateLogementRequest {
  nom_bien: string;
  description: string;
  adresse: string;
  ville: string;
  pays: string;
}

export interface LogementResponse {
  message: string;
  logement: Logement;
}

export interface LogementsListResponse {
  logements: Logement[];
  count: number;
}

// ==================== AUTH & USERS ====================

export type UserRole = "HOST" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
}

export interface ApiUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface CreateUserRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role_id: string;
}

export interface UpdateUserRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  role_id?: string;
}

export interface ProfileResponse {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  created_at: string;
}

// ==================== PROPERTY DETAILS (Frontend Only - Future Backend) ====================
// Ces types seront utilisés quand le backend sera étendu

export type ContactType = "host" | "concierge" | "cleaning" | "maintenance" | "emergency" | "neighbor" | "other";
export type RecommendationCategory = "restaurant" | "cafe" | "bar" | "bakery" | "grocery" | "market" | "pharmacy" | "doctor" | "hospital" | "attraction" | "beach" | "park" | "sport" | "shopping" | "nightlife" | "culture" | "other";
export type ParkingType = "street" | "garage" | "driveway" | "private" | "public";
export type NoiseLevel = "quiet" | "moderate" | "lively";

export interface PropertyContact {
  id: string;
  type: ContactType;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  distance?: string;
  rating?: number;
}

export interface PropertyEquipment {
  id: string;
  name: string;
  category: "bedroom" | "bathroom" | "kitchen" | "living" | "outdoor" | "baby" | "work" | "other";
}

export interface InstructionItem {
  enabled: boolean;
  content: string;
}
