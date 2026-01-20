"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiUser, Role, UpdateUserRequest } from "@/types";

const userSchema = z.object({
  nom: z.string().optional(),
  prenom: z.string().optional(),
  email: z.string().email("Veuillez entrer une adresse email valide").optional().or(z.literal("")),
  password: z.string().optional(),
  role_id: z.string().optional(),
}).refine((data) => {
  if (data.nom && data.nom.length < 2) return false;
  if (data.prenom && data.prenom.length < 2) return false;
  if (data.password && data.password.length > 0 && data.password.length < 6) return false;
  return true;
}).refine((data) => {
  return (data.nom && data.nom.length > 0) || 
         (data.prenom && data.prenom.length > 0) || 
         (data.email && data.email.length > 0) || 
         (data.password && data.password.length > 0) || 
         (data.role_id && data.role_id.length > 0);
}, {
  message: "Au moins un champ doit être modifié",
});

type UserFormValues = z.infer<typeof userSchema>;

interface EditUserDialogProps {
  user: ApiUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: string, data: UpdateUserRequest) => Promise<void>;
  roles: Role[];
}

export function EditUserDialog({ user, open, onOpenChange, onSubmit, roles }: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      role_id: "",
    },
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: "",
        role_id: user.role.id,
      });
    } else if (!open) {
      form.reset();
    }
  }, [user, open, form]);

  const handleSubmit = async (values: UserFormValues) => {
    if (!user) return;

    const updateData: UpdateUserRequest = {};
    if (values.nom && values.nom !== user.nom) {
      updateData.nom = values.nom;
    }
    if (values.prenom && values.prenom !== user.prenom) {
      updateData.prenom = values.prenom;
    }
    if (values.email && values.email !== user.email) {
      updateData.email = values.email;
    }
    if (values.password) {
      updateData.password = values.password;
    }
    if (values.role_id && values.role_id !== user.role.id) {
      updateData.role_id = values.role_id;
    }

    if (Object.keys(updateData).length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(user.id, updateData);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de {user.prenom} {user.nom}. Laissez le mot de passe vide pour ne pas le modifier.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                placeholder="Jean"
                disabled={isSubmitting}
                {...form.register("prenom")}
              />
              {form.formState.errors.prenom && (
                <p className="text-sm text-destructive">{form.formState.errors.prenom.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                placeholder="Dupont"
                disabled={isSubmitting}
                {...form.register("nom")}
              />
              {form.formState.errors.nom && (
                <p className="text-sm text-destructive">{form.formState.errors.nom.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jean.dupont@example.com"
              disabled={isSubmitting}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Laisser vide pour ne pas modifier"
              disabled={isSubmitting}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select
              disabled={isSubmitting}
              onValueChange={(value) => form.setValue("role_id", value)}
              value={form.watch("role_id")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.role_id && (
              <p className="text-sm text-destructive">{form.formState.errors.role_id.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Modification...
                </>
              ) : (
                "Modifier"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
