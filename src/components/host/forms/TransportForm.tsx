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
import type { Property, UpdatePropertyRequest, Transport } from "@/types";

interface TransportFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function TransportForm({ property, onSave, isSaving, onDirtyChange, formRef }: TransportFormProps) {
  const form = useForm<Transport>({
    defaultValues: {
      enabled: property.transport?.enabled ?? false,
      nearestBus: property.transport?.nearestBus ?? "",
      nearestMetro: property.transport?.nearestMetro ?? "",
      nearestTrain: property.transport?.nearestTrain ?? "",
      nearestTram: property.transport?.nearestTram ?? "",
      taxiInfo: property.transport?.taxiInfo ?? "",
      bikeRental: property.transport?.bikeRental ?? "",
      carRental: property.transport?.carRental ?? "",
      airportShuttle: property.transport?.airportShuttle ?? "",
      walkingInfo: property.transport?.walkingInfo ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: Transport) => {
    const cleanedData: Transport = {
      enabled: data.enabled,
      nearestBus: data.nearestBus || undefined,
      nearestMetro: data.nearestMetro || undefined,
      nearestTrain: data.nearestTrain || undefined,
      nearestTram: data.nearestTram || undefined,
      taxiInfo: data.taxiInfo || undefined,
      bikeRental: data.bikeRental || undefined,
      carRental: data.carRental || undefined,
      airportShuttle: data.airportShuttle || undefined,
      walkingInfo: data.walkingInfo || undefined,
    };
    await onSave({ transport: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transports</CardTitle>
              <CardDescription>Informations sur les transports à proximité</CardDescription>
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
                <Label htmlFor="nearestMetro">Station de métro</Label>
                <Input id="nearestMetro" placeholder="Nom et distance" {...form.register("nearestMetro")} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nearestBus">Arrêt de bus</Label>
                <Input id="nearestBus" placeholder="Nom et distance" {...form.register("nearestBus")} disabled={isSaving} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nearestTrain">Gare</Label>
                <Input id="nearestTrain" placeholder="Nom et distance" {...form.register("nearestTrain")} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nearestTram">Tramway</Label>
                <Input id="nearestTram" placeholder="Nom et distance" {...form.register("nearestTram")} disabled={isSaving} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxiInfo">Taxis</Label>
              <Input id="taxiInfo" placeholder="Numéro de taxi, borne..." {...form.register("taxiInfo")} disabled={isSaving} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bikeRental">Location de vélos</Label>
                <Input id="bikeRental" placeholder="Station Vélib', etc." {...form.register("bikeRental")} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carRental">Location de voitures</Label>
                <Input id="carRental" {...form.register("carRental")} disabled={isSaving} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="airportShuttle">Navette aéroport</Label>
              <Input id="airportShuttle" {...form.register("airportShuttle")} disabled={isSaving} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="walkingInfo">Informations piéton</Label>
              <Textarea 
                id="walkingInfo" 
                rows={2} 
                placeholder="Quartier piéton, itinéraires recommandés..."
                {...form.register("walkingInfo")} 
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
