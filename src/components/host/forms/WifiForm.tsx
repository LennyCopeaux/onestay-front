"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Property, UpdatePropertyRequest, Wifi } from "@/types";

interface WifiFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function WifiForm({ property, onSave, isSaving, onDirtyChange, formRef }: WifiFormProps) {
  const [copied, setCopied] = useState<"network" | "password" | null>(null);
  
  const form = useForm<Wifi>({
    defaultValues: {
      enabled: property.wifi?.enabled ?? false,
      networkName: property.wifi?.networkName ?? "",
      password: property.wifi?.password ?? "",
      routerLocation: property.wifi?.routerLocation ?? "",
      resetInstructions: property.wifi?.resetInstructions ?? "",
      notes: property.wifi?.notes ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const copyToClipboard = async (text: string, type: "network" | "password") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const onSubmit = async (data: Wifi) => {
    const cleanedData: Wifi = {
      enabled: data.enabled,
      networkName: data.networkName || undefined,
      password: data.password || undefined,
      routerLocation: data.routerLocation || undefined,
      resetInstructions: data.resetInstructions || undefined,
      notes: data.notes || undefined,
    };
    await onSave({ wifi: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Wi-Fi</CardTitle>
              <CardDescription>Informations de connexion internet</CardDescription>
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
              <Label htmlFor="networkName">Nom du réseau (SSID)</Label>
              <div className="flex gap-2">
                <Input id="networkName" {...form.register("networkName")} disabled={isSaving} />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(watch("networkName") || "", "network")}
                  disabled={!watch("networkName")}
                >
                  {copied === "network" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="flex gap-2">
                <Input id="password" {...form.register("password")} disabled={isSaving} />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(watch("password") || "", "password")}
                  disabled={!watch("password")}
                >
                  {copied === "password" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="routerLocation">Emplacement du routeur</Label>
              <Input id="routerLocation" placeholder="Ex: Dans le placard de l'entrée" {...form.register("routerLocation")} disabled={isSaving} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resetInstructions">Instructions de réinitialisation</Label>
              <Textarea 
                id="resetInstructions" 
                rows={3} 
                placeholder="Ex: Débranchez le routeur pendant 30 secondes puis rebranchez-le"
                {...form.register("resetInstructions")} 
                disabled={isSaving} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes supplémentaires</Label>
              <Textarea id="notes" rows={2} {...form.register("notes")} disabled={isSaving} />
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
