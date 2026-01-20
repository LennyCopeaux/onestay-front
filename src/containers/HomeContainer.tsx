"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth-mock";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { UserProfile } from "@/components/home/UserProfile";
import type { User } from "@/types";

export function HomeContainer() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser || !authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  return <UserProfile user={user} onLogout={handleLogout} />;
}
