"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, User, Video } from "lucide-react";

interface IncomingCallModalProps {
  isOpen: boolean;
  callerName?: string;
  callerAvatar?: string;
  onAccept: () => void;
  onReject: () => void;
}

export function IncomingCallModal({
  isOpen,
  callerName = "Unknown Caller",
  callerAvatar,
  onAccept,
  onReject,
}: IncomingCallModalProps) {
  // Play ringtone sound effect (optional - using Web Audio API)
  useEffect(() => {
    if (!isOpen) return;
    
    // Could add ringtone audio here
    // const audio = new Audio('/ringtone.mp3');
    // audio.loop = true;
    // audio.play();
    // return () => { audio.pause(); audio.currentTime = 0; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onReject}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl border border-white/10 max-w-sm w-full mx-4"
          >
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-40 h-40 rounded-full bg-coral/20"
              />
            </div>

            {/* Content */}
            <div className="relative flex flex-col items-center text-center">
              {/* Caller Avatar */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative mb-6"
              >
                {callerAvatar ? (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-coral to-peach flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {callerAvatar}
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center shadow-lg">
                    <User className="w-12 h-12 text-white/70" />
                  </div>
                )}
                
                {/* Video call indicator */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-teal flex items-center justify-center shadow-lg">
                  <Video className="w-4 h-4 text-white" />
                </div>
              </motion.div>

              {/* Caller Info */}
              <h2 className="text-white text-xl font-semibold mb-1">
                {callerName}
              </h2>
              <p className="text-white/60 text-sm mb-8">
                Incoming video call...
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-6">
                {/* Reject */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="w-16 h-16 rounded-full shadow-lg"
                    onClick={onReject}
                  >
                    <PhoneOff className="w-7 h-7" />
                  </Button>
                  <p className="text-white/60 text-xs mt-2">Decline</p>
                </motion.div>

                {/* Accept */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
                    onClick={onAccept}
                  >
                    <Phone className="w-7 h-7 text-white" />
                  </Button>
                  <p className="text-white/60 text-xs mt-2">Accept</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IncomingCallModal;

