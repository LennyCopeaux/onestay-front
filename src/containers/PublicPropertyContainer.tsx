"use client";

import { useEffect, useState } from "react";
import {
  MapPin, Clock, Wifi, Key, Phone, Mail, Star, Coffee, Utensils, ShoppingBag,
  Bus, Pill, ArrowLeft, Package, ScrollText, ClipboardList,
  Users, X, Car, Shield, Sparkles, Baby, PawPrint, Tv, Trees, Check, Ban
} from "lucide-react";

import { api } from "@/lib/api";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Property, RecommendationCategory, ContactType } from "@/types";

interface PublicPropertyContainerProps {
  slug: string;
}

type SectionId = "checkinout" | "wifi" | "equipment" | "rules" | "instructions" | "parking" | "transport" | "security" | "services" | "entertainment" | "outdoor" | "babykids" | "pets" | "neighborhood" | "emergency" | "contacts" | "recommendations";

interface Section {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  color: string;
  isEnabled: (p: Property) => boolean;
}

const SECTIONS: Section[] = [
  { id: "checkinout", label: "Arrivée", icon: <Clock className="h-6 w-6" />, color: "bg-blue-500", isEnabled: (p) => p.checkInOut?.enabled ?? false },
  { id: "wifi", label: "Wi-Fi", icon: <Wifi className="h-6 w-6" />, color: "bg-cyan-500", isEnabled: (p) => p.wifi?.enabled ?? false },
  { id: "equipment", label: "Équipements", icon: <Package className="h-6 w-6" />, color: "bg-purple-500", isEnabled: (p) => p.equipment?.enabled ?? false },
  { id: "rules", label: "Règlement", icon: <ScrollText className="h-6 w-6" />, color: "bg-amber-500", isEnabled: (p) => p.rules?.enabled ?? false },
  { id: "instructions", label: "Consignes", icon: <ClipboardList className="h-6 w-6" />, color: "bg-orange-500", isEnabled: (p) => p.instructions?.enabled ?? false },
  { id: "parking", label: "Parking", icon: <Car className="h-6 w-6" />, color: "bg-indigo-500", isEnabled: (p) => p.parking?.enabled ?? false },
  { id: "transport", label: "Transports", icon: <Bus className="h-6 w-6" />, color: "bg-teal-500", isEnabled: (p) => p.transport?.enabled ?? false },
  { id: "security", label: "Sécurité", icon: <Shield className="h-6 w-6" />, color: "bg-red-500", isEnabled: (p) => p.security?.enabled ?? false },
  { id: "services", label: "Services", icon: <Sparkles className="h-6 w-6" />, color: "bg-pink-500", isEnabled: (p) => p.services?.enabled ?? false },
  { id: "entertainment", label: "Loisirs", icon: <Tv className="h-6 w-6" />, color: "bg-violet-500", isEnabled: (p) => p.entertainment?.enabled ?? false },
  { id: "outdoor", label: "Extérieur", icon: <Trees className="h-6 w-6" />, color: "bg-green-500", isEnabled: (p) => p.outdoor?.enabled ?? false },
  { id: "babykids", label: "Famille", icon: <Baby className="h-6 w-6" />, color: "bg-rose-500", isEnabled: (p) => p.babyKids?.enabled ?? false },
  { id: "pets", label: "Animaux", icon: <PawPrint className="h-6 w-6" />, color: "bg-yellow-500", isEnabled: (p) => p.pets?.enabled ?? false },
  { id: "neighborhood", label: "Quartier", icon: <MapPin className="h-6 w-6" />, color: "bg-emerald-500", isEnabled: (p) => p.neighborhood?.enabled ?? false },
  { id: "emergency", label: "Urgences", icon: <Phone className="h-6 w-6" />, color: "bg-red-600", isEnabled: (p) => p.emergency?.enabled ?? false },
  { id: "contacts", label: "Contacts", icon: <Users className="h-6 w-6" />, color: "bg-sky-500", isEnabled: (p) => p.contacts?.enabled ?? false },
  { id: "recommendations", label: "Adresses", icon: <Star className="h-6 w-6" />, color: "bg-amber-500", isEnabled: (p) => p.localRecommendations?.enabled ?? false },
];

