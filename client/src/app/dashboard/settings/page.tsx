"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
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
} from "lucide-react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "avatar", label: "AI Avatar", icon: Bot },
  { id: "language", label: "Language", icon: Globe },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, emotion: true, weekly: false, sound: true });
  const [privacy, setPrivacy] = useState({ profile: true, emotions: false, online: true, receipts: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Navigation */}
        <Card className="h-fit">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeSection === section.id ? "bg-primary/10 text-primary font-medium" : "text-slate-600 hover:bg-slate-50"}`}>
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
              <Button variant="outline" className="w-full justify-start text-sm"><LogOut className="w-4 h-4" />Log Out</Button>
              <Button variant="ghost" className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" />Delete Account</Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {activeSection === "profile" && (
            <>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-medium text-slate-900 mb-4">Profile</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 text-xl font-semibold">U</div>
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-50">
                        <Camera className="w-3 h-3 text-slate-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Profile Photo</h3>
                      <p className="text-xs text-slate-500 mb-2">JPG, PNG or GIF. Max 5MB.</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Upload</Button>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input placeholder="Full Name" defaultValue="User" />
                    <Input placeholder="Username" defaultValue="@user" />
                    <Input type="email" placeholder="Email" defaultValue="user@example.com" />
                    <Input type="tel" placeholder="Phone" defaultValue="+1 234 567 8900" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-slate-700 mb-1">Bio</label>
                    <textarea className="w-full h-20 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-sm" placeholder="Tell others about yourself..." defaultValue="Expressing emotions through HeartSpeak" />
                  </div>
                  <Button variant="primary" className="mt-4"><Save className="w-4 h-4" />Save</Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-medium text-slate-900 mb-4">Password</h2>
                  <div className="space-y-3 max-w-sm">
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="Current Password" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Input type="password" placeholder="New Password" />
                    <Input type="password" placeholder="Confirm New Password" />
                    <Button variant="primary">Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardContent className="p-4">
                <h2 className="font-medium text-slate-900 mb-4">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { key: "email", icon: Mail, title: "Email Notifications", desc: "Receive via email" },
                    { key: "push", icon: Bell, title: "Push Notifications", desc: "Receive on device" },
                    { key: "emotion", icon: Bot, title: "Emotion Insights", desc: "AI pattern alerts" },
                    { key: "weekly", icon: Mail, title: "Weekly Digest", desc: "Weekly summary" },
                    { key: "sound", icon: Volume2, title: "Sound", desc: "Notification sounds" },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 rounded-md bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
                          <setting.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{setting.title}</p>
                          <p className="text-xs text-slate-500">{setting.desc}</p>
                        </div>
                      </div>
                      <button onClick={() => setNotifications((prev) => ({ ...prev, [setting.key]: !prev[setting.key as keyof typeof prev] }))} className={`relative w-10 h-5 rounded-full transition-colors ${notifications[setting.key as keyof typeof notifications] ? "bg-primary" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${notifications[setting.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "privacy" && (
            <>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-medium text-slate-900 mb-4">Privacy</h2>
                  <div className="space-y-4">
                    {[
                      { key: "profile", title: "Public Profile", desc: "Allow others to view" },
                      { key: "emotions", title: "Emotion History", desc: "Show to contacts" },
                      { key: "online", title: "Online Status", desc: "Show when online" },
                      { key: "receipts", title: "Read Receipts", desc: "Show read status" },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-3 rounded-md bg-slate-50">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{setting.title}</p>
                          <p className="text-xs text-slate-500">{setting.desc}</p>
                        </div>
                        <button onClick={() => setPrivacy((prev) => ({ ...prev, [setting.key]: !prev[setting.key as keyof typeof prev] }))} className={`relative w-10 h-5 rounded-full transition-colors ${privacy[setting.key as keyof typeof privacy] ? "bg-primary" : "bg-slate-300"}`}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${privacy[setting.key as keyof typeof privacy] ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-medium text-slate-900 mb-4">Security</h2>
                  <div className="space-y-2">
                    {["Download Your Data", "Two-Factor Auth", "Active Sessions"].map((item) => (
                      <Button key={item} variant="outline" className="w-full justify-between">{item}<ChevronRight className="w-4 h-4" /></Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "appearance" && (
            <Card>
              <CardContent className="p-4">
                <h2 className="font-medium text-slate-900 mb-4">Appearance</h2>
                <div className="mb-6">
                  <h3 className="text-sm text-slate-700 mb-3">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ id: "light", label: "Light", icon: Sun }, { id: "dark", label: "Dark", icon: Moon }, { id: "system", label: "System", icon: Smartphone }].map((theme) => (
                      <button key={theme.id} onClick={() => setIsDarkMode(theme.id === "dark")} className={`p-3 rounded-md border-2 transition-all ${(theme.id === "light" && !isDarkMode) || (theme.id === "dark" && isDarkMode) ? "border-primary bg-primary/10" : "border-slate-200 hover:border-slate-300"}`}>
                        <theme.icon className="w-5 h-5 mx-auto mb-2 text-slate-600" />
                        <p className="text-sm text-slate-900">{theme.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-slate-700 mb-3">Accent Color</h3>
                  <div className="flex gap-2">
                    {[{ color: "bg-primary", name: "Green" }, { color: "bg-blue-500", name: "Blue" }, { color: "bg-purple-500", name: "Purple" }, { color: "bg-amber-500", name: "Amber" }, { color: "bg-rose-500", name: "Rose" }].map((accent, index) => (
                      <button key={accent.name} className={`w-8 h-8 rounded-full ${accent.color} flex items-center justify-center hover:scale-110 transition-transform ${index === 0 ? "ring-2 ring-offset-2 ring-primary" : ""}`}>
                        {index === 0 && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "avatar" && (
            <Card>
              <CardContent className="p-4">
                <h2 className="font-medium text-slate-900 mb-4">AI Avatar</h2>
                <div className="flex items-center gap-4 mb-6 p-4 rounded-md bg-primary/5 border border-primary/20">
                  <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center">
                    <Bot className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Your AI Avatar</h3>
                    <p className="text-sm text-slate-500 mb-2">48 patterns · 94% accuracy</p>
                    <Button variant="outline" size="sm">Reset Learning</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-slate-700 mb-3">Personality</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["Empathetic", "Encouraging", "Calm", "Enthusiastic"].map((style, i) => (
                        <button key={style} className={`p-3 rounded-md border-2 text-left text-sm transition-all ${i === 0 ? "border-primary bg-primary/10" : "border-slate-200 hover:border-slate-300"}`}>
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-slate-700 mb-3">Response Length</h3>
                    <input type="range" min="0" max="100" defaultValue="50" className="w-full accent-primary" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Concise</span><span>Detailed</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "language" && (
            <Card>
              <CardContent className="p-4">
                <h2 className="font-medium text-slate-900 mb-4">Language & Region</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Language</label>
                    <select className="w-full h-10 px-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                      <option>English (US)</option><option>English (UK)</option><option>Spanish</option><option>French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Timezone</label>
                    <select className="w-full h-10 px-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                      <option>UTC-08:00 Pacific</option><option>UTC-05:00 Eastern</option><option>UTC+00:00 GMT</option>
                    </select>
                  </div>
                  <Button variant="primary"><Save className="w-4 h-4" />Save</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
