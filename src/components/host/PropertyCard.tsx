import { MapPin, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Logement } from "@/types";

interface PropertyCardProps {
  logement: Logement;
  onEdit: (logement: Logement) => void;
  onDelete: (logement: Logement) => void;
  onPublish: (logement: Logement) => void;
  onUnpublish: (logement: Logement) => void;
  onCopyLink: (logement: Logement) => void;
  onViewPublic: (logement: Logement) => void;
}

export function PropertyCard({
  logement,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onCopyLink,
  onViewPublic,
}: PropertyCardProps) {
  const isPublished = logement.status === 2;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{logement.nom_bien}</CardTitle>
              <Badge variant={isPublished ? "default" : "secondary"}>
                {isPublished ? "Publié" : "Brouillon"}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {logement.ville}, {logement.pays}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(logement)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              {isPublished ? (
                <>
                  <DropdownMenuItem onClick={() => onViewPublic(logement)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir la page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCopyLink(logement)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier le lien
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onUnpublish(logement)}>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Dépublier
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => onPublish(logement)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Publier
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(logement)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {logement.description || "Aucune description"}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">
          <span>{logement.adresse}</span>
        </div>
        <div className="mt-3">
          <Button variant="outline" size="sm" className="w-full" onClick={() => onEdit(logement)}>
            <Pencil className="mr-2 h-3 w-3" />
            Modifier les informations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
