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
import type { Property, UpdatePropertyRequest, Outdoor } from "@/types";

interface OutdoorFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function OutdoorForm({ property, onSave, isSaving, onDirtyChange, formRef }: OutdoorFormProps) {
  const form = useForm<Outdoor>({
    defaultValues: {
      enabled: property.outdoor?.enabled ?? false,
      hasGarden: property.outdoor?.hasGarden ?? false,
      gardenInfo: property.outdoor?.gardenInfo ?? "",
      hasTerrace: property.outdoor?.hasTerrace ?? false,
      terraceInfo: property.outdoor?.terraceInfo ?? "",
      hasBalcony: property.outdoor?.hasBalcony ?? false,
      balconyInfo: property.outdoor?.balconyInfo ?? "",
      hasPool: property.outdoor?.hasPool ?? false,
      poolInfo: property.outdoor?.poolInfo ?? "",
      poolRules: property.outdoor?.poolRules ?? "",
      hasSpa: property.outdoor?.hasSpa ?? false,
      spaInfo: property.outdoor?.spaInfo ?? "",
      hasBarbecue: property.outdoor?.hasBarbecue ?? false,
      barbecueInfo: property.outdoor?.barbecueInfo ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: Outdoor) => {
    const cleanedData: Outdoor = {
      enabled: data.enabled,
      hasGarden: data.hasGarden,
      gardenInfo: data.gardenInfo || undefined,
      hasTerrace: data.hasTerrace,
      terraceInfo: data.terraceInfo || undefined,
      hasBalcony: data.hasBalcony,
      balconyInfo: data.balconyInfo || undefined,
      hasPool: data.hasPool,
      poolInfo: data.poolInfo || undefined,
      poolRules: data.poolRules || undefined,
      hasSpa: data.hasSpa,
      spaInfo: data.spaInfo || undefined,
      hasBarbecue: data.hasBarbecue,
      barbecueInfo: data.barbecueInfo || undefined,
    };
    await onSave({ outdoor: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Extérieur</CardTitle>
              <CardDescription>Espaces et équipements extérieurs</CardDescription>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Jardin</Label>
                <Switch
                  checked={watch("hasGarden")}
                  onCheckedChange={(checked) => setValue("hasGarden", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasGarden") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="gardenInfo">Description</Label>
                    <Input id="gardenInfo" {...form.register("gardenInfo")} disabled={isSaving} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Terrasse</Label>
                <Switch
                  checked={watch("hasTerrace")}
                  onCheckedChange={(checked) => setValue("hasTerrace", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasTerrace") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="terraceInfo">Description</Label>
                    <Input id="terraceInfo" {...form.register("terraceInfo")} disabled={isSaving} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Balcon</Label>
                <Switch
                  checked={watch("hasBalcony")}
                  onCheckedChange={(checked) => setValue("hasBalcony", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasBalcony") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="balconyInfo">Description</Label>
                    <Input id="balconyInfo" {...form.register("balconyInfo")} disabled={isSaving} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Piscine</Label>
                <Switch
                  checked={watch("hasPool")}
                  onCheckedChange={(checked) => setValue("hasPool", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasPool") && (
                <div className="ml-4 border-l-2 pl-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="poolInfo">Informations</Label>
                    <Input 
                      id="poolInfo" 
                      placeholder="Dimensions, température..."
                      {...form.register("poolInfo")} 
                      disabled={isSaving} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poolRules">Règles</Label>
                    <Textarea 
                      id="poolRules" 
                      rows={2}
                      placeholder="Horaires, sécurité..."
                      {...form.register("poolRules")} 
                      disabled={isSaving} 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Spa / Jacuzzi</Label>
                <Switch
                  checked={watch("hasSpa")}
                  onCheckedChange={(checked) => setValue("hasSpa", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasSpa") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="spaInfo">Informations</Label>
                    <Input id="spaInfo" {...form.register("spaInfo")} disabled={isSaving} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Barbecue</Label>
                <Switch
                  checked={watch("hasBarbecue")}
                  onCheckedChange={(checked) => setValue("hasBarbecue", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasBarbecue") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="barbecueInfo">Informations</Label>
                    <Input 
                      id="barbecueInfo" 
                      placeholder="Type, emplacement..."
                      {...form.register("barbecueInfo")} 
                      disabled={isSaving} 
                    />
                  </div>
                </div>
              )}
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
