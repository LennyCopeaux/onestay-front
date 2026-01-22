"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import { authService } from "@/lib/auth-mock";
import { api } from "@/lib/api";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Logement } from "@/types";

interface PropertyEditContainerProps {
  propertyId: string;
}

export function PropertyEditContainer({ propertyId }: PropertyEditContainerProps) {
  const router = useRouter();
  const [logement, setLogement] = useState<Logement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [nomBien, setNomBien] = useState("");
  const [description, setDescription] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");

  const loadLogement = useCallback(async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }
      
      const logements = await api.getLogementsByUser(user.id);
      const found = logements.find((l) => l.id === propertyId);
      
      if (!found) {
        toast.error("Bien introuvable");
        router.push("/dashboard");
        return;
      }
      
      setLogement(found);
      setNomBien(found.nom_bien);
      setDescription(found.description);
      setAdresse(found.adresse);
      setVille(found.ville);
      setPays(found.pays);
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
    loadLogement().finally(() => setIsLoading(false));
  }, [router, loadLogement]);

  const handleSave = async () => {
    if (!logement) return;
    setIsSaving(true);
    try {
      // TODO: Implémenter PUT /api/v1/logements/:id côté backend
      toast.info("Modification non disponible pour le moment (backend à implémenter)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !logement) {
    return <LoadingScreen />;
  }

  const isPublished = logement.status === 2;

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
                <h1 className="font-semibold">{logement.nom_bien}</h1>
                <Badge variant={isPublished ? "default" : "secondary"}>
                  {isPublished ? "Publié" : "Brouillon"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{logement.ville}, {logement.pays}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Enregistrer
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Les informations de base de votre bien
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom_bien">Nom du bien</Label>
                <Input
                  id="nom_bien"
                  value={nomBien}
                  onChange={(e) => setNomBien(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pays">Pays</Label>
                  <Input
                    id="pays"
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Catégories détaillées</CardTitle>
              <CardDescription>
                Ces fonctionnalités seront disponibles une fois le backend étendu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  "Arrivée/Départ", "Wi-Fi", "Équipements", "Règlement", "Consignes",
                  "Parking", "Transports", "Sécurité", "Services", "Divertissement",
                  "Extérieur", "Bébé/Enfants", "Animaux", "Quartier", "Urgences",
                  "Contacts", "Recommandations"
                ].map((cat) => (
                  <div
                    key={cat}
                    className="p-3 rounded-lg border bg-muted/50 text-center text-sm text-muted-foreground"
                  >
                    {cat}
                    <p className="text-xs mt-1">Bientôt disponible</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
