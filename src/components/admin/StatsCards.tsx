import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiUser } from "@/types";

interface StatsCardsProps {
  users: ApiUser[];
}

export function StatsCards({ users }: StatsCardsProps) {
  const totalUsers = users.length;
  const totalClients = users.filter((u) => u.role.slug === "client").length;
  const totalLoueurs = users.filter((u) => u.role.slug === "loueur").length;

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">Utilisateurs enregistrés</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-muted-foreground">Comptes clients actifs</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Loueurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLoueurs}</div>
          <p className="text-xs text-muted-foreground">Comptes loueurs actifs</p>
        </CardContent>
      </Card>
    </div>
  );
}