const CATEGORY_ICONS: Record<RecommendationCategory, React.ReactNode> = {
  restaurant: <Utensils className="h-4 w-4" />,
  cafe: <Coffee className="h-4 w-4" />,
  bar: <Utensils className="h-4 w-4" />,
  bakery: <Utensils className="h-4 w-4" />,
  grocery: <ShoppingBag className="h-4 w-4" />,
  market: <ShoppingBag className="h-4 w-4" />,
  pharmacy: <Pill className="h-4 w-4" />,
  doctor: <Phone className="h-4 w-4" />,
  hospital: <Phone className="h-4 w-4" />,
  attraction: <MapPin className="h-4 w-4" />,
  beach: <MapPin className="h-4 w-4" />,
  park: <Trees className="h-4 w-4" />,
  sport: <MapPin className="h-4 w-4" />,
  shopping: <ShoppingBag className="h-4 w-4" />,
  nightlife: <Star className="h-4 w-4" />,
  culture: <MapPin className="h-4 w-4" />,
  other: <MapPin className="h-4 w-4" />,
};

const CONTACT_LABELS: Record<ContactType, string> = {
  host: "Hôte",
  concierge: "Conciergerie",
  cleaning: "Ménage",
  maintenance: "Maintenance",
  emergency: "Urgences",
  neighbor: "Voisin",
  other: "Contact",
};

