"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Property, UpdatePropertyRequest, Services } from "@/types";

interface ServicesFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function ServicesForm({ property, onSave, isSaving, onDirtyChange, formRef }: ServicesFormProps) {
  const form = useForm<Services>({
    defaultValues: {
      enabled: property.services?.enabled ?? false,
      linensIncluded: property.services?.linensIncluded ?? true,
      towelsIncluded: property.services?.towelsIncluded ?? true,
      toiletryIncluded: property.services?.toiletryIncluded ?? false,
      cleaningIncluded: property.services?.cleaningIncluded ?? false,
      cleaningFrequency: property.services?.cleaningFrequency ?? "",
      breakfastIncluded: property.services?.breakfastIncluded ?? false,
      breakfastDetails: property.services?.breakfastDetails ?? "",
      conciergeService: property.services?.conciergeService ?? "",
      groceryDelivery: property.services?.groceryDelivery ?? "",
      luggageStorage: property.services?.luggageStorage ?? false,
      laundryService: property.services?.laundryService ?? false,
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: Services) => {
    const cleanedData: Services = {
      enabled: data.enabled,
      linensIncluded: data.linensIncluded,
      towelsIncluded: data.towelsIncluded,
      toiletryIncluded: data.toiletryIncluded,
      cleaningIncluded: data.cleaningIncluded,
      cleaningFrequency: data.cleaningFrequency || undefined,
      breakfastIncluded: data.breakfastIncluded,
      breakfastDetails: data.breakfastDetails || undefined,
      conciergeService: data.conciergeService || undefined,
      groceryDelivery: data.groceryDelivery || undefined,
      luggageStorage: data.luggageStorage,
      laundryService: data.laundryService,
    };
    await onSave({ services: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services</CardTitle>
              <CardDescription>Services inclus dans le séjour</CardDescription>
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
              <Label>Draps fournis</Label>
              <Switch
                checked={watch("linensIncluded")}
                onCheckedChange={(checked) => setValue("linensIncluded", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Serviettes fournies</Label>
              <Switch
                checked={watch("towelsIncluded")}
                onCheckedChange={(checked) => setValue("towelsIncluded", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Produits de toilette fournis</Label>
              <Switch
                checked={watch("toiletryIncluded")}
                onCheckedChange={(checked) => setValue("toiletryIncluded", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Ménage inclus</Label>
                <Switch
                  checked={watch("cleaningIncluded")}
                  onCheckedChange={(checked) => setValue("cleaningIncluded", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("cleaningIncluded") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="cleaningFrequency">Fréquence</Label>
                    <Input 
                      id="cleaningFrequency" 
                      placeholder="Ex: Tous les 3 jours"
                      {...form.register("cleaningFrequency")} 
                      disabled={isSaving} 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Petit-déjeuner inclus</Label>
                <Switch
                  checked={watch("breakfastIncluded")}
                  onCheckedChange={(checked) => setValue("breakfastIncluded", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("breakfastIncluded") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="breakfastDetails">Détails</Label>
                    <Input 
                      id="breakfastDetails" 
                      placeholder="Ex: Panier petit-déjeuner livré chaque matin"
                      {...form.register("breakfastDetails")} 
                      disabled={isSaving} 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conciergeService">Service de conciergerie</Label>
              <Input 
                id="conciergeService" 
                placeholder="Coordonnées ou informations"
                {...form.register("conciergeService")} 
                disabled={isSaving} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groceryDelivery">Livraison de courses</Label>
              <Input 
                id="groceryDelivery" 
                placeholder="Service disponible..."
                {...form.register("groceryDelivery")} 
                disabled={isSaving} 
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Consigne à bagages</Label>
              <Switch
                checked={watch("luggageStorage")}
                onCheckedChange={(checked) => setValue("luggageStorage", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Service de blanchisserie</Label>
              <Switch
                checked={watch("laundryService")}
                onCheckedChange={(checked) => setValue("laundryService", checked, { shouldDirty: true })}
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
