"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authService } from "@/lib/auth-mock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/**
 * Schéma de validation du formulaire de connexion
 */
const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(values);
      
      // Afficher le toast de succès
      toast.success(`Bon retour, ${response.user.name} !`);

      // Redirect based on user role
      if (response.user.role === "ADMIN") {
        router.push("/admin");
      } else if (response.user.role === "HOST") {
        router.push("/dashboard");
      } else {
        // Fallback to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      // Afficher le toast d'erreur
      toast.error(error instanceof Error ? error.message : "Identifiants invalides");
      
      // Réinitialiser le champ mot de passe
      form.resetField("password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Bon retour</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="host@demo.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
                <div className="text-center">
                  <a
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:text-primary underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>
            </form>
          </Form>
          <div className="mt-6 border-t pt-6">
            <p className="text-xs text-muted-foreground text-center">
              Identifiants de démonstration :
            </p>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <p className="text-center">
                <strong>Hôte :</strong> host@demo.com / password123
              </p>
              <p className="text-center">
                <strong>Admin :</strong> admin@demo.com / admin123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
