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
import type { Property, UpdatePropertyRequest, BabyKids } from "@/types";

interface BabyKidsFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function BabyKidsForm({ property, onSave, isSaving, onDirtyChange, formRef }: BabyKidsFormProps) {
  const form = useForm<BabyKids>({
    defaultValues: {
      enabled: property.babyKids?.enabled ?? false,
      hasCrib: property.babyKids?.hasCrib ?? false,
      hasHighChair: property.babyKids?.hasHighChair ?? false,
      hasBabyGate: property.babyKids?.hasBabyGate ?? false,
      hasChildProofing: property.babyKids?.hasChildProofing ?? false,
      kidsToysAvailable: property.babyKids?.kidsToysAvailable ?? false,
      nearbyPlaygrounds: property.babyKids?.nearbyPlaygrounds ?? "",
      babysitterContact: property.babyKids?.babysitterContact ?? "",
      additionalInfo: property.babyKids?.additionalInfo ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: BabyKids) => {
    const cleanedData: BabyKids = {
      enabled: data.enabled,
      hasCrib: data.hasCrib,
      hasHighChair: data.hasHighChair,
      hasBabyGate: data.hasBabyGate,
      hasChildProofing: data.hasChildProofing,
      kidsToysAvailable: data.kidsToysAvailable,
      nearbyPlaygrounds: data.nearbyPlaygrounds || undefined,
      babysitterContact: data.babysitterContact || undefined,
      additionalInfo: data.additionalInfo || undefined,
    };
    await onSave({ babyKids: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bébé & Enfants</CardTitle>
              <CardDescription>Équipements et informations pour les familles</CardDescription>
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
            <div className="flex items-center justify-between">
              <Label>Lit bébé disponible</Label>
              <Switch
                checked={watch("hasCrib")}
                onCheckedChange={(checked) => setValue("hasCrib", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Chaise haute disponible</Label>
              <Switch
                checked={watch("hasHighChair")}
                onCheckedChange={(checked) => setValue("hasHighChair", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Barrière de sécurité</Label>
              <Switch
                checked={watch("hasBabyGate")}
                onCheckedChange={(checked) => setValue("hasBabyGate", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Protection enfants (prises, etc.)</Label>
              <Switch
                checked={watch("hasChildProofing")}
                onCheckedChange={(checked) => setValue("hasChildProofing", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Jouets pour enfants</Label>
              <Switch
                checked={watch("kidsToysAvailable")}
                onCheckedChange={(checked) => setValue("kidsToysAvailable", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nearbyPlaygrounds">Aires de jeux à proximité</Label>
              <Input 
                id="nearbyPlaygrounds" 
                placeholder="Nom et adresse..."
                {...form.register("nearbyPlaygrounds")} 
                disabled={isSaving} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="babysitterContact">Contact baby-sitter</Label>
              <Input 
                id="babysitterContact" 
                placeholder="Nom et numéro..."
                {...form.register("babysitterContact")} 
                disabled={isSaving} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Informations supplémentaires</Label>
              <Textarea 
                id="additionalInfo" 
                rows={3} 
                {...form.register("additionalInfo")} 
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
