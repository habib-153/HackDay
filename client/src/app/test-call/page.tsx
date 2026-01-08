"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Copy, Check, Wifi } from "lucide-react";
import { io, Socket } from "socket.io-client";

/**
 * TEST PAGE FOR VIDEO CALLS ACROSS COMPUTERS
 * 
 * HOW TO TEST ON TWO COMPUTERS:
 * 
 * COMPUTER 1 (Server Host):
 * 1. Run the Node.js server with: npm run dev (in Server folder)
 * 2. Find your IP: hostname -I (e.g., 192.168.1.100)
 * 3. Open http://localhost:3000/test-call
 * 4. Enter Server IP: 192.168.1.100
 * 5. Enter User ID: alice
 * 6. Enter Contact ID: bob
 * 
 * COMPUTER 2 (Client):
 * 1. Open http://COMPUTER1_IP:3000/test-call
 * 2. Enter Server IP: 192.168.1.100 (same as Computer 1)
 * 3. Enter User ID: bob  
 * 4. Enter Contact ID: alice
 * 5. Click "Start Call" on either computer
 * 6. Accept the call on the other computer
 */

interface VideoCallInlineProps {
  userId: string;
  socketUrl: string;
  contactId: string;
  contactName: string;
  onCallEnd: () => void;
}

