"use client";

import { useEffect, useState } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PublicPropertyContainerProps {
  slug: string;
}

export function PublicPropertyContainer({ slug }: PublicPropertyContainerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Pour l'instant, le backend ne supporte pas la récupération publique par slug/id
    // Cette fonctionnalité sera implémentée côté backend
    setNotFound(true);
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Page en cours de développement</CardTitle>
            <CardDescription>
              La page publique des logements sera disponible prochainement.
              <br />
              Le backend doit être étendu pour supporter cette fonctionnalité.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
