"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Property, UpdatePropertyRequest, Entertainment } from "@/types";

interface EntertainmentFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function EntertainmentForm({ property, onSave, isSaving, onDirtyChange, formRef }: EntertainmentFormProps) {
  const form = useForm<Entertainment>({
    defaultValues: {
      enabled: property.entertainment?.enabled ?? false,
      hasTv: property.entertainment?.hasTv ?? false,
      tvChannels: property.entertainment?.tvChannels ?? "",
      hasNetflix: property.entertainment?.hasNetflix ?? false,
      netflixInstructions: property.entertainment?.netflixInstructions ?? "",
      hasSpotify: property.entertainment?.hasSpotify ?? false,
      spotifyInstructions: property.entertainment?.spotifyInstructions ?? "",
      hasGameConsole: property.entertainment?.hasGameConsole ?? false,
      gameConsoleDetails: property.entertainment?.gameConsoleDetails ?? "",
      boardGames: property.entertainment?.boardGames ?? "",
      books: property.entertainment?.books ?? "",
    },
  });

  const { watch, setValue, formState: { isDirty } } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: Entertainment) => {
    const cleanedData: Entertainment = {
      enabled: data.enabled,
      hasTv: data.hasTv,
      tvChannels: data.tvChannels || undefined,
      hasNetflix: data.hasNetflix,
      netflixInstructions: data.netflixInstructions || undefined,
      hasSpotify: data.hasSpotify,
      spotifyInstructions: data.spotifyInstructions || undefined,
      hasGameConsole: data.hasGameConsole,
      gameConsoleDetails: data.gameConsoleDetails || undefined,
      boardGames: data.boardGames || undefined,
      books: data.books || undefined,
    };
    await onSave({ entertainment: cleanedData });
    form.reset(data);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Loisirs & Divertissement</CardTitle>
              <CardDescription>Équipements de divertissement disponibles</CardDescription>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked, { shouldDirty: true })}
              disabled={isSaving}
            />
          </div>
        </CardHeader>
        {enabled && (
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Télévision</Label>
                <Switch
                  checked={watch("hasTv")}
                  onCheckedChange={(checked) => setValue("hasTv", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasTv") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="tvChannels">Chaînes disponibles</Label>
                    <Input 
                      id="tvChannels" 
                      placeholder="Ex: TNT, Canal+, BeIN Sports..."
                      {...form.register("tvChannels")} 
                      disabled={isSaving} 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Netflix</Label>
                <Switch
                  checked={watch("hasNetflix")}
                  onCheckedChange={(checked) => setValue("hasNetflix", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasNetflix") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="netflixInstructions">Instructions</Label>
                    <Textarea 
                      id="netflixInstructions" 
                      rows={2}
                      placeholder="Comment accéder à Netflix..."
                      {...form.register("netflixInstructions")} 
                      disabled={isSaving} 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Spotify / Musique</Label>
                <Switch
                  checked={watch("hasSpotify")}
                  onCheckedChange={(checked) => setValue("hasSpotify", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasSpotify") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="spotifyInstructions">Instructions</Label>
                    <Textarea 
                      id="spotifyInstructions" 
                      rows={2}
                      {...form.register("spotifyInstructions")} 
                      disabled={isSaving} 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Console de jeux</Label>
                <Switch
                  checked={watch("hasGameConsole")}
                  onCheckedChange={(checked) => setValue("hasGameConsole", checked, { shouldDirty: true })}
                  disabled={isSaving}
                />
              </div>
              {watch("hasGameConsole") && (
                <div className="ml-4 border-l-2 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="gameConsoleDetails">Détails</Label>
                    <Input 
                      id="gameConsoleDetails" 
                      placeholder="Ex: PS5 avec FIFA, GTA..."
                      {...form.register("gameConsoleDetails")} 
                      disabled={isSaving} 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="boardGames">Jeux de société</Label>
              <Input 
                id="boardGames" 
                placeholder="Ex: Monopoly, Uno, échecs..."
                {...form.register("boardGames")} 
                disabled={isSaving} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="books">Livres</Label>
              <Input 
                id="books" 
                placeholder="Ex: Bibliothèque dans le salon"
                {...form.register("books")} 
                disabled={isSaving} 
              />
            </div>
          </CardContent>
        )}
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
