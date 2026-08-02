"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Link as LinkIcon,
  User,
  Palette,
  Settings,
  type LucideIcon,
} from "lucide-react";



import { useLanguage } from "@/components/providers/language-provider";

/** Sidebar nav that preserves the ?page= param across admin sections. */
export function AdminNav() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const query = pageParam ? `?page=${pageParam}` : "";
  const { t } = useLanguage();

  const NAV: { href: string; key: string; icon: LucideIcon }[] = [
    { href: "/dashboard", key: "Nav.dashboard", icon: LayoutDashboard },
    { href: "/links", key: "Nav.links", icon: LinkIcon },
    { href: "/profile", key: "Nav.pages", icon: User },
    { href: "/theme", key: "Nav.theme", icon: Palette },
    { href: "/settings", key: "Nav.settings", icon: Settings },
  ];

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={`${item.href}${query}`}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-all hover:translate-x-0.5 hover:bg-violet/15 hover:text-lavender"
        >
          <item.icon className="size-4" />
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
}
