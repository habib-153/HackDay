"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Video,
  Phone,
  Search,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { VideoCall } from "@/components/video-call";
import { useSocket } from "@/hooks/useSocket";
import { api } from "@/lib/api";

const MOCK_USER_ID = "user_demo_123";
const MOCK_TOKEN = api.getAccessToken() || "demo_token";

const mockContacts = [
  { id: "contact_1", name: "Sarah Johnson", avatar: "SJ", status: "online" as const, lastCall: "2 hours ago" },
  { id: "contact_2", name: "Mom", avatar: "M", status: "online" as const, lastCall: "Yesterday" },
  { id: "contact_3", name: "David Chen", avatar: "DC", status: "offline" as const, lastCall: "3 days ago" },
  { id: "contact_4", name: "Emma Wilson", avatar: "EW", status: "online" as const, lastCall: "1 week ago" },
];

const mockRecentCalls = [
  { id: "call_1", contact: "Sarah Johnson", contactId: "contact_1", avatar: "SJ", duration: "23 min", time: "Today, 2:30 PM", emotions: ["Happy", "Grateful"], type: "outgoing" as const },
  { id: "call_2", contact: "Mom", contactId: "contact_2", avatar: "M", duration: "45 min", time: "Yesterday", emotions: ["Love", "Peaceful"], type: "incoming" as const },
  { id: "call_3", contact: "David Chen", contactId: "contact_3", avatar: "DC", duration: "12 min", time: "Jan 5", emotions: ["Curious"], type: "outgoing" as const },
];

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  lastCall: string;
}

export default function VideoCallsPage() {
  const [contacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [showCallScreen, setShowCallScreen] = useState(false);

  const { isConnected, on, off } = useSocket({
    autoConnect: !!MOCK_TOKEN,
    token: MOCK_TOKEN,
  });

  useEffect(() => {
    if (!isConnected) return;

    const handleIncomingCall = (data: { callId: string; callerId: string }) => {
      const caller = contacts.find((c) => c.id === data.callerId);
      if (caller) {
        setSelectedContact(caller);
        setShowCallScreen(true);
      }
    };

    on("call:incoming", handleIncomingCall);
    return () => { off("call:incoming"); };
  }, [isConnected, contacts, on, off]);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startCallWithContact = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setShowCallScreen(true);
    setIsInCall(true);
  }, []);

  const handleCallEnd = useCallback(() => {
    setIsInCall(false);
    setShowCallScreen(false);
    setSelectedContact(null);
  }, []);

  const backToContacts = useCallback(() => {
    if (!isInCall) {
      setShowCallScreen(false);
      setSelectedContact(null);
    }
  }, [isInCall]);

  if (showCallScreen && selectedContact) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900">
        {!isInCall && (
          <button
            onClick={backToContacts}
            className="absolute top-4 left-4 z-50 p-2 rounded-md bg-black/30 hover:bg-black/50 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <VideoCall
          userId={MOCK_USER_ID}
          token={MOCK_TOKEN}
          contactId={selectedContact.id}
          contactName={selectedContact.name}
          contactAvatar={selectedContact.avatar}
          autoCall={true}
          onCallEnd={handleCallEnd}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Video Calls</h1>
          <p className="text-sm text-slate-500">Emotion-recognized video calling</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-slate-300"}`} />
          <span className="text-xs text-slate-500">{isConnected ? "Connected" : "Connecting..."}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left - Contacts */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search contacts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium text-slate-900">Contacts</h2>
                <span className="text-xs text-slate-500">
                  {contacts.filter((c) => c.status === "online").length} online
                </span>
              </div>
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => startCallWithContact(contact)}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-medium">
                        {contact.avatar}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${contact.status === "online" ? "bg-emerald-500" : "bg-slate-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{contact.name}</p>
                      <p className="text-xs text-slate-500">Last: {contact.lastCall}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                      onClick={(e) => { e.stopPropagation(); startCallWithContact(contact); }}
                    >
                      <Video className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="font-medium text-slate-900 mb-3">Recent Calls</h2>
              <div className="space-y-2">
                {mockRecentCalls.map((call) => (
                  <div
                    key={call.id}
                    onClick={() => {
                      const contact = contacts.find((c) => c.id === call.contactId);
                      if (contact) startCallWithContact(contact);
                    }}
                    className="p-3 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">
                        {call.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{call.contact}</p>
                        <p className="text-xs text-slate-500">{call.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-600">{call.duration}</p>
                        <p className={`text-xs ${call.type === "incoming" ? "text-emerald-600" : "text-blue-600"}`}>
                          {call.type === "incoming" ? "↓ In" : "↑ Out"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {call.emotions.map((emotion) => (
                        <span key={emotion} className="px-2 py-0.5 text-xs rounded-md bg-white text-slate-600">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right - Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <div className="relative aspect-video bg-slate-800 flex items-center justify-center rounded-t-lg">
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-md bg-slate-700 flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-white text-lg font-medium mb-2">Emotion Video Calls</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
                    Real-time facial expression analysis that translates emotions into natural language.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      const onlineContact = contacts.find((c) => c.status === "online");
                      if (onlineContact) startCallWithContact(onlineContact);
                    }}
                  >
                    <Phone className="w-4 h-4" />
                    Start Call
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { title: "Real-time Analysis", desc: "AI analyzes expressions every 2-3 seconds" },
                    { title: "Emotion Translation", desc: "Feelings translated to natural language" },
                    { title: "Deeper Connection", desc: "Help others understand your emotions" },
                  ].map((feature) => (
                    <div key={feature.title} className="p-3 rounded-md bg-slate-50">
                      <h4 className="text-sm font-medium text-slate-900 mb-1">{feature.title}</h4>
                      <p className="text-xs text-slate-500">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
