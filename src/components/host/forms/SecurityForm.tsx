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
import type { Property, UpdatePropertyRequest, Security } from "@/types";

interface SecurityFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function SecurityForm({ property, onSave, isSaving, onDirtyChange, formRef }: SecurityFormProps) {
  const form = useForm<Security>({
    defaultValues: {
      enabled: property.security?.enabled ?? false,
      hasAlarm: property.security?.hasAlarm ?? false,
      alarmCode: property.security?.alarmCode ?? "",
      alarmInstructions: property.security?.alarmInstructions ?? "",
      hasSafe: property.security?.hasSafe ?? false,
      safeCode: property.security?.safeCode ?? "",
      safeLocation: property.security?.safeLocation ?? "",
      hasFireExtinguisher: property.security?.hasFireExtinguisher ?? false,
      fireExtinguisherLocation: property.security?.fireExtinguisherLocation ?? "",
      hasFirstAidKit: property.security?.hasFirstAidKit ?? false,
      firstAidKitLocation: property.security?.firstAidKitLocation ?? "",
      hasSmokeDetector: property.security?.hasSmokeDetector ?? false,
      hasCarbonMonoxideDetector: property.security?.hasCarbonMonoxideDetector ?? false,
      securityNotes: property.security?.securityNotes ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: Security) => {
    const cleanedData: Security = {
      enabled: data.enabled,
      hasAlarm: data.hasAlarm,
      alarmCode: data.alarmCode || undefined,
      alarmInstructions: data.alarmInstructions || undefined,
      hasSafe: data.hasSafe,
      safeCode: data.safeCode || undefined,
      safeLocation: data.safeLocation || undefined,
      hasFireExtinguisher: data.hasFireExtinguisher,
      fireExtinguisherLocation: data.fireExtinguisherLocation || undefined,
      hasFirstAidKit: data.hasFirstAidKit,
      firstAidKitLocation: data.firstAidKitLocation || undefined,
      hasSmokeDetector: data.hasSmokeDetector,
      hasCarbonMonoxideDetector: data.hasCarbonMonoxideDetector,
      securityNotes: data.securityNotes || undefined,
    };
    await onSave({ security: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Équipements et informations de sécurité</CardDescription>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Alarme</Label>
                <Switch
                  checked={watch("hasAlarm")}
                  onCheckedChange={(checked) => setValue("hasAlarm", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasAlarm") && (
                <div className="ml-4 space-y-3 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="alarmCode">Code alarme</Label>
                    <Input id="alarmCode" {...form.register("alarmCode")} disabled={isSaving} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alarmInstructions">Instructions</Label>
                    <Textarea id="alarmInstructions" rows={2} {...form.register("alarmInstructions")} disabled={isSaving} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Coffre-fort</Label>
                <Switch
                  checked={watch("hasSafe")}
                  onCheckedChange={(checked) => setValue("hasSafe", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasSafe") && (
                <div className="ml-4 space-y-3 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="safeCode">Code coffre</Label>
                    <Input id="safeCode" {...form.register("safeCode")} disabled={isSaving} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="safeLocation">Emplacement</Label>
                    <Input id="safeLocation" {...form.register("safeLocation")} disabled={isSaving} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Extincteur</Label>
                <Switch
                  checked={watch("hasFireExtinguisher")}
                  onCheckedChange={(checked) => setValue("hasFireExtinguisher", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasFireExtinguisher") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="fireExtinguisherLocation">Emplacement</Label>
                    <Input id="fireExtinguisherLocation" {...form.register("fireExtinguisherLocation")} disabled={isSaving} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Trousse de premiers secours</Label>
                <Switch
                  checked={watch("hasFirstAidKit")}
                  onCheckedChange={(checked) => setValue("hasFirstAidKit", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasFirstAidKit") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstAidKitLocation">Emplacement</Label>
                    <Input id="firstAidKitLocation" {...form.register("firstAidKitLocation")} disabled={isSaving} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label>Détecteur de fumée</Label>
              <Switch
                checked={watch("hasSmokeDetector")}
                onCheckedChange={(checked) => setValue("hasSmokeDetector", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Détecteur de monoxyde de carbone</Label>
              <Switch
                checked={watch("hasCarbonMonoxideDetector")}
                onCheckedChange={(checked) => setValue("hasCarbonMonoxideDetector", checked, { shouldDirty: true })}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityNotes">Notes de sécurité</Label>
              <Textarea id="securityNotes" rows={3} {...form.register("securityNotes")} disabled={isSaving} />
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
