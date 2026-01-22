"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Plus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Property, UpdatePropertyRequest, Equipment, EquipmentItem, EquipmentCategory } from "@/types";

const CATEGORIES: { value: EquipmentCategory; label: string }[] = [
  { value: "bedroom", label: "Chambre" },
  { value: "bathroom", label: "Salle de bain" },
  { value: "kitchen", label: "Cuisine" },
  { value: "living", label: "Salon" },
  { value: "outdoor", label: "Extérieur" },
  { value: "baby", label: "Bébé" },
  { value: "work", label: "Travail" },
  { value: "other", label: "Autre" },
];

interface EquipmentFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function EquipmentForm({ property, onSave, isSaving, onDirtyChange, formRef }: EquipmentFormProps) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<EquipmentCategory>("other");
  
  const form = useForm<Equipment>({
    defaultValues: {
      enabled: property.equipment?.enabled ?? false,
      items: property.equipment?.items ?? [],
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");
  const items = watch("items") || [];

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem: EquipmentItem = {
        id: uuidv4(),
        name: newItemName.trim(),
        category: newItemCategory,
      };
      setValue("items", [...items, newItem], { shouldDirty: true });
      setNewItemName("");
    }
  };

  const handleRemoveItem = (id: string) => {
    setValue("items", items.filter((item) => item.id !== id), { shouldDirty: true });
  };

  const onSubmit = async (data: Equipment) => {
    const cleanedData: Equipment = {
      enabled: data.enabled,
      items: data.items || [],
    };
    await onSave({ equipment: cleanedData });
    form.reset(data);
  };

  const groupedItems = items.reduce<Record<string, EquipmentItem[]>>((acc, item) => {
    const cat = item.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Équipements</CardTitle>
              <CardDescription>Liste des équipements disponibles</CardDescription>
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
            <div className="flex gap-2">
              <Input
                placeholder="Nom de l'équipement..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem())}
                disabled={isSaving}
                className="flex-1"
              />
              <Select
                value={newItemCategory}
                onValueChange={(value) => setNewItemCategory(value as EquipmentCategory)}
                disabled={isSaving}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={handleAddItem} disabled={isSaving || !newItemName.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {Object.entries(groupedItems).map(([category, categoryItems]) => {
              const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label || category;
              return (
                <div key={category} className="space-y-2">
                  <Label className="text-sm text-muted-foreground">{categoryLabel}</Label>
                  <div className="flex flex-wrap gap-2">
                    {categoryItems.map((item) => (
                      <Badge key={item.id} variant="secondary" className="gap-1 pr-1">
                        {item.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          disabled={isSaving}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun équipement ajouté
              </p>
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
