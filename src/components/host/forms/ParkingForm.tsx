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
import type { Property, UpdatePropertyRequest, Parking, ParkingType } from "@/types";

const PARKING_TYPES: { value: ParkingType; label: string }[] = [
  { value: "street", label: "Rue" },
  { value: "garage", label: "Garage" },
  { value: "driveway", label: "Allée privée" },
  { value: "private", label: "Parking privé" },
  { value: "public", label: "Parking public" },
];

interface ParkingFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function ParkingForm({ property, onSave, isSaving, onDirtyChange, formRef }: ParkingFormProps) {
  const form = useForm<Parking>({
    defaultValues: {
      enabled: property.parking?.enabled ?? false,
      available: property.parking?.available ?? true,
      type: property.parking?.type ?? "street",
      free: property.parking?.free ?? true,
      price: property.parking?.price ?? "",
      instructions: property.parking?.instructions ?? "",
      accessCode: property.parking?.accessCode ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");
  const free = watch("free");
  const available = watch("available");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: Parking) => {
    const cleanedData: Parking = {
      enabled: data.enabled,
      available: data.available,
      type: data.type || undefined,
      free: data.free,
      price: data.price || undefined,
      instructions: data.instructions || undefined,
      accessCode: data.accessCode || undefined,
    };
    await onSave({ parking: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Parking</CardTitle>
              <CardDescription>Informations sur le stationnement</CardDescription>
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
              <Label>Parking disponible</Label>
              <Switch
                checked={available}
                onCheckedChange={(checked) => setValue("available", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            {available && (
              <>
                <div className="space-y-2">
                  <Label>Type de parking</Label>
                  <Select
                    value={watch("type")}
                    onValueChange={(value) => setValue("type", value as ParkingType, { shouldDirty: true })}
                    disabled={isSaving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PARKING_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Parking gratuit</Label>
                  <Switch
                    checked={free}
                    onCheckedChange={(checked) => setValue("free", checked, { shouldDirty: true })}
                    disabled={isSaving}
                  />
                </div>

                {!free && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Tarif</Label>
                    <Input 
                      id="price" 
                      placeholder="Ex: 10€ / jour"
                      {...form.register("price")} 
                      disabled={isSaving} 
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="accessCode">Code d&apos;accès</Label>
                  <Input id="accessCode" {...form.register("accessCode")} disabled={isSaving} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea 
                    id="instructions" 
                    rows={3} 
                    placeholder="Comment accéder au parking..."
                    {...form.register("instructions")} 
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
