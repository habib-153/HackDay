"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  Menu,
  X,
  Heart,
  Video,
  MessageCircleHeart,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Header({ onMenuClick, isMobileMenuOpen }: HeaderProps) {
  const [hasNotifications] = useState(true);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-foreground transition-colors"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Logo */}
      <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral to-peach flex items-center justify-center">
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>
      </Link>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts, conversations..."
            className="w-full h-11 pl-12 pr-4 rounded-xl bg-slate-50 border border-transparent text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-200 focus:ring-2 focus:ring-coral/10 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden lg:inline">New Call</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircleHeart className="w-4 h-4" />
            <span className="hidden lg:inline">New Chat</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-slate-200" />

        {/* Notifications */}
        <button className="relative p-2 text-slate-600 hover:text-foreground hover:bg-slate-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full"
            />
          )}
        </button>

        {/* User Avatar */}
        <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender to-rose flex items-center justify-center text-white font-semibold hover:opacity-90 transition-opacity">
          A
        </button>
      </div>
    </header>
  );
}