function VideoCallInline({ userId, socketUrl, contactId, contactName, onCallEnd }: VideoCallInlineProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<"idle" | "calling" | "incoming" | "active">("idle");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [incomingCallFrom, setIncomingCallFrom] = useState<string | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Connect to socket
  useEffect(() => {
    const newSocket = io(socketUrl, {
      auth: { token: userId }, // Using userId as token for testing
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    // Call events
    newSocket.on("call:initiated", (data: { callId: string }) => {
      console.log("Call initiated:", data.callId);
      setCallId(data.callId);
      setStatus("calling");
    });

    newSocket.on("call:incoming", (data: { callId: string; callerId: string }) => {
      console.log("Incoming call from:", data.callerId);
      setCallId(data.callId);
      setIncomingCallFrom(data.callerId);
      setStatus("incoming");
    });

    newSocket.on("call:accepted", (data: { callId: string }) => {
      console.log("Call accepted:", data.callId);
      setStatus("active");
    });

    newSocket.on("call:started", (data: { callId: string }) => {
      console.log("Call started:", data.callId);
      setStatus("active");
    });

    newSocket.on("call:rejected", () => {
      console.log("Call rejected");
      setStatus("idle");
      setCallId(null);
    });

    newSocket.on("call:ended", () => {
      console.log("Call ended");
      setStatus("idle");
      setCallId(null);
      onCallEnd();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [socketUrl, userId, onCallEnd]);

  // Get camera access
  useEffect(() => {
    // Check if mediaDevices is available (requires HTTPS or localhost)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const isSecure = window.location.protocol === 'https:' || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
      
      if (!isSecure) {
        setMediaError(
          "Camera access requires HTTPS. You're accessing via HTTP on a non-localhost address. " +
          "Options: 1) Use localhost on each computer, 2) Set up HTTPS, or 3) Use Chrome with flag: " +
          "chrome://flags/#unsafely-treat-insecure-origin-as-secure"
        );
      } else {
        setMediaError("Your browser doesn't support camera access.");
      }
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        setMediaError(null);
      })
      .catch(err => {
        console.error("Camera error:", err);
        setMediaError(`Camera access denied: ${err.message}`);
      });

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startCall = () => {
    if (socket && isConnected) {
      socket.emit("call:initiate", { recipientId: contactId });
    }
  };

  const acceptCall = () => {
    if (socket && callId) {
      socket.emit("call:accept", { callId });
      setStatus("active");
    }
  };

  const rejectCall = () => {
    if (socket && callId) {
      socket.emit("call:reject", { callId });
      setStatus("idle");
      setCallId(null);
      setIncomingCallFrom(null);
    }
  };

  const endCall = () => {
    if (socket && callId) {
      socket.emit("call:end", { callId });
    }
    localStream?.getTracks().forEach(track => track.stop());
    setStatus("idle");
    setCallId(null);
    onCallEnd();
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col">
      {/* Status Bar */}
      <div className="bg-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-white text-sm">
            {isConnected ? `Connected as ${userId}` : "Connecting..."}
          </span>
        </div>
        <span className="text-slate-400 text-sm">
          {status === "idle" && "Ready"}
          {status === "calling" && "Calling..."}
          {status === "incoming" && "Incoming call..."}
          {status === "active" && "In call"}
        </span>
      </div>

      {/* Media Error Banner */}
      {mediaError && (
        <div className="bg-amber-900/80 border-b border-amber-700 p-3">
          <p className="text-amber-200 text-sm text-center">{mediaError}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {status === "idle" && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
              <Video className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-white text-xl mb-2">Ready to Call</h2>
            <p className="text-slate-400 mb-6">Call {contactName}</p>
            <Button variant="primary" onClick={startCall} disabled={!isConnected}>
              Start Call
            </Button>
          </div>
        )}

        {status === "calling" && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-4xl">{contactName[0]}</span>
            </div>
            <h2 className="text-white text-xl mb-2">Calling {contactName}...</h2>
            <p className="text-slate-400 mb-6">Waiting for answer</p>
            <Button variant="destructive" onClick={endCall}>
              Cancel
            </Button>
          </div>
        )}

        {status === "incoming" && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-4xl">{incomingCallFrom?.[0] || "?"}</span>
            </div>
            <h2 className="text-white text-xl mb-2">Incoming Call</h2>
            <p className="text-slate-400 mb-6">From {incomingCallFrom}</p>
            <div className="flex gap-4 justify-center">
              <Button variant="destructive" onClick={rejectCall}>
                Decline
              </Button>
              <Button variant="primary" onClick={acceptCall}>
                Accept
              </Button>
            </div>
          </div>
        )}

        {status === "active" && (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-6xl">{contactName[0]}</span>
                </div>
                <h2 className="text-white text-2xl mb-2">Connected with {contactName}</h2>
                <p className="text-green-400">Call Active ✓</p>
                <p className="text-slate-400 text-sm mt-2">
                  (Full WebRTC video streaming requires TURN server for cross-network)
                </p>
              </div>
            </div>

            {/* Local Video Preview */}
            {localStream && (
              <div className="absolute top-20 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white/20">
                <video
                  autoPlay
                  muted
                  playsInline
                  ref={(video) => {
                    if (video && localStream) video.srcObject = localStream;
                  }}
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
                  You
                </div>
              </div>
            )}

            {/* End Call Button */}
            <div className="p-8 flex justify-center">
              <Button variant="destructive" size="lg" onClick={endCall}>
                End Call
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestCallPage() {
  const [serverIp, setServerIp] = useState("");
  const [userId, setUserId] = useState("");
  const [contactId, setContactId] = useState("");
  const [isInCall, setIsInCall] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-detect if on local network
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      setServerIp(hostname);
    }
  }, []);

  const copyUserId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socketUrl = serverIp 
    ? `http://${serverIp}:5000` 
    : "http://localhost:5000";

  if (isInCall && userId && contactId) {
    return (
      <VideoCallInline
        userId={userId}
        socketUrl={socketUrl}
        contactId={contactId}
        contactName={contactId}
        onCallEnd={() => setIsInCall(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Video Call Test</h1>
          <p className="text-slate-500">Test calls between two computers</p>
        </div>

        {/* HTTPS Warning */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-amber-900 mb-2">⚠️ Camera Requires Secure Context</h3>
            <p className="text-sm text-amber-800 mb-2">
              Camera access requires HTTPS or localhost. To test on another computer via HTTP:
            </p>
            <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
              <li>Open <code className="bg-amber-200 px-1 rounded">chrome://flags/#unsafely-treat-insecure-origin-as-secure</code></li>
              <li>Add your test URL: <code className="bg-amber-200 px-1 rounded">http://YOUR_SERVER_IP:3000</code></li>
              <li>Click &quot;Enable&quot; and restart Chrome</li>
            </ol>
          </CardContent>
        </Card>

        {/* Network Setup */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-900">Two-Computer Setup</h3>
            </div>
            <ol className="text-sm text-emerald-800 space-y-1 list-decimal list-inside">
              <li>On the <strong>server computer</strong>: Run <code className="bg-emerald-200 px-1 rounded">npm run dev</code> in Server folder</li>
              <li>Find server IP: <code className="bg-emerald-200 px-1 rounded">hostname -I</code> (e.g., 192.168.1.100)</li>
              <li>On <strong>both computers</strong>: Enter the server IP below</li>
              <li>Use different User IDs on each computer</li>
              <li>Enter the other computer's User ID as Contact ID</li>
            </ol>
          </CardContent>
        </Card>

        {/* Setup Form */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Server IP Address
              </label>
              <Input
                value={serverIp}
                onChange={(e) => setServerIp(e.target.value)}
                placeholder="e.g., 192.168.1.100 (leave empty for localhost)"
              />
              <p className="text-xs text-slate-500 mt-1">
                Current socket URL: <code className="bg-slate-100 px-1 rounded">{socketUrl}</code>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Your User ID
              </label>
              <div className="flex gap-2">
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g., alice"
                  className="flex-1"
                />
                {userId && (
                  <Button variant="outline" size="icon" onClick={copyUserId}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact's User ID
              </label>
              <Input
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                placeholder="e.g., bob"
              />
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                className="w-full"
                disabled={!userId || !contactId}
                onClick={() => setIsInCall(true)}
              >
                <Video className="w-4 h-4" />
                Start Call
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Setup */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-slate-900 mb-3">Quick Setup</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-md">
                <p className="text-sm font-medium text-slate-700">Computer 1</p>
                <p className="text-xs text-slate-500">User ID: <code className="bg-slate-200 px-1 rounded">alice</code></p>
                <p className="text-xs text-slate-500">Contact: <code className="bg-slate-200 px-1 rounded">bob</code></p>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <p className="text-sm font-medium text-slate-700">Computer 2</p>
                <p className="text-xs text-slate-500">User ID: <code className="bg-slate-200 px-1 rounded">bob</code></p>
                <p className="text-xs text-slate-500">Contact: <code className="bg-slate-200 px-1 rounded">alice</code></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
