"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Property, UpdatePropertyRequest, Contacts, Contact, ContactType } from "@/types";

const CONTACT_TYPES: { value: ContactType; label: string }[] = [
  { value: "host", label: "Hôte" },
  { value: "concierge", label: "Concierge" },
  { value: "cleaning", label: "Ménage" },
  { value: "maintenance", label: "Maintenance" },
  { value: "emergency", label: "Urgence" },
  { value: "neighbor", label: "Voisin" },
  { value: "other", label: "Autre" },
];

interface ContactsFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => Promise<void>;
  isSaving: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function ContactsForm({ property, onSave, isSaving, onDirtyChange, formRef }: ContactsFormProps) {
  const [localContacts, setLocalContacts] = useState<Contact[]>(property.contacts?.contacts ?? []);
  
  const form = useForm<{ enabled: boolean }>({
    defaultValues: {
      enabled: property.contacts?.enabled ?? false,
    },
  });

  const { watch, setValue, formState: { isDirty: formIsDirty } } = form;
  const enabled = watch("enabled");
  const [contactsChanged, setContactsChanged] = useState(false);

  useEffect(() => {
    onDirtyChange(formIsDirty || contactsChanged);
  }, [formIsDirty, contactsChanged, onDirtyChange]);

  const handleAddContact = () => {
    const newContact: Contact = {
      id: uuidv4(),
      type: "host",
      name: "",
      phone: "",
      email: "",
      notes: "",
    };
    setLocalContacts([...localContacts, newContact]);
    setContactsChanged(true);
  };

  const handleRemoveContact = (id: string) => {
    setLocalContacts(localContacts.filter((c) => c.id !== id));
    setContactsChanged(true);
  };

  const handleContactChange = (id: string, field: keyof Contact, value: string) => {
    setLocalContacts(localContacts.map((c) => 
      c.id === id ? { ...c, [field]: value } : c
    ));
    setContactsChanged(true);
  };

  const onSubmit = async () => {
    const cleanedContacts = localContacts
      .filter((c) => c.name && c.phone)
      .map((c) => ({
        ...c,
        email: c.email || undefined,
        notes: c.notes || undefined,
      }));
    
    const cleanedData: Contacts = {
      enabled: enabled,
      contacts: cleanedContacts,
    };
    
    await onSave({ contacts: cleanedData });
    setContactsChanged(false);
  };

  return (
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>Personnes à contacter en cas de besoin</CardDescription>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked, { shouldDirty: true })}
              disabled={isSaving}
            />
          </div>
        </CardHeader>
        {enabled && (
          <CardContent className="space-y-6">
            {localContacts.map((contact, index) => (
              <Card key={contact.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <Label className="text-sm font-medium">Contact {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveContact(contact.id)}
                    disabled={isSaving}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={contact.type}
                        onValueChange={(value) => handleContactChange(contact.id, "type", value)}
                        disabled={isSaving}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTACT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => handleContactChange(contact.id, "name", e.target.value)}
                        placeholder="Nom complet"
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) => handleContactChange(contact.id, "phone", e.target.value)}
                        placeholder="+33 6 00 00 00 00"
                        disabled={isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={contact.email || ""}
                        onChange={(e) => handleContactChange(contact.id, "email", e.target.value)}
                        placeholder="email@example.com"
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={contact.notes || ""}
                      onChange={(e) => handleContactChange(contact.id, "notes", e.target.value)}
                      placeholder="Informations supplémentaires..."
                      rows={2}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button type="button" variant="outline" onClick={handleAddContact} disabled={isSaving} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un contact
            </Button>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving || (!formIsDirty && !contactsChanged)}>
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
