"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Video,
  Palette,
  MessageSquare,
  Bot,
  TrendingUp,
  Clock,
  ArrowRight,
  Activity,
} from "lucide-react";

const stats = [
  { label: "Emotions Shared", value: "2,847", change: "+12%", icon: Activity },
  { label: "Conversations", value: "156", change: "+8%", icon: MessageSquare },
  { label: "Video Calls", value: "23", change: "+15%", icon: Video },
  { label: "Patterns", value: "48", change: "+5%", icon: Palette },
];

const quickActions = [
  {
    title: "Video Call",
    description: "Start emotion-recognized call",
    icon: Video,
    href: "/dashboard/calls",
  },
  {
    title: "Create Pattern",
    description: "Express with visuals",
    icon: Palette,
    href: "/dashboard/patterns",
  },
  {
    title: "Send Message",
    description: "Craft emotion message",
    icon: MessageSquare,
    href: "/dashboard/chat",
  },
  {
    title: "AI Avatar",
    description: "Talk to your companion",
    icon: Bot,
    href: "/dashboard/avatar",
  },
];

const recentActivity = [
  { title: "Video call with Sarah", time: "2 hours ago", type: "call" },
  { title: "Sent message to Mom", time: "5 hours ago", type: "message" },
  { title: "Created calm pattern", time: "Yesterday", type: "pattern" },
  { title: "Avatar learned expression", time: "2 days ago", type: "avatar" },
];

const emotionStats = [
  { emotion: "Joy", percentage: 35 },
  { emotion: "Gratitude", percentage: 25 },
  { emotion: "Calm", percentage: 20 },
  { emotion: "Love", percentage: 15 },
  { emotion: "Other", percentage: 5 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, Alex</p>
        </div>
        <Link href="/dashboard/calls">
          <Button variant="primary" size="sm">
            <Video className="w-4 h-4" />
            New Call
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-medium text-slate-900 mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card hover className="h-full">
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center mb-3">
                    <action.icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-slate-900">Recent Activity</h2>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center">
                      {activity.type === "call" && <Video className="w-4 h-4 text-slate-500" />}
                      {activity.type === "message" && <MessageSquare className="w-4 h-4 text-slate-500" />}
                      {activity.type === "pattern" && <Palette className="w-4 h-4 text-slate-500" />}
                      {activity.type === "avatar" && <Bot className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{activity.title}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emotion Stats */}
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-slate-900">Emotion Insights</h2>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-3">
                {emotionStats.map((item) => (
                  <div key={item.emotion}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{item.emotion}</span>
                      <span className="text-xs text-slate-500">{item.percentage}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-md bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-600">
                  Expressing more positive emotions this week.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Avatar Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Your AI Avatar</h3>
                <p className="text-sm text-slate-500">48 patterns learned · Ready to help</p>
              </div>
            </div>
            <Link href="/dashboard/avatar">
              <Button variant="outline" size="sm">
                Chat Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
