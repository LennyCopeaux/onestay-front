"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Property, UpdatePropertyRequest, Rules } from "@/types";

interface RulesFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function RulesForm({ property, onSave, isSaving, onDirtyChange, formRef }: RulesFormProps) {
  const [newRule, setNewRule] = useState("");
  
  const form = useForm<Rules>({
    defaultValues: {
      enabled: property.rules?.enabled ?? false,
      smokingAllowed: property.rules?.smokingAllowed ?? false,
      petsAllowed: property.rules?.petsAllowed ?? false,
      partiesAllowed: property.rules?.partiesAllowed ?? false,
      childrenAllowed: property.rules?.childrenAllowed ?? true,
      maxGuests: property.rules?.maxGuests ?? undefined,
      quietHours: property.rules?.quietHours ?? "",
      houseRules: property.rules?.houseRules ?? [],
      additionalRules: property.rules?.additionalRules ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");
  const houseRules = watch("houseRules") || [];

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleAddRule = () => {
    if (newRule.trim()) {
      setValue("houseRules", [...houseRules, newRule.trim()], { shouldDirty: true });
      setNewRule("");
    }
  };

  const handleRemoveRule = (index: number) => {
    setValue("houseRules", houseRules.filter((_, i) => i !== index), { shouldDirty: true });
  };

  const onSubmit = async (data: Rules) => {
    const cleanedData: Rules = {
      enabled: data.enabled,
      smokingAllowed: data.smokingAllowed,
      petsAllowed: data.petsAllowed,
      partiesAllowed: data.partiesAllowed,
      childrenAllowed: data.childrenAllowed,
      maxGuests: data.maxGuests && !isNaN(data.maxGuests) ? data.maxGuests : undefined,
      quietHours: data.quietHours || undefined,
      houseRules: data.houseRules?.length ? data.houseRules : undefined,
      additionalRules: data.additionalRules || undefined,
    };
    await onSave({ rules: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Règlement intérieur</CardTitle>
              <CardDescription>Les règles à respecter par les voyageurs</CardDescription>
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
                <Label>Fumeur autorisé</Label>
                <Switch
                  checked={watch("smokingAllowed")}
                  onCheckedChange={(checked) => setValue("smokingAllowed", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Animaux autorisés</Label>
                <Switch
                  checked={watch("petsAllowed")}
                  onCheckedChange={(checked) => setValue("petsAllowed", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Fêtes/événements autorisés</Label>
                <Switch
                  checked={watch("partiesAllowed")}
                  onCheckedChange={(checked) => setValue("partiesAllowed", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enfants bienvenus</Label>
                <Switch
                  checked={watch("childrenAllowed")}
                  onCheckedChange={(checked) => setValue("childrenAllowed", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Nombre maximum de voyageurs</Label>
                <Input 
                  type="number" 
                  id="maxGuests" 
                  min={1}
                  {...form.register("maxGuests", { valueAsNumber: true })} 
                  disabled={isSaving} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quietHours">Heures de silence</Label>
                <Input 
                  id="quietHours" 
                  placeholder="Ex: 22h - 8h"
                  {...form.register("quietHours")} 
                  disabled={isSaving} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Règles de la maison</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une règle..."
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRule())}
                  disabled={isSaving}
                />
                <Button type="button" onClick={handleAddRule} disabled={isSaving || !newRule.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {houseRules.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {houseRules.map((rule, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 pr-1">
                      {rule}
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(index)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        disabled={isSaving}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalRules">Règles supplémentaires</Label>
              <Textarea 
                id="additionalRules" 
                rows={3} 
                {...form.register("additionalRules")} 
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
