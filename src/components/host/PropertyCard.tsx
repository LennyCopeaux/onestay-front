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
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  onPublish: (property: Property) => void;
  onUnpublish: (property: Property) => void;
  onCopyLink: (property: Property) => void;
  onViewPublic: (property: Property) => void;
}

export function PropertyCard({
  property,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onCopyLink,
  onViewPublic,
}: PropertyCardProps) {
  const isPublished = property.status === 2;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{property.name}</CardTitle>
              <Badge variant={isPublished ? "default" : "secondary"}>
                {isPublished ? "Publié" : "Brouillon"}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {property.city}, {property.country}
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
              <DropdownMenuItem onClick={() => onEdit(property)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              {isPublished ? (
                <>
                  <DropdownMenuItem onClick={() => onViewPublic(property)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir la page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCopyLink(property)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier le lien
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onUnpublish(property)}>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Dépublier
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => onPublish(property)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Publier
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(property)}
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
          {property.description || "Aucune description"}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">
          <span>{property.address}</span>
        </div>
        <div className="mt-3">
          <Button variant="outline" size="sm" className="w-full" onClick={() => onEdit(property)}>
            <Pencil className="mr-2 h-3 w-3" />
            Modifier les informations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
