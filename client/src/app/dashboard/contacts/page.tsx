"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Plus,
  UserPlus,
  Phone,
  Video,
  MessageCircleHeart,
  MoreVertical,
  Star,
  StarOff,
  Mail,
  X,
  Check,
  Heart,
  Clock,
} from "lucide-react";

// Mock contacts
const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "SJ",
    email: "sarah.johnson@email.com",
    phone: "+1 234 567 8900",
    status: "online",
    favorite: true,
    emotionHistory: ["Happy", "Excited", "Grateful"],
    lastInteraction: "2 hours ago",
  },
  {
    id: 2,
    name: "Mom",
    avatar: "M",
    email: "mom@email.com",
    phone: "+1 234 567 8901",
    status: "online",
    favorite: true,
    emotionHistory: ["Love", "Peaceful", "Nostalgic"],
    lastInteraction: "Yesterday",
  },
  {
    id: 3,
    name: "David Chen",
    avatar: "DC",
    email: "david.chen@email.com",
    phone: "+1 234 567 8902",
    status: "offline",
    favorite: false,
    emotionHistory: ["Curious", "Focused"],
    lastInteraction: "3 days ago",
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "EW",
    email: "emma.wilson@email.com",
    phone: "+1 234 567 8903",
    status: "offline",
    favorite: false,
    emotionHistory: ["Joy", "Excitement"],
    lastInteraction: "1 week ago",
  },
  {
    id: 5,
    name: "Michael Brown",
    avatar: "MB",
    email: "michael.b@email.com",
    phone: "+1 234 567 8904",
    status: "away",
    favorite: true,
    emotionHistory: ["Calm", "Thoughtful"],
    lastInteraction: "5 days ago",
  },
];

// Pending requests
const pendingRequests = [
  {
    id: 1,
    name: "Alex Thompson",
    avatar: "AT",
    message: "Would love to connect and share emotions!",
  },
  {
    id: 2,
    name: "Lisa Park",
    avatar: "LP",
    message: "Hi! I saw your profile and would like to connect.",
  },
];

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | "online">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "favorites" && contact.favorite) ||
      (filter === "online" && contact.status === "online");
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-amber-500";
      default:
        return "bg-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
          <p className="text-slate-500">
            Manage your connections and share emotions
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsAddModalOpen(true)}
        >
          <UserPlus className="w-5 h-5" />
          Add Contact
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search contacts..."
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {[
                    { key: "all", label: "All" },
                    { key: "favorites", label: "Favorites" },
                    { key: "online", label: "Online" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setFilter(item.key as typeof filter)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        filter === item.key
                          ? "bg-coral text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacts Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  hover
                  className={`cursor-pointer ${
                    selectedContact === contact.id ? "ring-2 ring-coral" : ""
                  }`}
                  onClick={() => setSelectedContact(contact.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral to-peach flex items-center justify-center text-white font-medium text-lg">
                          {contact.avatar}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                            contact.status
                          )}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {contact.name}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Toggle favorite
                            }}
                            className="text-amber hover:scale-110 transition-transform"
                          >
                            {contact.favorite ? (
                              <Star className="w-5 h-5 fill-amber" />
                            ) : (
                              <StarOff className="w-5 h-5 text-slate-300" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-slate-500 truncate">
                          {contact.email}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-400">
                            {contact.lastInteraction}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Emotion Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {contact.emotionHistory.slice(0, 3).map((emotion) => (
                        <span
                          key={emotion}
                          className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircleHeart className="w-4 h-4" />
                        Message
                      </Button>
                      <Button variant="outline" size="icon" className="w-9 h-9">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="w-9 h-9">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Contacts", value: contacts.length, icon: Users },
                  {
                    label: "Online Now",
                    value: contacts.filter((c) => c.status === "online").length,
                    icon: Heart,
                  },
                  {
                    label: "Favorites",
                    value: contacts.filter((c) => c.favorite).length,
                    icon: Star,
                  },
                  { label: "Pending", value: pendingRequests.length, icon: Clock },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3 rounded-xl bg-slate-50 text-center"
                  >
                    <stat.icon className="w-5 h-5 text-coral mx-auto mb-1" />
                    <p className="text-xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  Pending Requests
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-coral text-white rounded-full">
                  {pendingRequests.length}
                </span>
              </div>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-xl bg-slate-50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-teal-light flex items-center justify-center text-white font-medium text-sm">
                        {request.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {request.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {request.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" className="flex-1">
                        <Check className="w-4 h-4" />
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <X className="w-4 h-4" />
                        Decline
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Find New Friends */}
          <Card className="bg-gradient-to-br from-coral/10 to-peach/10 border-coral/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-peach mx-auto mb-4 flex items-center justify-center shadow-lg shadow-coral/20">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Find New Friends
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Connect with others who understand emotional communication
              </p>
              <Button variant="primary" className="w-full">
                <Search className="w-5 h-5" />
                Explore
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Add New Contact
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <Input label="Name" placeholder="Enter contact name" />
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  icon={<Mail className="w-5 h-5" />}
                />
                <Input
                  label="Phone (optional)"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  icon={<Phone className="w-5 h-5" />}
                />
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1">
                    <Plus className="w-5 h-5" />
                    Add Contact
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
