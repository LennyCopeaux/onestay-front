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
import type { Property, UpdatePropertyRequest, CheckInOut } from "@/types";

interface CheckInOutFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function CheckInOutForm({ property, onSave, isSaving, onDirtyChange, formRef }: CheckInOutFormProps) {
  const form = useForm<CheckInOut>({
    defaultValues: {
      enabled: property.checkInOut?.enabled ?? false,
      checkInTime: property.checkInOut?.checkInTime ?? "15:00",
      checkOutTime: property.checkInOut?.checkOutTime ?? "11:00",
      selfCheckIn: property.checkInOut?.selfCheckIn ?? false,
      earlyCheckIn: property.checkInOut?.earlyCheckIn ?? false,
      lateCheckOut: property.checkInOut?.lateCheckOut ?? false,
      checkInInstructions: property.checkInOut?.checkInInstructions ?? "",
      checkOutInstructions: property.checkInOut?.checkOutInstructions ?? "",
      keyLocation: property.checkInOut?.keyLocation ?? "",
      accessCode: property.checkInOut?.accessCode ?? "",
      lockboxCode: property.checkInOut?.lockboxCode ?? "",
      buildingCode: property.checkInOut?.buildingCode ?? "",
      intercomCode: property.checkInOut?.intercomCode ?? "",
      parkingCode: property.checkInOut?.parkingCode ?? "",
      gateCode: property.checkInOut?.gateCode ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: CheckInOut) => {
    const cleanedData: CheckInOut = {
      enabled: data.enabled,
      checkInTime: data.checkInTime || "15:00",
      checkOutTime: data.checkOutTime || "11:00",
      selfCheckIn: data.selfCheckIn,
      earlyCheckIn: data.earlyCheckIn,
      lateCheckOut: data.lateCheckOut,
      checkInInstructions: data.checkInInstructions || undefined,
      checkOutInstructions: data.checkOutInstructions || undefined,
      keyLocation: data.keyLocation || undefined,
      accessCode: data.accessCode || undefined,
      lockboxCode: data.lockboxCode || undefined,
      buildingCode: data.buildingCode || undefined,
      intercomCode: data.intercomCode || undefined,
      parkingCode: data.parkingCode || undefined,
      gateCode: data.gateCode || undefined,
    };
    await onSave({ checkInOut: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Arrivée / Départ</CardTitle>
              <CardDescription>Informations pour le check-in et check-out</CardDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInTime">Heure d&apos;arrivée</Label>
                <Input type="time" id="checkInTime" {...form.register("checkInTime")} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Heure de départ</Label>
                <Input type="time" id="checkOutTime" {...form.register("checkOutTime")} disabled={isSaving} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Arrivée autonome (self check-in)</Label>
                <Switch
                  checked={watch("selfCheckIn")}
                  onCheckedChange={(checked) => setValue("selfCheckIn", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Arrivée anticipée possible</Label>
                <Switch
                  checked={watch("earlyCheckIn")}
                  onCheckedChange={(checked) => setValue("earlyCheckIn", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Départ tardif possible</Label>
                <Switch
                  checked={watch("lateCheckOut")}
                  onCheckedChange={(checked) => setValue("lateCheckOut", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkInInstructions">Instructions d&apos;arrivée</Label>
              <Textarea id="checkInInstructions" rows={3} {...form.register("checkInInstructions")} disabled={isSaving} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutInstructions">Instructions de départ</Label>
              <Textarea id="checkOutInstructions" rows={3} {...form.register("checkOutInstructions")} disabled={isSaving} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyLocation">Emplacement des clés</Label>
              <Input id="keyLocation" {...form.register("keyLocation")} disabled={isSaving} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accessCode">Code d&apos;accès</Label>
                <Input id="accessCode" {...form.register("accessCode")} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lockboxCode">Code boîte à clés</Label>
                <Input id="lockboxCode" {...form.register("lockboxCode")} disabled={isSaving} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buildingCode">Code immeuble</Label>
                <Input id="buildingCode" {...form.register("buildingCode")} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intercomCode">Code interphone</Label>
                <Input id="intercomCode" {...form.register("intercomCode")} disabled={isSaving} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parkingCode">Code parking</Label>
                <Input id="parkingCode" {...form.register("parkingCode")} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gateCode">Code portail</Label>
                <Input id="gateCode" {...form.register("gateCode")} disabled={isSaving} />
              </div>
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
