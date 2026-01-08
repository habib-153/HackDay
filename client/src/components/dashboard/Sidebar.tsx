"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  LayoutDashboard,
  Video,
  Palette,
  MessageCircleHeart,
  Bot,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const mainNavItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Video Calls",
    href: "/dashboard/calls",
    icon: Video,
    badge: "Live",
    badgeColor: "bg-green-500",
  },
  {
    name: "Patterns",
    href: "/dashboard/patterns",
    icon: Palette,
  },
  {
    name: "Chat",
    href: "/dashboard/chat",
    icon: MessageCircleHeart,
    badge: "3",
    badgeColor: "bg-coral",
  },
  {
    name: "Avatar",
    href: "/dashboard/avatar",
    icon: Bot,
  },
];

const secondaryNavItems = [
  {
    name: "Contacts",
    href: "/dashboard/contacts",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 flex flex-col z-40">
      {/* Logo */}
      <div className="h-20 px-6 flex items-center border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral to-peach flex items-center justify-center shadow-lg shadow-coral/20">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-semibold text-foreground">HeartSpeak</span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                  isActive
                    ? "bg-gradient-to-r from-coral/10 to-peach/10 text-coral"
                    : "text-slate-600 hover:bg-slate-50 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-coral to-peach rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-coral" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>{item.name}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto px-2 py-0.5 text-xs font-medium text-white rounded-full",
                      item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-slate-100" />

        {/* Secondary Nav */}
        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-slate-100 text-foreground"
                    : "text-slate-500 hover:bg-slate-50 hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender to-rose flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Alex Johnson</p>
            <p className="text-xs text-slate-500 truncate">alex@example.com</p>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

