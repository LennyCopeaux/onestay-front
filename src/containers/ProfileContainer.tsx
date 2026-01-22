"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Shield, 
  User as UserIcon,
  Pencil,
  Trash2,
  Lock
} from "lucide-react";

import { authService } from "@/lib/auth-mock";
import { api } from "@/lib/api";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProfileResponse } from "@/types";

export function ProfileContainer() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    
    if (!user || !authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du chargement du profil");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const user = authService.getCurrentUser();
    if (user?.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const handleUpdateProfile = async (data: { nom: string; prenom: string; email: string }) => {
    try {
      await api.updateProfile(data);
      toast.success("Profil mis à jour avec succès");
      await loadProfile();
      
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        authService.updateCurrentUser({
          ...currentUser,
          name: `${data.prenom} ${data.nom}`,
          email: data.email,
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la mise à jour");
      throw error;
    }
  };

  const handleChangePassword = async (password: string) => {
    try {
      await api.updateProfile({ password });
      toast.success("Mot de passe modifié avec succès");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la modification");
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.deleteAccount();
      toast.success("Compte supprimé avec succès");
      authService.logout();
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
      throw error;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeVariant = (slug: string) => {
    switch (slug) {
      case "admin":
        return "destructive";
      case "host":
        return "default";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Mon Profil</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {profile.prenom} {profile.nom}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={getRoleBadgeVariant(profile.role.slug)}>
                  {profile.role.name}
                </Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Membre depuis</span>
                  <span className="font-medium">{formatDate(profile.created_at)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Rôle</span>
                  <span className="font-medium">{profile.role.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
              <CardDescription>
                Gérez votre compte et vos paramètres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3" 
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
                Modifier mes informations
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3" 
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                <Lock className="h-4 w-4" />
                Changer mon mot de passe
              </Button>
              <Separator className="my-4" />
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 text-destructive hover:text-destructive" 
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer mon compte
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <EditProfileDialog
        profile={profile}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateProfile}
      />

      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onSubmit={handleChangePassword}
      />

      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
