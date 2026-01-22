"use client";

import { cn } from "@/lib/utils";
import {
  Clock,
  Wifi,
  Package,
  ScrollText,
  ClipboardList,
  Car,
  Bus,
  Shield,
  Sparkles,
  Baby,
  PawPrint,
  Tv,
  Trees,
  MapPin,
  Phone,
  Users,
  Star,
  Home,
} from "lucide-react";

export type CategoryId =
  | "general"
  | "checkinout"
  | "wifi"
  | "equipment"
  | "rules"
  | "instructions"
  | "parking"
  | "transport"
  | "security"
  | "services"
  | "babykids"
  | "pets"
  | "entertainment"
  | "outdoor"
  | "neighborhood"
  | "emergency"
  | "contacts"
  | "recommendations";

interface Category {
  id: CategoryId;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: "general", label: "Général", icon: <Home className="h-5 w-5" />, color: "bg-slate-500" },
  { id: "checkinout", label: "Arrivée / Départ", icon: <Clock className="h-5 w-5" />, color: "bg-blue-500" },
  { id: "wifi", label: "Wi-Fi", icon: <Wifi className="h-5 w-5" />, color: "bg-cyan-500" },
  { id: "equipment", label: "Équipements", icon: <Package className="h-5 w-5" />, color: "bg-purple-500" },
  { id: "rules", label: "Règlement", icon: <ScrollText className="h-5 w-5" />, color: "bg-amber-500" },
  { id: "instructions", label: "Consignes", icon: <ClipboardList className="h-5 w-5" />, color: "bg-orange-500" },
  { id: "parking", label: "Parking", icon: <Car className="h-5 w-5" />, color: "bg-indigo-500" },
  { id: "transport", label: "Transports", icon: <Bus className="h-5 w-5" />, color: "bg-teal-500" },
  { id: "security", label: "Sécurité", icon: <Shield className="h-5 w-5" />, color: "bg-red-500" },
  { id: "services", label: "Services", icon: <Sparkles className="h-5 w-5" />, color: "bg-pink-500" },
  { id: "babykids", label: "Bébé & Enfants", icon: <Baby className="h-5 w-5" />, color: "bg-rose-500" },
  { id: "pets", label: "Animaux", icon: <PawPrint className="h-5 w-5" />, color: "bg-yellow-500" },
  { id: "entertainment", label: "Loisirs", icon: <Tv className="h-5 w-5" />, color: "bg-violet-500" },
  { id: "outdoor", label: "Extérieur", icon: <Trees className="h-5 w-5" />, color: "bg-green-500" },
  { id: "neighborhood", label: "Quartier", icon: <MapPin className="h-5 w-5" />, color: "bg-emerald-500" },
  { id: "emergency", label: "Urgences", icon: <Phone className="h-5 w-5" />, color: "bg-red-600" },
  { id: "contacts", label: "Contacts", icon: <Users className="h-5 w-5" />, color: "bg-sky-500" },
  { id: "recommendations", label: "Adresses", icon: <Star className="h-5 w-5" />, color: "bg-amber-600" },
];

interface CategoryNavProps {
  activeCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
  enabledCategories: Record<CategoryId, boolean>;
}

export function CategoryNav({ activeCategory, onCategoryChange, enabledCategories }: CategoryNavProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          const isEnabled = enabledCategories[category.id];
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border",
                !isEnabled && category.id !== "general" && "opacity-50"
              )}
            >
              <span className={cn(
                "p-1 rounded-full text-white",
                isActive ? "bg-white/20" : category.color
              )}>
                {category.icon}
              </span>
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { CATEGORIES };
