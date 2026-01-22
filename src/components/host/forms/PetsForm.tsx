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
import type { Property, UpdatePropertyRequest, Pets } from "@/types";

interface PetsFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function PetsForm({ property, onSave, isSaving, onDirtyChange, formRef }: PetsFormProps) {
  const form = useForm<Pets>({
    defaultValues: {
      enabled: property.pets?.enabled ?? false,
      petsAllowed: property.pets?.petsAllowed ?? false,
      petFee: property.pets?.petFee ?? "",
      petRules: property.pets?.petRules ?? "",
      dogWalkingAreas: property.pets?.dogWalkingAreas ?? "",
      nearbyVet: property.pets?.nearbyVet ?? "",
      nearbyPetStore: property.pets?.nearbyPetStore ?? "",
      petEquipmentAvailable: property.pets?.petEquipmentAvailable ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");
  const petsAllowed = watch("petsAllowed");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: Pets) => {
    const cleanedData: Pets = {
      enabled: data.enabled,
      petsAllowed: data.petsAllowed,
      petFee: data.petFee || undefined,
      petRules: data.petRules || undefined,
      dogWalkingAreas: data.dogWalkingAreas || undefined,
      nearbyVet: data.nearbyVet || undefined,
      nearbyPetStore: data.nearbyPetStore || undefined,
      petEquipmentAvailable: data.petEquipmentAvailable || undefined,
    };
    await onSave({ pets: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Animaux</CardTitle>
              <CardDescription>Politique et informations pour les animaux de compagnie</CardDescription>
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
              <Label>Animaux acceptés</Label>
              <Switch
                checked={petsAllowed}
                onCheckedChange={(checked) => setValue("petsAllowed", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            {petsAllowed && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="petFee">Frais supplémentaires</Label>
                  <Input 
                    id="petFee" 
                    placeholder="Ex: 20€ par nuit"
                    {...form.register("petFee")} 
                    disabled={isSaving} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="petRules">Règles pour les animaux</Label>
                  <Textarea 
                    id="petRules" 
                    rows={3} 
                    placeholder="Ex: Les animaux ne sont pas autorisés sur les canapés..."
                    {...form.register("petRules")} 
                    disabled={isSaving} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dogWalkingAreas">Zones de promenade</Label>
                  <Input 
                    id="dogWalkingAreas" 
                    placeholder="Parcs, espaces verts à proximité..."
                    {...form.register("dogWalkingAreas")} 
                    disabled={isSaving} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nearbyVet">Vétérinaire à proximité</Label>
                  <Input 
                    id="nearbyVet" 
                    placeholder="Nom, adresse, téléphone..."
                    {...form.register("nearbyVet")} 
                    disabled={isSaving} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nearbyPetStore">Animalerie à proximité</Label>
                  <Input 
                    id="nearbyPetStore" 
                    {...form.register("nearbyPetStore")} 
                    disabled={isSaving} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="petEquipmentAvailable">Équipements disponibles</Label>
                  <Input 
                    id="petEquipmentAvailable" 
                    placeholder="Ex: Gamelles, panier..."
                    {...form.register("petEquipmentAvailable")} 
                    disabled={isSaving} 
                  />
                </div>
              </>
            )}
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
