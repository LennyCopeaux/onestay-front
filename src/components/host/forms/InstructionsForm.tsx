"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Property, UpdatePropertyRequest, Instructions, InstructionItem } from "@/types";

const INSTRUCTION_FIELDS = [
  { key: "trash", label: "Poubelles / Tri sélectif" },
  { key: "heating", label: "Chauffage" },
  { key: "airConditioning", label: "Climatisation" },
  { key: "hotWater", label: "Eau chaude" },
  { key: "appliances", label: "Électroménager" },
  { key: "laundry", label: "Machine à laver" },
  { key: "dishwasher", label: "Lave-vaisselle" },
  { key: "oven", label: "Four" },
  { key: "coffeeMachine", label: "Machine à café" },
  { key: "television", label: "Télévision" },
  { key: "sound", label: "Système audio" },
  { key: "blinds", label: "Volets / Stores" },
  { key: "alarm", label: "Alarme" },
  { key: "safe", label: "Coffre-fort" },
  { key: "pool", label: "Piscine" },
  { key: "spa", label: "Spa / Jacuzzi" },
  { key: "garden", label: "Jardin" },
  { key: "barbecue", label: "Barbecue" },
  { key: "fireplace", label: "Cheminée" },
  { key: "other", label: "Autres" },
] as const;

type InstructionKey = typeof INSTRUCTION_FIELDS[number]["key"];

interface InstructionsFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

function getDefaultInstruction(item?: InstructionItem): InstructionItem {
  return {
    enabled: item?.enabled ?? false,
    content: item?.content ?? "",
  };
}

export function InstructionsForm({ property, onSave, isSaving, onDirtyChange, formRef }: InstructionsFormProps) {
  const form = useForm<Instructions>({
    defaultValues: {
      enabled: property.instructions?.enabled ?? false,
      trash: getDefaultInstruction(property.instructions?.trash),
      heating: getDefaultInstruction(property.instructions?.heating),
      airConditioning: getDefaultInstruction(property.instructions?.airConditioning),
      hotWater: getDefaultInstruction(property.instructions?.hotWater),
      appliances: getDefaultInstruction(property.instructions?.appliances),
      laundry: getDefaultInstruction(property.instructions?.laundry),
      dishwasher: getDefaultInstruction(property.instructions?.dishwasher),
      oven: getDefaultInstruction(property.instructions?.oven),
      coffeeMachine: getDefaultInstruction(property.instructions?.coffeeMachine),
      television: getDefaultInstruction(property.instructions?.television),
      sound: getDefaultInstruction(property.instructions?.sound),
      blinds: getDefaultInstruction(property.instructions?.blinds),
      alarm: getDefaultInstruction(property.instructions?.alarm),
      safe: getDefaultInstruction(property.instructions?.safe),
      pool: getDefaultInstruction(property.instructions?.pool),
      spa: getDefaultInstruction(property.instructions?.spa),
      garden: getDefaultInstruction(property.instructions?.garden),
      barbecue: getDefaultInstruction(property.instructions?.barbecue),
      fireplace: getDefaultInstruction(property.instructions?.fireplace),
      other: getDefaultInstruction(property.instructions?.other),
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: Instructions) => {
    const cleanedData: Instructions = {
      enabled: data.enabled,
    };
    
    INSTRUCTION_FIELDS.forEach(({ key }) => {
      const item = data[key as InstructionKey];
      if (item && item.enabled) {
        cleanedData[key as InstructionKey] = {
          enabled: true,
          content: item.content || undefined,
        };
      }
    });
    
    await onSave({ instructions: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Consignes d&apos;utilisation</CardTitle>
              <CardDescription>Mode d&apos;emploi des équipements</CardDescription>
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
            {INSTRUCTION_FIELDS.map(({ key, label }) => {
              const fieldEnabled = watch(`${key}.enabled` as keyof Instructions);
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{label}</Label>
                    <Switch
                      checked={fieldEnabled as boolean}
                      onCheckedChange={(checked) => 
                        setValue(`${key}.enabled` as keyof Instructions, checked as never, { shouldDirty: true })
                      }
                      disabled={isSaving}
                    />
                  </div>
                  {fieldEnabled && (
                    <Textarea
                      placeholder={`Instructions pour ${label.toLowerCase()}...`}
                      value={watch(`${key}.content` as keyof Instructions) as string || ""}
                      onChange={(e) => 
                        setValue(`${key}.content` as keyof Instructions, e.target.value as never, { shouldDirty: true })
                      }
                      rows={2}
                      disabled={isSaving}
                    />
                  )}
                </div>
              );
            })}
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
