import { Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  userName: string;
  onLogout: () => void;
}

export function AdminHeader({ userName, onLogout }: AdminHeaderProps) {
  return (
    <header className="border-b bg-white dark:bg-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Home className="h-6 w-6" />
          <h1 className="text-xl font-bold">OneStay Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{userName}</span>
          <Button variant="outline" size="icon" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
