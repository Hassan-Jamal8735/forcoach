"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/(auth)/actions";

function initialsFrom(nameOrEmail: string) {
  const trimmed = nameOrEmail.trim();
  if (!trimmed) return "FC";
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function TopBar({
  displayName,
  isAdmin = false,
}: {
  displayName: string;
  isAdmin?: boolean;
}) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:px-8">
      <div className="md:hidden font-heading text-base font-semibold">
        FORCOACH
      </div>
      <div className="hidden md:block" />
      <DropdownMenu>
        <DropdownMenuTrigger className="group flex items-center gap-1.5 rounded-full outline-none">
          <Avatar className="size-8">
            <AvatarFallback className="bg-accent text-accent-foreground text-xs">
              {initialsFrom(displayName)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-aria-expanded:rotate-180" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/support")}>
            Support
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/guide")}>
            Help Centre
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              Admin
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => logout()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
