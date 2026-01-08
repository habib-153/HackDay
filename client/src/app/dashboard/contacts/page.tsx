"use client";

import { useState } from "react";
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
  MessageSquare,
  Star,
  StarOff,
  Mail,
  X,
  Check,
  Heart,
  Clock,
} from "lucide-react";

const contacts = [
  { id: 1, name: "Sarah Johnson", avatar: "SJ", email: "sarah.j@email.com", phone: "+1 234 567 8900", status: "online", favorite: true, emotions: ["Happy", "Excited"], lastInteraction: "2 hours ago" },
  { id: 2, name: "Mom", avatar: "M", email: "mom@email.com", phone: "+1 234 567 8901", status: "online", favorite: true, emotions: ["Love", "Peaceful"], lastInteraction: "Yesterday" },
  { id: 3, name: "David Chen", avatar: "DC", email: "david.c@email.com", phone: "+1 234 567 8902", status: "offline", favorite: false, emotions: ["Curious"], lastInteraction: "3 days ago" },
  { id: 4, name: "Emma Wilson", avatar: "EW", email: "emma.w@email.com", phone: "+1 234 567 8903", status: "offline", favorite: false, emotions: ["Joy"], lastInteraction: "1 week ago" },
  { id: 5, name: "Michael Brown", avatar: "MB", email: "michael.b@email.com", phone: "+1 234 567 8904", status: "away", favorite: true, emotions: ["Calm"], lastInteraction: "5 days ago" },
];

const pendingRequests = [
  { id: 1, name: "Alex Thompson", avatar: "AT", message: "Would love to connect!" },
  { id: 2, name: "Lisa Park", avatar: "LP", message: "Hi! Let's connect." },
];

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | "online">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "favorites" && contact.favorite) || (filter === "online" && contact.status === "online");
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500";
      case "away": return "bg-amber-500";
      default: return "bg-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Contacts</h1>
          <p className="text-sm text-slate-500">Manage your connections</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Contacts List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search contacts..." className="pl-9" />
                </div>
                <div className="flex gap-2">
                  {[{ key: "all", label: "All" }, { key: "favorites", label: "Favorites" }, { key: "online", label: "Online" }].map((item) => (
                    <button key={item.key} onClick={() => setFilter(item.key as typeof filter)} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${filter === item.key ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-3">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} hover className={`cursor-pointer ${selectedContact === contact.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedContact(contact.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 font-medium">{contact.avatar}</div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-slate-900 truncate">{contact.name}</h3>
                        <button onClick={(e) => { e.stopPropagation(); }} className="text-amber-500 hover:scale-110 transition-transform">
                          {contact.favorite ? <Star className="w-4 h-4 fill-amber-500" /> : <StarOff className="w-4 h-4 text-slate-300" />}
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 truncate">{contact.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">{contact.lastInteraction}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {contact.emotions.map((emotion) => (
                      <span key={emotion} className="px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-600">{emotion}</span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1"><MessageSquare className="w-4 h-4" />Message</Button>
                    <Button variant="outline" size="icon" className="w-8 h-8"><Video className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" className="w-8 h-8"><Phone className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-slate-900 mb-3">Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total", value: contacts.length, icon: Users },
                  { label: "Online", value: contacts.filter((c) => c.status === "online").length, icon: Heart },
                  { label: "Favorites", value: contacts.filter((c) => c.favorite).length, icon: Star },
                  { label: "Pending", value: pendingRequests.length, icon: Clock },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-md bg-slate-50 text-center">
                    <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-slate-900">Pending Requests</h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-md">{pendingRequests.length}</span>
              </div>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-3 rounded-md bg-slate-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-medium">{request.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{request.name}</p>
                        <p className="text-xs text-slate-500 truncate">{request.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" className="flex-1"><Check className="w-4 h-4" />Accept</Button>
                      <Button variant="outline" size="sm" className="flex-1"><X className="w-4 h-4" />Decline</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-md bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Find Friends</h3>
              <p className="text-xs text-slate-500 mb-3">Connect with others</p>
              <Button variant="primary" className="w-full"><Search className="w-4 h-4" />Explore</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsAddModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-900">Add Contact</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5" /></Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <Input placeholder="Name" />
              <Input type="email" placeholder="Email" />
              <Input type="tel" placeholder="Phone (optional)" />
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1"><Plus className="w-4 h-4" />Add</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
