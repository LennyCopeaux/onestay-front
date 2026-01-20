"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authService } from "@/lib/auth-mock";
import { api } from "@/lib/api";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { UsersTable } from "@/components/admin/UsersTable";
import { DeleteUserDialog } from "@/components/admin/DeleteUserDialog";
import { AddUserDialog } from "@/components/admin/AddUserDialog";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import type { User, ApiUser, Role, CreateUserRequest, UpdateUserRequest } from "@/types";

export function AdminDashboardContainer() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<ApiUser | null>(null);
  const [userToEdit, setUserToEdit] = useState<ApiUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du chargement des utilisateurs");
    }
  }, []);

  const loadRoles = useCallback(async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du chargement des rôles");
    }
  }, []);

  useEffect(() => {
    const user = authService.getCurrentUser();
    
    if (!user || !authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.push("/home");
      return;
    }

    setCurrentUser(user);
    
    Promise.all([loadUsers(), loadRoles()]).finally(() => {
      setIsLoading(false);
    });
  }, [router, loadUsers, loadRoles]);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const handleAddUser = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditUser = (user: ApiUser) => {
    setUserToEdit(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: ApiUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      toast.success("Utilisateur supprimé avec succès");
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
      throw error;
    }
  };

  const handleCreateUser = async (data: CreateUserRequest) => {
    try {
      await api.createUser(data);
      toast.success("Utilisateur créé avec succès");
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
      throw error;
    }
  };

  const handleUpdateUser = async (userId: string, data: UpdateUserRequest) => {
    try {
      await api.updateUser(userId, data);
      toast.success("Utilisateur modifié avec succès");
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la modification");
      throw error;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader userName={currentUser?.name || ""} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        <StatsCards users={users} />
        <UsersTable
          users={users}
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </main>

      <DeleteUserDialog
        user={userToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
      />

      <AddUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleCreateUser}
        roles={roles}
      />

      <EditUserDialog
        user={userToEdit}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateUser}
        roles={roles}
      />
    </div>
  );
}
