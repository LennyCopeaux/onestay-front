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

// ==================== PROPERTY (Backend) ====================

// Status: 1 = brouillon, 2 = publié
export type PropertyStatus = 1 | 2;
export type ContactType = "host" | "concierge" | "cleaning" | "maintenance" | "emergency" | "neighbor" | "other";
export type RecommendationCategory = "restaurant" | "cafe" | "bar" | "bakery" | "grocery" | "market" | "pharmacy" | "doctor" | "hospital" | "attraction" | "beach" | "park" | "sport" | "shopping" | "nightlife" | "culture" | "other";
export type ParkingType = "street" | "garage" | "driveway" | "private" | "public";
export type NoiseLevel = "quiet" | "moderate" | "lively";
export type EquipmentCategory = "bedroom" | "bathroom" | "kitchen" | "living" | "outdoor" | "baby" | "work" | "other";

// Sub-documents
export interface CheckInOut {
  enabled: boolean;
  checkInTime: string;
  checkOutTime: string;
  selfCheckIn?: boolean;
  earlyCheckIn?: boolean;
  lateCheckOut?: boolean;
  checkInInstructions?: string;
  checkOutInstructions?: string;
  keyLocation?: string;
  accessCode?: string;
  lockboxCode?: string;
  buildingCode?: string;
  intercomCode?: string;
  parkingCode?: string;
  gateCode?: string;
}

export interface Wifi {
  enabled: boolean;
  networkName?: string;
  password?: string;
  routerLocation?: string;
  resetInstructions?: string;
  notes?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
}

export interface Equipment {
  enabled: boolean;
  items: EquipmentItem[];
}

export interface InstructionItem {
  enabled: boolean;
  content?: string;
}

export interface Instructions {
  enabled: boolean;
  trash?: InstructionItem;
  heating?: InstructionItem;
  airConditioning?: InstructionItem;
  hotWater?: InstructionItem;
  appliances?: InstructionItem;
  laundry?: InstructionItem;
  dishwasher?: InstructionItem;
  oven?: InstructionItem;
  coffeeMachine?: InstructionItem;
  television?: InstructionItem;
  sound?: InstructionItem;
  blinds?: InstructionItem;
  alarm?: InstructionItem;
  safe?: InstructionItem;
  pool?: InstructionItem;
  spa?: InstructionItem;
  garden?: InstructionItem;
  barbecue?: InstructionItem;
  fireplace?: InstructionItem;
  other?: InstructionItem;
}

export interface Rules {
  enabled: boolean;
  smokingAllowed: boolean;
  petsAllowed: boolean;
  partiesAllowed: boolean;
  childrenAllowed: boolean;
  maxGuests?: number;
  quietHours?: string;
  houseRules?: string[];
  additionalRules?: string;
}

