"use client";

import { cn } from "@/lib/utils";
import { House, Folder } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileImage from "./ProfileImage";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navs = [
  {
    label: "Home",
    href: "/",
    icon: House,
  },
  {
    label: "Library",
    href: "/library",
    icon: Folder,
  },
];

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between gap-2 bg-secondary p-3 border-b">
      <div className="flex items-center gap-2">
        {navs.map((nav) => (
          <Link
            className={cn(
              "flex items-center gap-2 px-4 text-sm py-2 rounded-md hover:bg-neutral-200 transition-colors",
              pathname === nav.href && "font-medium bg-neutral-200"
            )}
            href={nav.href}
            key={nav.href}
          >
            <nav.icon size={16} />
            {nav.label}
          </Link>
        ))}
      </div>

      {session?.user.name && (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <ProfileImage name={session.user.name} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit" align="end" side="bottom">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <div className="flex flex-col text-start">
                  <h1>{session.user.name}</h1>
                  <p className="text-secondary-foreground text-xs truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 cursor-pointer"
              onClick={async () => {
                await signOut({
                  callbackUrl: "/login",
                  redirect: true,
                });
              }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default Header;
