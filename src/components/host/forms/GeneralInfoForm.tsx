"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Property, UpdatePropertyRequest } from "@/types";

interface GeneralFormValues {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  images: string[];
}

interface GeneralInfoFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function GeneralInfoForm({ property, onSave, isSaving, onDirtyChange, formRef }: GeneralInfoFormProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  
  const form = useForm<GeneralFormValues>({
    defaultValues: {
      name: property.name ?? "",
      description: property.description ?? "",
      address: property.address ?? "",
      city: property.city ?? "",
      country: property.country ?? "",
      zipCode: property.zipCode ?? "",
      images: property.images ?? [],
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const images = watch("images") || [];

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setValue("images", [...images, newImageUrl.trim()], { shouldDirty: true });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setValue("images", images.filter((_, i) => i !== index), { shouldDirty: true });
  };

  const onSubmit = async (data: GeneralFormValues) => {
    const cleanedData: UpdatePropertyRequest = {
      name: data.name || undefined,
      description: data.description || undefined,
      address: data.address || undefined,
      city: data.city || undefined,
      country: data.country || undefined,
      zipCode: data.zipCode || undefined,
      images: data.images?.length ? data.images : undefined,
    };
    await onSave(cleanedData);
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>Les informations de base de votre bien</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du bien</Label>
            <Input 
              id="name" 
              placeholder="Ex: Appartement vue mer"
              {...form.register("name")} 
              disabled={isSaving} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              rows={4} 
              placeholder="Décrivez votre bien..."
              {...form.register("description")} 
              disabled={isSaving} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input 
              id="address" 
              placeholder="123 Rue de la Plage"
              {...form.register("address")} 
              disabled={isSaving} 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input id="city" {...form.register("city")} disabled={isSaving} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Code postal</Label>
              <Input id="zipCode" {...form.register("zipCode")} disabled={isSaving} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input id="country" {...form.register("country")} disabled={isSaving} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>Ajoutez les URLs de vos photos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/image.jpg"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImage())}
              disabled={isSaving}
            />
            <Button type="button" onClick={handleAddImage} disabled={isSaving || !newImageUrl.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Image+invalide";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
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
