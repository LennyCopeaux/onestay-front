"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Home } from "lucide-react";

import { authService } from "@/lib/auth-mock";
import { api } from "@/lib/api";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { HostHeader } from "@/components/host/HostHeader";
import { PropertyCard } from "@/components/host/PropertyCard";
import { CreatePropertyDialog } from "@/components/host/CreatePropertyDialog";
import { DeletePropertyDialog } from "@/components/host/DeletePropertyDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { User, Property, CreatePropertyRequest } from "@/types";

export function HostDashboardContainer() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const loadProperties = useCallback(async (userId: string) => {
    try {
      const data = await api.getPropertiesByUser(userId);
      setProperties(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du chargement des biens");
    }
  }, []);

  useEffect(() => {
    const user = authService.getCurrentUser();
    
    if (!user || !authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (user.role === "ADMIN") {
      router.push("/admin");
      return;
    }

    setCurrentUser(user);
    loadProperties(user.id).finally(() => setIsLoading(false));
  }, [router, loadProperties]);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const handleCreateProperty = async (data: CreatePropertyRequest) => {
    try {
      const newProperty = await api.createProperty(data);
      toast.success("Bien créé avec succès");
      if (currentUser) {
        await loadProperties(currentUser.id);
      }
      router.push(`/dashboard/properties/${newProperty._id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
      throw error;
    }
  };

  const handleEditProperty = (property: Property) => {
    router.push(`/dashboard/properties/${property._id}`);
  };

  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProperty = async (propertyId: string) => {
    try {
      await api.deleteProperty(propertyId);
      toast.success("Bien supprimé avec succès");
      if (currentUser) {
        await loadProperties(currentUser.id);
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
      throw error;
    }
  };

  const handlePublishProperty = async (property: Property) => {
    try {
      await api.publishProperty(property._id);
      toast.success("Bien publié avec succès");
      if (currentUser) {
        await loadProperties(currentUser.id);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la publication");
    }
  };

  const handleUnpublishProperty = async (property: Property) => {
    try {
      await api.updateProperty(property._id, { });
      toast.info("Dépublication non disponible pour le moment");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la dépublication");
    }
  };

  const handleCopyLink = (property: Property) => {
    const url = `${window.location.origin}/p/${property.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Lien copié dans le presse-papiers");
  };

  const handleViewPublic = (property: Property) => {
    window.open(`/p/${property.slug}`, "_blank");
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const publishedCount = properties.filter((p) => p.status === 2).length;
  const draftCount = properties.filter((p) => p.status === 1).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HostHeader userName={currentUser?.name || ""} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mes biens</h2>
            <p className="text-muted-foreground">
              Gérez vos locations et partagez les informations avec vos voyageurs
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un bien
          </Button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
              <p className="text-xs text-muted-foreground">bien(s) enregistré(s)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Publiés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
              <p className="text-xs text-muted-foreground">page(s) accessible(s)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{draftCount}</div>
              <p className="text-xs text-muted-foreground">en attente de publication</p>
            </CardContent>
          </Card>
        </div>

        {properties.length === 0 ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Home className="mb-4 h-12 w-12 text-muted-foreground" />
              <CardTitle className="mb-2">Aucun bien enregistré</CardTitle>
              <CardDescription className="mb-4">
                Commencez par ajouter votre premier bien pour créer une page d&apos;informations pour vos voyageurs.
              </CardDescription>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter mon premier bien
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
                onPublish={handlePublishProperty}
                onUnpublish={handleUnpublishProperty}
                onCopyLink={handleCopyLink}
                onViewPublic={handleViewPublic}
              />
            ))}
          </div>
        )}
      </main>

      <CreatePropertyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateProperty}
      />

      <DeletePropertyDialog
        property={propertyToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteProperty}
      />
    </div>
  );
}
