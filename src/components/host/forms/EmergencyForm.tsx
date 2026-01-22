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
import type { Property, UpdatePropertyRequest, Emergency } from "@/types";

interface EmergencyFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function EmergencyForm({ property, onSave, isSaving, onDirtyChange, formRef }: EmergencyFormProps) {
  const form = useForm<Emergency>({
    defaultValues: {
      enabled: property.emergency?.enabled ?? false,
      emergencyNumber: property.emergency?.emergencyNumber ?? "112",
      policeNumber: property.emergency?.policeNumber ?? "17",
      fireNumber: property.emergency?.fireNumber ?? "18",
      ambulanceNumber: property.emergency?.ambulanceNumber ?? "15",
      nearestHospital: property.emergency?.nearestHospital ?? "",
      nearestHospitalAddress: property.emergency?.nearestHospitalAddress ?? "",
      nearestPharmacy: property.emergency?.nearestPharmacy ?? "",
      nearestPharmacyHours: property.emergency?.nearestPharmacyHours ?? "",
      doctorOnCall: property.emergency?.doctorOnCall ?? "",
      additionalEmergencyInfo: property.emergency?.additionalEmergencyInfo ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: Emergency) => {
    const cleanedData: Emergency = {
      enabled: data.enabled,
      emergencyNumber: data.emergencyNumber || undefined,
      policeNumber: data.policeNumber || undefined,
      fireNumber: data.fireNumber || undefined,
      ambulanceNumber: data.ambulanceNumber || undefined,
      nearestHospital: data.nearestHospital || undefined,
      nearestHospitalAddress: data.nearestHospitalAddress || undefined,
      nearestPharmacy: data.nearestPharmacy || undefined,
      nearestPharmacyHours: data.nearestPharmacyHours || undefined,
      doctorOnCall: data.doctorOnCall || undefined,
      additionalEmergencyInfo: data.additionalEmergencyInfo || undefined,
    };
    await onSave({ emergency: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Urgences</CardTitle>
              <CardDescription>Numéros et informations d&apos;urgence</CardDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyNumber">Numéro d&apos;urgence général</Label>
                <Input id="emergencyNumber" {...form.register("emergencyNumber")} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policeNumber">Police</Label>
                <Input id="policeNumber" {...form.register("policeNumber")} disabled={isSaving} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fireNumber">Pompiers</Label>
                <Input id="fireNumber" {...form.register("fireNumber")} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ambulanceNumber">SAMU</Label>
                <Input id="ambulanceNumber" {...form.register("ambulanceNumber")} disabled={isSaving} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nearestHospital">Hôpital le plus proche</Label>
              <Input 
                id="nearestHospital" 
                placeholder="Nom de l'établissement"
                {...form.register("nearestHospital")} 
                disabled={isSaving} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nearestHospitalAddress">Adresse de l&apos;hôpital</Label>
              <Input id="nearestHospitalAddress" {...form.register("nearestHospitalAddress")} disabled={isSaving} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nearestPharmacy">Pharmacie la plus proche</Label>
                <Input id="nearestPharmacy" {...form.register("nearestPharmacy")} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nearestPharmacyHours">Horaires</Label>
                <Input 
                  id="nearestPharmacyHours" 
                  placeholder="Ex: 9h-19h"
                  {...form.register("nearestPharmacyHours")} 
                  disabled={isSaving} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorOnCall">Médecin de garde</Label>
              <Input 
                id="doctorOnCall" 
                placeholder="Nom et numéro"
                {...form.register("doctorOnCall")} 
                disabled={isSaving} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalEmergencyInfo">Informations supplémentaires</Label>
              <Textarea 
                id="additionalEmergencyInfo" 
                rows={3} 
                {...form.register("additionalEmergencyInfo")} 
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
