"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { EmotionData } from "@/store/callStore";

interface EmotionOverlayProps {
  emotion: EmotionData | null;
  isVisible: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showDetails?: boolean;
}

const emotionColors: Record<string, string> = {
  happy: "bg-amber-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
  fearful: "bg-purple-500",
  surprised: "bg-yellow-500",
  disgusted: "bg-green-600",
  contempt: "bg-orange-600",
  neutral: "bg-slate-500",
  thoughtful: "bg-indigo-500",
  excited: "bg-pink-500",
  confused: "bg-violet-500",
  hopeful: "bg-teal-500",
  loving: "bg-rose-500",
  peaceful: "bg-cyan-500",
  anxious: "bg-amber-600",
  frustrated: "bg-red-600",
  curious: "bg-emerald-500",
  grateful: "bg-lime-500",
  concerned: "bg-orange-500",
};

const emotionEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  fearful: "😨",
  surprised: "😲",
  disgusted: "🤢",
  contempt: "😏",
  neutral: "😐",
  thoughtful: "🤔",
  excited: "🤩",
  confused: "😕",
  hopeful: "🌟",
  loving: "🥰",
  peaceful: "😌",
  anxious: "😰",
  frustrated: "😤",
  curious: "🧐",
  grateful: "🙏",
  concerned: "😟",
};

function getPositionClasses(position: EmotionOverlayProps["position"]) {
  switch (position) {
    case "top-left": return "top-4 left-4";
    case "top-right": return "top-4 right-4";
    case "bottom-left": return "bottom-4 left-4";
    case "bottom-right": return "bottom-4 right-4";
    default: return "top-4 left-4";
  }
}

function IntensityIndicator({ intensity }: { intensity: number }) {
  if (intensity > 0.7) return <TrendingUp className="w-3 h-3 text-emerald-400" />;
  if (intensity < 0.3) return <TrendingDown className="w-3 h-3 text-orange-400" />;
  return <Minus className="w-3 h-3 text-slate-400" />;
}

export function EmotionOverlay({
  emotion,
  isVisible,
  position = "top-left",
  showDetails = true,
}: EmotionOverlayProps) {
  const positionClasses = getPositionClasses(position);

  return (
    <AnimatePresence>
      {isVisible && emotion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute ${positionClasses} z-10`}
        >
          <div className="bg-black/80 backdrop-blur-sm rounded-md p-3 min-w-[160px] border border-white/10">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-white text-xs font-medium">Detected Emotion</span>
            </div>

            {/* Dominant Emotion */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{emotionEmojis[emotion.dominantEmotion] || "😶"}</span>
                <span className="text-white font-medium text-sm capitalize">{emotion.dominantEmotion}</span>
                <IntensityIndicator intensity={emotion.intensity} />
              </div>
              
              {/* Confidence Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${emotion.confidence * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${emotionColors[emotion.dominantEmotion] || "bg-slate-500"}`}
                  />
                </div>
                <span className="text-white/60 text-xs">{Math.round(emotion.confidence * 100)}%</span>
              </div>
            </div>

            {/* Secondary Emotions */}
            {emotion.emotions.length > 1 && (
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {emotion.emotions.slice(1, 3).map((em) => (
                    <span key={em} className="px-1.5 py-0.5 text-xs rounded bg-white/10 text-white/80 capitalize">
                      {emotionEmojis[em] || ""} {em}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nuances */}
            {showDetails && emotion.nuances && (
              <div className="pt-2 border-t border-white/10">
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                  {emotion.nuances.eyeContact && (
                    <div className="text-white/50">Eyes: <span className="text-white/80">{emotion.nuances.eyeContact}</span></div>
                  )}
                  {emotion.nuances.overallTension && (
                    <div className="text-white/50">Tension: <span className="text-white/80">{emotion.nuances.overallTension}</span></div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface EmotionTranslationProps {
  text: string;
  isVisible: boolean;
}

export function EmotionTranslation({ text, isVisible }: EmotionTranslationProps) {
  return (
    <AnimatePresence>
      {isVisible && text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-24 left-4 right-4 z-10"
        >
          <div className="bg-black/80 backdrop-blur-sm rounded-md p-3 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">AI Translation</p>
                <p className="text-white text-sm">{text}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EmotionOverlay;