export interface Contact {
  id: string;
  type: ContactType;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface Contacts {
  enabled: boolean;
  contacts: Contact[];
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

export interface LocalRecommendations {
  enabled: boolean;
  recommendations: Recommendation[];
}

export interface Parking {
  enabled: boolean;
  available?: boolean;
  type?: ParkingType;
  free?: boolean;
  price?: string;
  instructions?: string;
  accessCode?: string;
}

export interface Transport {
  enabled: boolean;
  nearestBus?: string;
  nearestMetro?: string;
  nearestTrain?: string;
  nearestTram?: string;
  taxiInfo?: string;
  bikeRental?: string;
  carRental?: string;
  airportShuttle?: string;
  walkingInfo?: string;
}

export interface Security {
  enabled: boolean;
  hasAlarm?: boolean;
  alarmCode?: string;
  alarmInstructions?: string;
  hasSafe?: boolean;
  safeCode?: string;
  safeLocation?: string;
  hasFireExtinguisher?: boolean;
  fireExtinguisherLocation?: string;
  hasFirstAidKit?: boolean;
  firstAidKitLocation?: string;
  hasSmokeDetector?: boolean;
  hasCarbonMonoxideDetector?: boolean;
  securityNotes?: string;
}

export interface Services {
  enabled: boolean;
  linensIncluded?: boolean;
  towelsIncluded?: boolean;
  toiletryIncluded?: boolean;
  cleaningIncluded?: boolean;
  cleaningFrequency?: string;
  breakfastIncluded?: boolean;
  breakfastDetails?: string;
  conciergeService?: string;
  groceryDelivery?: string;
  luggageStorage?: boolean;
  laundryService?: boolean;
}

export interface BabyKids {
  enabled: boolean;
  hasCrib?: boolean;
  hasHighChair?: boolean;
  hasBabyGate?: boolean;
  hasChildProofing?: boolean;
  kidsToysAvailable?: boolean;
  nearbyPlaygrounds?: string;
  babysitterContact?: string;
  additionalInfo?: string;
}

export interface Pets {
  enabled: boolean;
  petsAllowed?: boolean;
  petFee?: string;
  petRules?: string;
  dogWalkingAreas?: string;
  nearbyVet?: string;
  nearbyPetStore?: string;
  petEquipmentAvailable?: string;
}

export interface Entertainment {
  enabled: boolean;
  hasTv?: boolean;
  tvChannels?: string;
  hasNetflix?: boolean;
  netflixInstructions?: string;
  hasSpotify?: boolean;
  spotifyInstructions?: string;
  hasGameConsole?: boolean;
  gameConsoleDetails?: string;
  boardGames?: string;
  books?: string;
}

export interface Outdoor {
  enabled: boolean;
  hasGarden?: boolean;
  gardenInfo?: string;
  hasTerrace?: boolean;
  terraceInfo?: string;
  hasBalcony?: boolean;
  balconyInfo?: string;
  hasPool?: boolean;
  poolInfo?: string;
  poolRules?: string;
  hasSpa?: boolean;
  spaInfo?: string;
  hasBarbecue?: boolean;
  barbecueInfo?: string;
}

export interface Neighborhood {
  enabled: boolean;
  description?: string;
  noiseLevel?: NoiseLevel;
  neighborInfo?: string;
  nearbyAttractions?: string;
  safetyTips?: string;
}

export interface Emergency {
  enabled: boolean;
  emergencyNumber?: string;
  policeNumber?: string;
  fireNumber?: string;
  ambulanceNumber?: string;
  nearestHospital?: string;
  nearestHospitalAddress?: string;
  nearestPharmacy?: string;
  nearestPharmacyHours?: string;
  doctorOnCall?: string;
  additionalEmergencyInfo?: string;
}

// Main Property type
export interface Property {
  _id: string;
  hostId: string;
  status: PropertyStatus; // 1 = brouillon, 2 = publié
  slug: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  zipCode?: string;
  images?: string[];
  checkInOut: CheckInOut;
  wifi: Wifi;
  equipment: Equipment;
  instructions: Instructions;
  rules: Rules;
  contacts: Contacts;
  localRecommendations: LocalRecommendations;
  parking: Parking;
  transport: Transport;
  security: Security;
  services: Services;
  babyKids: BabyKids;
  pets: Pets;
  entertainment: Entertainment;
  outdoor: Outdoor;
  neighborhood: Neighborhood;
  emergency: Emergency;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Create Property Request
export interface CreatePropertyRequest {
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  zipCode?: string;
  images?: string[];
}

// Update Property Request (all optional)
export interface UpdatePropertyRequest {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  images?: string[];
  checkInOut?: CheckInOut;
  wifi?: Wifi;
  equipment?: Equipment;
  instructions?: Instructions;
  rules?: Rules;
  contacts?: Contacts;
  localRecommendations?: LocalRecommendations;
  parking?: Parking;
  transport?: Transport;
  security?: Security;
  services?: Services;
  babyKids?: BabyKids;
  pets?: Pets;
  entertainment?: Entertainment;
  outdoor?: Outdoor;
  neighborhood?: Neighborhood;
  emergency?: Emergency;
}

// API Responses
export interface PropertyResponse {
  message?: string;
  property: Property;
}

export interface PropertiesListResponse {
  properties: Property[];
  count: number;
}
