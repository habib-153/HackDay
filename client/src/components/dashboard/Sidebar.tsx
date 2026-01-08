"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  Palette,
  MessageSquare,
  Bot,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Video Calls", href: "/dashboard/calls", icon: Video },
  { name: "Patterns", href: "/dashboard/patterns", icon: Palette },
  { name: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Avatar", href: "/dashboard/avatar", icon: Bot },
];

const secondaryNavItems = [
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-slate-200 flex flex-col z-40">
      {/* Logo */}
      <div className="h-14 px-4 flex items-center border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="text-base font-semibold text-slate-900">HeartSpeak</span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="my-4 border-t border-slate-100" />

        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-slate-200">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-medium">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Alex Johnson</p>
            <p className="text-xs text-slate-500 truncate">alex@example.com</p>
          </div>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