export function PublicPropertyContainer({ slug }: PublicPropertyContainerProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  useEffect(() => {
    api.getProperty(slug)
      .then((data) => {
        if (data.status !== 2) {
          setNotFound(true);
        } else {
          setProperty(data);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return <LoadingScreen />;

  if (notFound || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Page introuvable</CardTitle>
            <CardDescription>Ce logement n&apos;existe pas ou n&apos;est pas publié.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const enabledSections = SECTIONS.filter((s) => s.isEnabled(property));

  if (activeSection) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b">
          <div className="flex items-center gap-3 p-4">
            <Button variant="ghost" size="icon" onClick={() => setActiveSection(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">{SECTIONS.find((s) => s.id === activeSection)?.label}</h1>
          </div>
        </header>
        <main className="p-4">
          <SectionContent property={property} sectionId={activeSection} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {property.images && property.images.length > 0 && (
        <div className="relative h-48 w-full overflow-hidden">
          <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <header className="p-6 pb-4">
        <h1 className="text-2xl font-bold">{property.name}</h1>
        <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <MapPin className="h-4 w-4" /> {property.city}, {property.country}
        </p>
        {property.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{property.description}</p>
        )}
      </header>

      <main className="px-4 pb-8">
        {enabledSections.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucune information disponible pour ce logement.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {enabledSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <div className={cn("p-3 rounded-xl text-white", section.color)}>
                  {section.icon}
                </div>
                <span className="text-xs font-medium text-center leading-tight">{section.label}</span>
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground border-t">
        Propulsé par OneStay
      </footer>
    </div>
  );
}

function SectionContent({ property, sectionId }: { property: Property; sectionId: SectionId }) {
  switch (sectionId) {
    case "checkinout":
      return (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between">
                <span>Arrivée</span>
                <span className="font-semibold">{property.checkInOut?.checkInTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Départ</span>
                <span className="font-semibold">{property.checkInOut?.checkOutTime}</span>
              </div>
              {property.checkInOut?.selfCheckIn && (
                <Badge variant="secondary">Arrivée autonome</Badge>
              )}
            </CardContent>
          </Card>
          {property.checkInOut?.checkInInstructions && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Instructions d&apos;arrivée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{property.checkInOut.checkInInstructions}</p>
              </CardContent>
            </Card>
          )}
          {(property.checkInOut?.accessCode || property.checkInOut?.lockboxCode) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Key className="h-4 w-4" /> Codes d&apos;accès
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {property.checkInOut?.accessCode && (
                  <div className="flex justify-between">
                    <span>Code d&apos;accès</span>
                    <code className="bg-muted px-2 py-0.5 rounded">{property.checkInOut.accessCode}</code>
                  </div>
                )}
                {property.checkInOut?.lockboxCode && (
                  <div className="flex justify-between">
                    <span>Code boîte à clés</span>
                    <code className="bg-muted px-2 py-0.5 rounded">{property.checkInOut.lockboxCode}</code>
                  </div>
                )}
                {property.checkInOut?.buildingCode && (
                  <div className="flex justify-between">
                    <span>Code immeuble</span>
                    <code className="bg-muted px-2 py-0.5 rounded">{property.checkInOut.buildingCode}</code>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      );

    case "wifi":
      return (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {property.wifi?.networkName && (
              <div className="flex justify-between items-center">
                <span>Réseau</span>
                <code className="bg-muted px-3 py-1 rounded font-semibold">{property.wifi.networkName}</code>
              </div>
            )}
            {property.wifi?.password && (
              <div className="flex justify-between items-center">
                <span>Mot de passe</span>
                <code className="bg-muted px-3 py-1 rounded font-semibold">{property.wifi.password}</code>
              </div>
            )}
            {property.wifi?.routerLocation && (
              <div>
                <span className="text-sm text-muted-foreground">Routeur: {property.wifi.routerLocation}</span>
              </div>
            )}
          </CardContent>
        </Card>
      );

    case "equipment":
      const groupedEquipment = property.equipment?.items?.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, typeof property.equipment.items>) || {};
      
      return (
        <div className="space-y-4">
          {Object.entries(groupedEquipment).map(([category, items]) => (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <Badge key={item.id} variant="secondary">{item.name}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case "rules":
      return (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span>Fumeur</span>
                {property.rules?.smokingAllowed ? <Check className="h-5 w-5 text-green-500" /> : <Ban className="h-5 w-5 text-red-500" />}
              </div>
              <div className="flex justify-between items-center">
                <span>Animaux</span>
                {property.rules?.petsAllowed ? <Check className="h-5 w-5 text-green-500" /> : <Ban className="h-5 w-5 text-red-500" />}
              </div>
              <div className="flex justify-between items-center">
                <span>Fêtes/Événements</span>
                {property.rules?.partiesAllowed ? <Check className="h-5 w-5 text-green-500" /> : <Ban className="h-5 w-5 text-red-500" />}
              </div>
              <div className="flex justify-between items-center">
                <span>Enfants</span>
                {property.rules?.childrenAllowed ? <Check className="h-5 w-5 text-green-500" /> : <Ban className="h-5 w-5 text-red-500" />}
              </div>
              {property.rules?.maxGuests && (
                <div className="flex justify-between">
                  <span>Voyageurs max.</span>
                  <span className="font-semibold">{property.rules.maxGuests}</span>
                </div>
              )}
              {property.rules?.quietHours && (
                <div className="flex justify-between">
                  <span>Heures de silence</span>
                  <span className="font-semibold">{property.rules.quietHours}</span>
                </div>
              )}
            </CardContent>
          </Card>
          {property.rules?.houseRules && property.rules.houseRules.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Règles de la maison</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {property.rules.houseRules.map((rule, idx) => (
                    <li key={idx} className="text-sm">• {rule}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      );

    case "contacts":
      return (
        <div className="space-y-3">
          {property.contacts?.contacts?.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <Badge variant="secondary" className="mt-1">{CONTACT_LABELS[contact.type]}</Badge>
                  </div>
                  <div className="text-right text-sm">
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-1 text-primary">
                      <Phone className="h-3 w-3" /> {contact.phone}
                    </a>
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-muted-foreground mt-1">
                        <Mail className="h-3 w-3" /> {contact.email}
                      </a>
                    )}
                  </div>
                </div>
                {contact.notes && <p className="text-sm text-muted-foreground mt-2">{contact.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case "recommendations":
      return (
        <div className="space-y-3">
          {property.localRecommendations?.recommendations?.map((reco) => (
            <Card key={reco.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    {CATEGORY_ICONS[reco.category]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{reco.name}</p>
                      {reco.rating && (
                        <span className="flex items-center gap-0.5 text-sm text-yellow-500">
                          <Star className="h-3 w-3 fill-current" /> {reco.rating}
                        </span>
                      )}
                    </div>
                    {reco.description && <p className="text-sm text-muted-foreground">{reco.description}</p>}
                    {reco.address && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {reco.address} {reco.distance && `(${reco.distance})`}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case "emergency":
      return (
        <div className="space-y-4">
          <Card className="border-red-200">
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between">
                <span>Urgences européennes</span>
                <a href="tel:112" className="font-bold text-red-600">112</a>
              </div>
              {property.emergency?.policeNumber && (
                <div className="flex justify-between">
                  <span>Police</span>
                  <a href={`tel:${property.emergency.policeNumber}`} className="font-semibold">{property.emergency.policeNumber}</a>
                </div>
              )}
              {property.emergency?.fireNumber && (
                <div className="flex justify-between">
                  <span>Pompiers</span>
                  <a href={`tel:${property.emergency.fireNumber}`} className="font-semibold">{property.emergency.fireNumber}</a>
                </div>
              )}
              {property.emergency?.ambulanceNumber && (
                <div className="flex justify-between">
                  <span>SAMU</span>
                  <a href={`tel:${property.emergency.ambulanceNumber}`} className="font-semibold">{property.emergency.ambulanceNumber}</a>
                </div>
              )}
            </CardContent>
          </Card>
          {property.emergency?.nearestHospital && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Hôpital le plus proche</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{property.emergency.nearestHospital}</p>
                {property.emergency.nearestHospitalAddress && (
                  <p className="text-sm text-muted-foreground">{property.emergency.nearestHospitalAddress}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      );

    default:
      return (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Contenu bientôt disponible
          </CardContent>
        </Card>
      );
  }
}
