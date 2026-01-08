"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Video,
  Palette,
  MessageCircleHeart,
  Bot,
  TrendingUp,
  Heart,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Phone,
  Smile,
  Activity,
} from "lucide-react";

// Stats data
const stats = [
  {
    label: "Emotions Shared",
    value: "2,847",
    change: "+12%",
    icon: Heart,
    color: "coral",
  },
  {
    label: "Conversations",
    value: "156",
    change: "+8%",
    icon: MessageCircleHeart,
    color: "teal",
  },
  {
    label: "Video Calls",
    value: "23",
    change: "+15%",
    icon: Video,
    color: "lavender",
  },
  {
    label: "Patterns Created",
    value: "48",
    change: "+5%",
    icon: Palette,
    color: "amber",
  },
];

// Quick actions
const quickActions = [
  {
    title: "Start Video Call",
    description: "Connect with emotion recognition",
    icon: Video,
    href: "/dashboard/calls",
    gradient: "from-coral to-peach",
  },
  {
    title: "Create Pattern",
    description: "Express with visual language",
    icon: Palette,
    href: "/dashboard/patterns",
    gradient: "from-teal-dark to-teal",
  },
  {
    title: "Send Message",
    description: "Craft an emotion message",
    icon: MessageCircleHeart,
    href: "/dashboard/chat",
    gradient: "from-lavender to-rose",
  },
  {
    title: "Talk to Avatar",
    description: "Your AI companion awaits",
    icon: Bot,
    href: "/dashboard/avatar",
    gradient: "from-amber to-peach",
  },
];

// Recent activity
const recentActivity = [
  {
    type: "call",
    title: "Video call with Sarah",
    time: "2 hours ago",
    emotion: "Happy",
    icon: Phone,
  },
  {
    type: "message",
    title: "Sent gratitude message to Mom",
    time: "5 hours ago",
    emotion: "Grateful",
    icon: MessageCircleHeart,
  },
  {
    type: "pattern",
    title: "Created new calm pattern",
    time: "Yesterday",
    emotion: "Peaceful",
    icon: Palette,
  },
  {
    type: "avatar",
    title: "Avatar learned new expression",
    time: "2 days ago",
    emotion: "Curious",
    icon: Bot,
  },
];

// Emotion insights
const emotionInsights = [
  { emotion: "Joy", percentage: 35, color: "bg-amber" },
  { emotion: "Gratitude", percentage: 25, color: "bg-coral" },
  { emotion: "Calm", percentage: 20, color: "bg-teal" },
  { emotion: "Love", percentage: 15, color: "bg-rose" },
  { emotion: "Other", percentage: 5, color: "bg-slate-300" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-coral via-peach to-amber-soft p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium text-white/90">Good morning!</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, User
          </h1>
          <p className="text-white/80 max-w-lg">
            You&apos;ve shared 47 emotions this week. Your most expressed feeling was
            gratitude. Keep connecting! 💖
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link href={action.href}>
                <Card hover className="h-full group cursor-pointer">
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-500">{action.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-coral text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Open</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Activity
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Smile className="w-3 h-3" />
                          {activity.emotion}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emotion Insights */}
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Emotion Insights
                </h2>
                <Activity className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-4">
                {emotionInsights.map((item, index) => (
                  <motion.div
                    key={item.emotion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {item.emotion}
                      </span>
                      <span className="text-sm text-slate-500">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Weekly Summary */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-lavender/10 to-rose/10 border border-lavender/20">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-coral" />
                  <span className="text-sm font-medium text-foreground">
                    This Week
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  You&apos;ve been expressing more positive emotions. Keep it up! 🌟
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Avatar Status */}
      <Card className="bg-gradient-to-br from-amber/5 to-peach/5 border-amber/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber to-peach flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Your AI Avatar
                </h3>
                <p className="text-sm text-slate-500">
                  Learned 48 patterns • 89% accuracy • Ready to help
                </p>
              </div>
            </div>
            <Link href="/dashboard/avatar">
              <Button variant="primary" size="lg">
                Chat Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
