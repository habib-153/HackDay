"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Bot,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  LogOut,
  Trash2,
  ChevronRight,
  Check,
  Volume2,
  Vibrate,
} from "lucide-react";

// Settings sections
const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "avatar", label: "AI Avatar", icon: Bot },
  { id: "language", label: "Language", icon: Globe },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Toggle states for notifications
  const [notifications, setNotifications] = useState({
    emailNotifs: true,
    pushNotifs: true,
    emotionAlerts: true,
    weeklyDigest: false,
    soundEnabled: true,
    vibration: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    emotionHistoryVisible: false,
    onlineStatus: true,
    readReceipts: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-slate-500">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? "bg-coral/10 text-coral"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  {section.label}
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </nav>

            {/* Logout & Delete */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="w-5 h-5" />
                Log Out
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeSection === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Profile Information
                  </h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-coral to-peach flex items-center justify-center text-white text-2xl font-bold">
                        U
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <Camera className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        Profile Photo
                      </h3>
                      <p className="text-sm text-slate-500 mb-2">
                        JPG, PNG or GIF. Max 5MB.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Upload
                        </Button>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      defaultValue="User"
                      icon={<User className="w-5 h-5" />}
                    />
                    <Input
                      label="Username"
                      defaultValue="@user"
                      icon={<User className="w-5 h-5" />}
                    />
                    <Input
                      label="Email"
                      type="email"
                      defaultValue="user@example.com"
                      icon={<Mail className="w-5 h-5" />}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      defaultValue="+1 234 567 8900"
                      icon={<Smartphone className="w-5 h-5" />}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral resize-none"
                      placeholder="Tell others about yourself..."
                      defaultValue="Expressing emotions through HeartSpeak AI 💖"
                    />
                  </div>

                  <Button variant="primary" className="mt-6">
                    <Save className="w-5 h-5" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Change Password
                  </h2>
                  <div className="space-y-4 max-w-md">
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        icon={<Lock className="w-5 h-5" />}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                      icon={<Lock className="w-5 h-5" />}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="••••••••"
                      icon={<Lock className="w-5 h-5" />}
                    />
                    <Button variant="primary">
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Notifications Settings */}
          {activeSection === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    {[
                      {
                        key: "emailNotifs",
                        icon: Mail,
                        title: "Email Notifications",
                        description: "Receive notifications via email",
                      },
                      {
                        key: "pushNotifs",
                        icon: Bell,
                        title: "Push Notifications",
                        description: "Receive push notifications on your device",
                      },
                      {
                        key: "emotionAlerts",
                        icon: Bot,
                        title: "Emotion Insights",
                        description:
                          "Get notified when AI detects important emotional patterns",
                      },
                      {
                        key: "weeklyDigest",
                        icon: Mail,
                        title: "Weekly Digest",
                        description: "Receive a weekly summary of your emotional journey",
                      },
                      {
                        key: "soundEnabled",
                        icon: Volume2,
                        title: "Sound",
                        description: "Play sounds for notifications",
                      },
                      {
                        key: "vibration",
                        icon: Vibrate,
                        title: "Vibration",
                        description: "Vibrate for notifications on mobile",
                      },
                    ].map((setting) => (
                      <div
                        key={setting.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                            <setting.icon className="w-5 h-5 text-coral" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {setting.title}
                            </p>
                            <p className="text-sm text-slate-500">
                              {setting.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setNotifications((prev) => ({
                              ...prev,
                              [setting.key]:
                                !prev[setting.key as keyof typeof prev],
                            }))
                          }
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications[setting.key as keyof typeof notifications]
                              ? "bg-coral"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                              notifications[setting.key as keyof typeof notifications]
                                ? "translate-x-7"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Privacy Settings */}
          {activeSection === "privacy" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Privacy Settings
                  </h2>

                  <div className="space-y-6">
                    {[
                      {
                        key: "profileVisible",
                        title: "Public Profile",
                        description:
                          "Allow others to discover and view your profile",
                      },
                      {
                        key: "emotionHistoryVisible",
                        title: "Emotion History",
                        description:
                          "Show your recent emotions to your contacts",
                      },
                      {
                        key: "onlineStatus",
                        title: "Online Status",
                        description: "Show when you're online to your contacts",
                      },
                      {
                        key: "readReceipts",
                        title: "Read Receipts",
                        description: "Let others know when you've read their messages",
                      },
                    ].map((setting) => (
                      <div
                        key={setting.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {setting.title}
                          </p>
                          <p className="text-sm text-slate-500">
                            {setting.description}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setPrivacy((prev) => ({
                              ...prev,
                              [setting.key]:
                                !prev[setting.key as keyof typeof prev],
                            }))
                          }
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            privacy[setting.key as keyof typeof privacy]
                              ? "bg-coral"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                              privacy[setting.key as keyof typeof privacy]
                                ? "translate-x-7"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Data & Security
                  </h2>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-between">
                      Download Your Data
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between">
                      Two-Factor Authentication
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between">
                      Active Sessions
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Appearance Settings */}
          {activeSection === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Appearance
                  </h2>

                  {/* Theme */}
                  <div className="mb-8">
                    <h3 className="font-medium text-foreground mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "light", label: "Light", icon: Sun },
                        { id: "dark", label: "Dark", icon: Moon },
                        { id: "system", label: "System", icon: Smartphone },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setIsDarkMode(theme.id === "dark")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            (theme.id === "light" && !isDarkMode) ||
                            (theme.id === "dark" && isDarkMode)
                              ? "border-coral bg-coral/10"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <theme.icon className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                          <p className="text-sm font-medium text-foreground">
                            {theme.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">
                      Accent Color
                    </h3>
                    <div className="flex gap-3">
                      {[
                        { color: "bg-coral", name: "Coral" },
                        { color: "bg-teal", name: "Teal" },
                        { color: "bg-lavender", name: "Lavender" },
                        { color: "bg-amber", name: "Amber" },
                        { color: "bg-rose", name: "Rose" },
                      ].map((accent, index) => (
                        <button
                          key={accent.name}
                          className={`w-10 h-10 rounded-full ${accent.color} flex items-center justify-center hover:scale-110 transition-transform ${
                            index === 0 ? "ring-2 ring-offset-2 ring-coral" : ""
                          }`}
                        >
                          {index === 0 && (
                            <Check className="w-5 h-5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Avatar Settings */}
          {activeSection === "avatar" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    AI Avatar Settings
                  </h2>

                  <div className="flex items-center gap-6 mb-8 p-4 rounded-xl bg-gradient-to-br from-amber/10 to-peach/10 border border-amber/20">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber to-peach flex items-center justify-center shadow-lg">
                      <Bot className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Your AI Avatar
                      </h3>
                      <p className="text-sm text-slate-500 mb-2">
                        Learned 48 patterns • 94% accuracy
                      </p>
                      <Button variant="outline" size="sm">
                        Reset Learning
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-foreground mb-4">
                        Personality Style
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: "empathetic", label: "Empathetic", selected: true },
                          { id: "encouraging", label: "Encouraging", selected: false },
                          { id: "calm", label: "Calm & Gentle", selected: false },
                          { id: "enthusiastic", label: "Enthusiastic", selected: false },
                        ].map((style) => (
                          <button
                            key={style.id}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              style.selected
                                ? "border-coral bg-coral/10"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <p className="font-medium text-foreground">
                              {style.label}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-foreground mb-4">
                        Response Length
                      </h3>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="50"
                        className="w-full accent-coral"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>Concise</span>
                        <span>Detailed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Language Settings */}
          {activeSection === "language" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Language & Region
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Display Language
                      </label>
                      <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                        <option>Chinese (Simplified)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Timezone
                      </label>
                      <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral">
                        <option>UTC-08:00 Pacific Time</option>
                        <option>UTC-05:00 Eastern Time</option>
                        <option>UTC+00:00 GMT</option>
                        <option>UTC+01:00 Central European Time</option>
                        <option>UTC+09:00 Japan Standard Time</option>
                      </select>
                    </div>

                    <Button variant="primary" className="mt-4">
                      <Save className="w-5 h-5" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
