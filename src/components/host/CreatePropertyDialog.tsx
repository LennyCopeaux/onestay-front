"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateLogementRequest } from "@/types";

const propertySchema = z.object({
  nom_bien: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(1, "La description est requise"),
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  ville: z.string().min(2, "La ville est requise"),
  pays: z.string().min(2, "Le pays est requis"),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

interface CreatePropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateLogementRequest) => Promise<void>;
}

export function CreatePropertyDialog({ open, onOpenChange, onSubmit }: CreatePropertyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      nom_bien: "",
      description: "",
      adresse: "",
      ville: "",
      pays: "France",
    },
  });

  const handleSubmit = async (values: PropertyFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un bien</DialogTitle>
          <DialogDescription>
            Créez un nouveau bien à gérer. Vous pourrez compléter les détails ensuite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom_bien">Nom du bien *</Label>
            <Input
              id="nom_bien"
              placeholder="Ex: Appartement cosy dans le Marais"
              disabled={isSubmitting}
              {...form.register("nom_bien")}
            />
            {form.formState.errors.nom_bien && (
              <p className="text-sm text-destructive">{form.formState.errors.nom_bien.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre bien en quelques mots..."
              disabled={isSubmitting}
              rows={3}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse *</Label>
            <Input
              id="adresse"
              placeholder="15 Rue des Rosiers"
              disabled={isSubmitting}
              {...form.register("adresse")}
            />
            {form.formState.errors.adresse && (
              <p className="text-sm text-destructive">{form.formState.errors.adresse.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ville">Ville *</Label>
              <Input
                id="ville"
                placeholder="Paris"
                disabled={isSubmitting}
                {...form.register("ville")}
              />
              {form.formState.errors.ville && (
                <p className="text-sm text-destructive">{form.formState.errors.ville.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pays">Pays *</Label>
              <Input
                id="pays"
                placeholder="France"
                disabled={isSubmitting}
                {...form.register("pays")}
              />
              {form.formState.errors.pays && (
                <p className="text-sm text-destructive">{form.formState.errors.pays.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer le bien"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
