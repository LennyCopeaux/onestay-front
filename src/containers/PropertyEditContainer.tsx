"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, ExternalLink, Loader2 } from "lucide-react";

import { authService } from "@/lib/auth-mock";
import { api } from "@/lib/api";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryNav, type CategoryId } from "@/components/host/CategoryNav";
import { UnsavedChangesDialog } from "@/components/host/UnsavedChangesDialog";
import { GeneralInfoForm } from "@/components/host/forms/GeneralInfoForm";
import { CheckInOutForm } from "@/components/host/forms/CheckInOutForm";
import { WifiForm } from "@/components/host/forms/WifiForm";
import { EquipmentForm } from "@/components/host/forms/EquipmentForm";
import { RulesForm } from "@/components/host/forms/RulesForm";
import { InstructionsForm } from "@/components/host/forms/InstructionsForm";
import { ParkingForm } from "@/components/host/forms/ParkingForm";
import { TransportForm } from "@/components/host/forms/TransportForm";
import { SecurityForm } from "@/components/host/forms/SecurityForm";
import { ServicesForm } from "@/components/host/forms/ServicesForm";
import { BabyKidsForm } from "@/components/host/forms/BabyKidsForm";
import { PetsForm } from "@/components/host/forms/PetsForm";
import { EntertainmentForm } from "@/components/host/forms/EntertainmentForm";
import { OutdoorForm } from "@/components/host/forms/OutdoorForm";
import { NeighborhoodForm } from "@/components/host/forms/NeighborhoodForm";
import { EmergencyForm } from "@/components/host/forms/EmergencyForm";
import { ContactsForm } from "@/components/host/forms/ContactsForm";
import { RecommendationsForm } from "@/components/host/forms/RecommendationsForm";
import type { Property, UpdatePropertyRequest } from "@/types";

interface PropertyEditContainerProps {
  propertyId: string;
}

export function PropertyEditContainer({ propertyId }: PropertyEditContainerProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("general");
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const pendingCategoryRef = useRef<CategoryId | null>(null);
  const currentFormRef = useRef<HTMLFormElement | null>(null);

  const loadProperty = useCallback(async () => {
    try {
      const data = await api.getProperty(propertyId);
      setProperty(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du chargement");
      router.push("/dashboard");
    }
  }, [propertyId, router]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || !authService.isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadProperty().finally(() => setIsLoading(false));
  }, [router, loadProperty]);

  const handleSave = async (data: UpdatePropertyRequest) => {
    if (!property) return;
    setIsSaving(true);
    try {
      const updated = await api.updateProperty(property._id, data);
      setProperty(updated);
      setIsDirty(false);
      toast.success("Modifications enregistrées");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la sauvegarde");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategoryChange = (newCategory: CategoryId) => {
    if (isDirty) {
      pendingCategoryRef.current = newCategory;
      setShowUnsavedDialog(true);
    } else {
      setActiveCategory(newCategory);
    }
  };

  const handleDialogSave = () => {
    if (currentFormRef.current) {
      currentFormRef.current.requestSubmit();
    }
    setShowUnsavedDialog(false);
    if (pendingCategoryRef.current) {
      setTimeout(() => {
        setActiveCategory(pendingCategoryRef.current!);
        pendingCategoryRef.current = null;
      }, 100);
    }
  };

  const handleDialogDiscard = () => {
    setShowUnsavedDialog(false);
    setIsDirty(false);
    if (pendingCategoryRef.current) {
      setActiveCategory(pendingCategoryRef.current);
      pendingCategoryRef.current = null;
    }
    loadProperty();
  };

  const handleDialogCancel = () => {
    setShowUnsavedDialog(false);
    pendingCategoryRef.current = null;
  };

  const handlePublish = async () => {
    if (!property) return;
    setIsPublishing(true);
    try {
      const updated = await api.publishProperty(property._id);
      setProperty(updated);
      toast.success("Bien publié avec succès");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la publication");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleViewPublic = () => {
    if (!property) return;
    window.open(`/p/${property.slug}`, "_blank");
  };

  if (isLoading || !property) {
    return <LoadingScreen />;
  }

  const isPublished = property.status === 2;

  const enabledCategories: Record<CategoryId, boolean> = {
    general: true,
    checkinout: property.checkInOut?.enabled ?? false,
    wifi: property.wifi?.enabled ?? false,
    equipment: property.equipment?.enabled ?? false,
    rules: property.rules?.enabled ?? false,
    instructions: property.instructions?.enabled ?? false,
    parking: property.parking?.enabled ?? false,
    transport: property.transport?.enabled ?? false,
    security: property.security?.enabled ?? false,
    services: property.services?.enabled ?? false,
    babykids: property.babyKids?.enabled ?? false,
    pets: property.pets?.enabled ?? false,
    entertainment: property.entertainment?.enabled ?? false,
    outdoor: property.outdoor?.enabled ?? false,
    neighborhood: property.neighborhood?.enabled ?? false,
    emergency: property.emergency?.enabled ?? false,
    contacts: property.contacts?.enabled ?? false,
    recommendations: property.localRecommendations?.enabled ?? false,
  };

  const commonFormProps = {
    property,
    onSave: handleSave,
    isSaving,
    onDirtyChange: setIsDirty,
    formRef: currentFormRef,
  };

  const renderForm = () => {
    switch (activeCategory) {
      case "general": return <GeneralInfoForm {...commonFormProps} />;
      case "checkinout": return <CheckInOutForm {...commonFormProps} />;
      case "wifi": return <WifiForm {...commonFormProps} />;
      case "equipment": return <EquipmentForm {...commonFormProps} />;
      case "rules": return <RulesForm {...commonFormProps} />;
      case "instructions": return <InstructionsForm {...commonFormProps} />;
      case "parking": return <ParkingForm {...commonFormProps} />;
      case "transport": return <TransportForm {...commonFormProps} />;
      case "security": return <SecurityForm {...commonFormProps} />;
      case "services": return <ServicesForm {...commonFormProps} />;
      case "babykids": return <BabyKidsForm {...commonFormProps} />;
      case "pets": return <PetsForm {...commonFormProps} />;
      case "entertainment": return <EntertainmentForm {...commonFormProps} />;
      case "outdoor": return <OutdoorForm {...commonFormProps} />;
      case "neighborhood": return <NeighborhoodForm {...commonFormProps} />;
      case "emergency": return <EmergencyForm {...commonFormProps} />;
      case "contacts": return <ContactsForm {...commonFormProps} />;
      case "recommendations": return <RecommendationsForm {...commonFormProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">{property.name}</h1>
                <Badge variant={isPublished ? "default" : "secondary"}>
                  {isPublished ? "Publié" : "Brouillon"}
                </Badge>
                {isDirty && (
                  <Badge variant="outline" className="text-orange-500 border-orange-500">
                    Non sauvegardé
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{property.city}, {property.country}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPublished && (
              <Button variant="outline" size="sm" onClick={handleViewPublic}>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Voir la page</span>
              </Button>
            )}
            {isPublished ? (
              <Button variant="outline" size="sm" disabled>
                <EyeOff className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Publié</span>
              </Button>
            ) : (
              <Button size="sm" onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                <span className="hidden sm:inline">Publier</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <CategoryNav
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          enabledCategories={enabledCategories}
        />

        <div className="max-w-3xl mx-auto">
          {renderForm()}
        </div>
      </main>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onSave={handleDialogSave}
        onDiscard={handleDialogDiscard}
        onCancel={handleDialogCancel}
      />
    </div>
  );
}
