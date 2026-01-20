import { LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">Bienvenue !</CardTitle>
                <CardDescription className="mt-2">
                  Vous êtes connecté avec succès
                </CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={onLogout} className="ml-4">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                <p className="text-lg">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
