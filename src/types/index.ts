export type PropertyStatus = "draft" | "published";

export type AmenityCategory = 
  | "essentials"
  | "features"
  | "safety"
  | "entertainment"
  | "kitchen"
  | "bathroom"
  | "bedroom"
  | "outdoor"
  | "other";

export type ContactType = 
  | "host"
  | "property_manager"
  | "emergency"
  | "maintenance"
  | "cleaning"
  | "other";

export type RecommendationCategory = 
  | "restaurant"
  | "cafe"
  | "bar"
  | "attraction"
  | "shopping"
  | "grocery"
  | "pharmacy"
  | "transportation"
  | "other";

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  icon?: string;
}

export interface Contact {
  id: string;
  type: ContactType;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface LocalRecommendation {
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

export interface WiFiInfo {
  networkName: string;
  password: string;
  notes?: string;
}

export interface CheckInOutInfo {
  checkInTime: string;
  checkOutTime: string;
  checkInInstructions?: string;
  checkOutInstructions?: string;
  keyLocation?: string;
  accessCode?: string;
}

export interface PropertyRules {
  houseRules: string[];
  smokingAllowed: boolean;
  petsAllowed: boolean;
  partiesAllowed: boolean;
  quietHours?: string;
  additionalRules?: string;
}

export interface Property {
  id: string;
  status: PropertyStatus;
  name: string;
  description?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  checkInOut: CheckInOutInfo;
  wifi: WiFiInfo;
  amenities: Amenity[];
  rules: PropertyRules;
  contacts: Contact[];
  localRecommendations: LocalRecommendation[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

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
