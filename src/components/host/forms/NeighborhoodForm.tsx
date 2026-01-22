"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Property, UpdatePropertyRequest, Neighborhood, NoiseLevel } from "@/types";

const NOISE_LEVELS: { value: NoiseLevel; label: string }[] = [
  { value: "quiet", label: "Calme" },
  { value: "moderate", label: "Modéré" },
  { value: "lively", label: "Animé" },
];

interface NeighborhoodFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function NeighborhoodForm({ property, onSave, isSaving, onDirtyChange, formRef }: NeighborhoodFormProps) {
  const form = useForm<Neighborhood>({
    defaultValues: {
      enabled: property.neighborhood?.enabled ?? false,
      description: property.neighborhood?.description ?? "",
      noiseLevel: property.neighborhood?.noiseLevel ?? "moderate",
      neighborInfo: property.neighborhood?.neighborInfo ?? "",
      nearbyAttractions: property.neighborhood?.nearbyAttractions ?? "",
      safetyTips: property.neighborhood?.safetyTips ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: Neighborhood) => {
    const cleanedData: Neighborhood = {
      enabled: data.enabled,
      description: data.description || undefined,
      noiseLevel: data.noiseLevel || undefined,
      neighborInfo: data.neighborInfo || undefined,
      nearbyAttractions: data.nearbyAttractions || undefined,
      safetyTips: data.safetyTips || undefined,
    };
    await onSave({ neighborhood: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quartier</CardTitle>
              <CardDescription>Informations sur le quartier et les environs</CardDescription>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked, { shouldDirty: true })}
              disabled={isSaving}
            />
          </div>
        </CardHeader>
        {enabled && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description du quartier</Label>
              <Textarea 
                id="description" 
                rows={3} 
                placeholder="Ambiance, caractéristiques..."
                {...form.register("description")} 
                disabled={isSaving} 
              />
            </div>

            <div className="space-y-2">
              <Label>Niveau sonore</Label>
              <Select
                value={watch("noiseLevel")}
                onValueChange={(value) => setValue("noiseLevel", value as NoiseLevel, { shouldDirty: true })}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOISE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborInfo">Informations sur les voisins</Label>
              <Textarea 
                id="neighborInfo" 
                rows={2} 
                placeholder="Ce qu'il faut savoir..."
                {...form.register("neighborInfo")} 
                disabled={isSaving} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nearbyAttractions">Attractions à proximité</Label>
              <Textarea 
                id="nearbyAttractions" 
                rows={2} 
                placeholder="Monuments, sites touristiques..."
                {...form.register("nearbyAttractions")} 
                disabled={isSaving} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="safetyTips">Conseils de sécurité</Label>
              <Textarea 
                id="safetyTips" 
                rows={2} 
                placeholder="Zones à éviter, précautions..."
                {...form.register("safetyTips")} 
                disabled={isSaving} 
              />
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving || !isDirty}>
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
