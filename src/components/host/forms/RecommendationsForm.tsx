"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Property, UpdatePropertyRequest, LocalRecommendations, Recommendation, RecommendationCategory } from "@/types";

const RECOMMENDATION_CATEGORIES: { value: RecommendationCategory; label: string }[] = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café" },
  { value: "bar", label: "Bar" },
  { value: "bakery", label: "Boulangerie" },
  { value: "grocery", label: "Supermarché" },
  { value: "market", label: "Marché" },
  { value: "pharmacy", label: "Pharmacie" },
  { value: "doctor", label: "Médecin" },
  { value: "hospital", label: "Hôpital" },
  { value: "attraction", label: "Attraction" },
  { value: "beach", label: "Plage" },
  { value: "park", label: "Parc" },
  { value: "sport", label: "Sport" },
  { value: "shopping", label: "Shopping" },
  { value: "nightlife", label: "Vie nocturne" },
  { value: "culture", label: "Culture" },
  { value: "other", label: "Autre" },
];

interface RecommendationsFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function RecommendationsForm({ property, onSave, isSaving, onDirtyChange, formRef }: RecommendationsFormProps) {
  const [localRecommendations, setLocalRecommendations] = useState<Recommendation[]>(
    property.localRecommendations?.recommendations ?? []
  );
  
  const form = useForm<{ enabled: boolean }>({
    defaultValues: {
      enabled: property.localRecommendations?.enabled ?? false,
    },
  });

  const { watch, setValue, formState: { isDirty: formIsDirty } } = form;
  const enabled = watch("enabled");
  const [recsChanged, setRecsChanged] = useState(false);

  useEffect(() => {
    onDirtyChange(formIsDirty || recsChanged);
  }, [formIsDirty, recsChanged, onDirtyChange]);

  const handleAddRecommendation = () => {
    const newRec: Recommendation = {
      id: uuidv4(),
      category: "restaurant",
      name: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      distance: "",
    };
    setLocalRecommendations([...localRecommendations, newRec]);
    setRecsChanged(true);
  };

  const handleRemoveRecommendation = (id: string) => {
    setLocalRecommendations(localRecommendations.filter((r) => r.id !== id));
    setRecsChanged(true);
  };

  const handleRecommendationChange = (id: string, field: keyof Recommendation, value: string | number) => {
    setLocalRecommendations(localRecommendations.map((r) => 
      r.id === id ? { ...r, [field]: value } : r
    ));
    setRecsChanged(true);
  };

  const onSubmit = async () => {
    const cleanedRecs = localRecommendations
      .filter((r) => r.name)
      .map((r) => ({
        ...r,
        description: r.description || undefined,
        address: r.address || undefined,
        phone: r.phone || undefined,
        website: r.website || undefined,
        distance: r.distance || undefined,
        rating: r.rating || undefined,
      }));
    
    const cleanedData: LocalRecommendations = {
      enabled: enabled,
      recommendations: cleanedRecs,
    };
    
    await onSave({ localRecommendations: cleanedData });
    setRecsChanged(false);
  };

  const groupedRecs = localRecommendations.reduce<Record<string, Recommendation[]>>((acc, rec) => {
    const cat = rec.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(rec);
    return acc;
  }, {});

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recommandations locales</CardTitle>
              <CardDescription>Vos bonnes adresses à partager</CardDescription>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked, { shouldDirty: true })}
              disabled={isSaving}
            />
          </div>
        </CardHeader>
        {enabled && (
          <CardContent className="space-y-6">
            {Object.entries(groupedRecs).map(([category, recs]) => {
              const categoryLabel = RECOMMENDATION_CATEGORIES.find((c) => c.value === category)?.label || category;
              return (
                <div key={category} className="space-y-4">
                  <Label className="text-lg font-semibold">{categoryLabel}</Label>
                  {recs.map((rec) => (
                    <Card key={rec.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <Select
                          value={rec.category}
                          onValueChange={(value) => handleRecommendationChange(rec.id, "category", value)}
                          disabled={isSaving}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {RECOMMENDATION_CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRecommendation(rec.id)}
                          disabled={isSaving}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nom</Label>
                            <Input
                              value={rec.name}
                              onChange={(e) => handleRecommendationChange(rec.id, "name", e.target.value)}
                              placeholder="Nom du lieu"
                              disabled={isSaving}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Distance</Label>
                            <Input
                              value={rec.distance || ""}
                              onChange={(e) => handleRecommendationChange(rec.id, "distance", e.target.value)}
                              placeholder="Ex: 5 min à pied"
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={rec.description || ""}
                            onChange={(e) => handleRecommendationChange(rec.id, "description", e.target.value)}
                            placeholder="Pourquoi vous le recommandez..."
                            rows={2}
                            disabled={isSaving}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Adresse</Label>
                            <Input
                              value={rec.address || ""}
                              onChange={(e) => handleRecommendationChange(rec.id, "address", e.target.value)}
                              disabled={isSaving}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <Input
                              value={rec.phone || ""}
                              onChange={(e) => handleRecommendationChange(rec.id, "phone", e.target.value)}
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Site web</Label>
                          <Input
                            value={rec.website || ""}
                            onChange={(e) => handleRecommendationChange(rec.id, "website", e.target.value)}
                            placeholder="https://..."
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })}

            {localRecommendations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune recommandation ajoutée
              </p>
            )}

            <Button type="button" variant="outline" onClick={handleAddRecommendation} disabled={isSaving} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une recommandation
            </Button>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving || (!formIsDirty && !recsChanged)}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </div>
    </form>
  );
}
