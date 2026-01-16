/**
 * Property Status
 */
export type PropertyStatus = "draft" | "published";

/**
 * Amenity Category
 */
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

/**
 * Contact Type
 */
export type ContactType = 
  | "host"
  | "property_manager"
  | "emergency"
  | "maintenance"
  | "cleaning"
  | "other";

/**
 * Local Recommendation Category
 */
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

/**
 * Amenity Interface
 */
export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  icon?: string; // Optional icon identifier
}

/**
 * Contact Interface
 */
export interface Contact {
  id: string;
  type: ContactType;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}

/**
 * Local Recommendation Interface
 */
export interface LocalRecommendation {
  id: string;
  category: RecommendationCategory;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  distance?: string; // e.g., "0.5 miles"
  rating?: number; // 1-5
}

/**
 * WiFi Information Interface
 */
export interface WiFiInfo {
  networkName: string;
  password: string;
  notes?: string;
}

/**
 * Check-in/Check-out Information Interface
 */
export interface CheckInOutInfo {
  checkInTime: string; // e.g., "3:00 PM"
  checkOutTime: string; // e.g., "11:00 AM"
  checkInInstructions?: string;
  checkOutInstructions?: string;
  keyLocation?: string; // Where to find keys/codes
  accessCode?: string; // Door code, lockbox code, etc.
}

/**
 * Property Rules Interface
 */
export interface PropertyRules {
  houseRules: string[]; // Array of rule strings
  smokingAllowed: boolean;
  petsAllowed: boolean;
  partiesAllowed: boolean;
  quietHours?: string; // e.g., "10 PM - 8 AM"
  additionalRules?: string;
}

/**
 * Property Interface
 * Main interface representing a rental property
 */
export interface Property {
  id: string;
  status: PropertyStatus;
  
  // General Info
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
  images?: string[]; // URLs or paths to images
  
  // Check-in/Check-out
  checkInOut: CheckInOutInfo;
  
  // WiFi
  wifi: WiFiInfo;
  
  // Amenities
  amenities: Amenity[];
  
  // Rules
  rules: PropertyRules;
  
  // Contacts
  contacts: Contact[];
  
  // Local Recommendations
  localRecommendations: LocalRecommendation[];
  
  // Metadata
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt?: string; // ISO date string (only when status is "published")
}

/**
 * User Role Type
 */
export type UserRole = "HOST" | "ADMIN";

/**
 * User Interface (for Host)
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

/**
 * Auth Credentials Interface
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Auth Response Interface
 */
export interface AuthResponse {
  user: User;
  token?: string; // For simulated auth
}
