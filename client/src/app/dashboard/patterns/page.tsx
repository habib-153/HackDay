"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Palette,
  Plus,
  Search,
  Grid3X3,
  List,
  Sparkles,
  Heart,
  Edit3,
  Trash2,
  Eye,
  Download,
  Filter,
  X,
  Pencil,
} from "lucide-react";

// Emotion categories
const emotionCategories = [
  { name: "All", count: 48, active: true },
  { name: "Joy", count: 12, color: "bg-amber" },
  { name: "Calm", count: 8, color: "bg-teal" },
  { name: "Love", count: 10, color: "bg-coral" },
  { name: "Sad", count: 6, color: "bg-lavender" },
  { name: "Anxious", count: 5, color: "bg-rose" },
  { name: "Excited", count: 7, color: "bg-peach" },
];

// Mock patterns
const patterns = [
  {
    id: 1,
    name: "Peaceful Waves",
    emotion: "Calm",
    intensity: 65,
    colors: ["#0D9488", "#5EEAD4", "#CCFBF1"],
    tags: ["relaxed", "peaceful", "meditation"],
    usedCount: 24,
    gradient: "from-teal to-teal-light",
  },
  {
    id: 2,
    name: "Joyful Spirals",
    emotion: "Joy",
    intensity: 85,
    colors: ["#F59E0B", "#FCD34D", "#FEF3C7"],
    tags: ["happy", "excited", "celebratory"],
    usedCount: 18,
    gradient: "from-amber to-amber-soft",
  },
  {
    id: 3,
    name: "Warm Heart",
    emotion: "Love",
    intensity: 90,
    colors: ["#F87171", "#FECACA", "#FEE2E2"],
    tags: ["affection", "caring", "grateful"],
    usedCount: 32,
    gradient: "from-coral to-peach",
  },
  {
    id: 4,
    name: "Gentle Rain",
    emotion: "Sad",
    intensity: 40,
    colors: ["#A78BFA", "#C4B5FD", "#EDE9FE"],
    tags: ["melancholy", "reflective", "nostalgic"],
    usedCount: 8,
    gradient: "from-lavender to-lavender-soft",
  },
  {
    id: 5,
    name: "Sunrise Energy",
    emotion: "Excited",
    intensity: 95,
    colors: ["#FB923C", "#FED7AA", "#FFEDD5"],
    tags: ["energetic", "motivated", "eager"],
    usedCount: 15,
    gradient: "from-peach to-amber-soft",
  },
  {
    id: 6,
    name: "Deep Breath",
    emotion: "Calm",
    intensity: 50,
    colors: ["#14B8A6", "#99F6E4", "#F0FDFA"],
    tags: ["breathing", "centered", "grounded"],
    usedCount: 21,
    gradient: "from-teal-dark to-teal",
  },
];

// Drawing tools
const drawingTools = [
  { icon: Pencil, name: "Pen", active: true },
  { icon: Edit3, name: "Brush", active: false },
];

export default function PatternsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState("All");
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);

  const filteredPatterns =
    selectedEmotion === "All"
      ? patterns
      : patterns.filter((p) => p.emotion === selectedEmotion);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pattern Language</h1>
          <p className="text-slate-500">
            Create visual patterns that express your emotions
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setIsCreating(true)}>
          <Plus className="w-5 h-5" />
          Create Pattern
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Patterns", value: "48", icon: Palette, color: "coral" },
          { label: "Times Used", value: "156", icon: Sparkles, color: "teal" },
          { label: "Emotions Covered", value: "12", icon: Heart, color: "lavender" },
          { label: "AI Accuracy", value: "94%", icon: Eye, color: "amber" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Emotion Categories */}
        <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
          {emotionCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedEmotion(category.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedEmotion === category.name
                  ? "bg-coral text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-coral hover:text-coral"
              }`}
            >
              {category.color && (
                <span className={`w-2 h-2 rounded-full ${category.color}`} />
              )}
              <span className="text-sm font-medium">{category.name}</span>
              <span
                className={`text-xs ${
                  selectedEmotion === category.name
                    ? "text-white/80"
                    : "text-slate-400"
                }`}
              >
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and View Toggle */}
        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search patterns..." className="pl-10" />
          </div>
          <div className="flex bg-white rounded-xl border border-slate-200 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-coral text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-coral text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Patterns Grid */}
      <motion.div
        layout
        className={
          viewMode === "grid"
            ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        <AnimatePresence mode="popLayout">
          {filteredPatterns.map((pattern, index) => (
            <motion.div
              key={pattern.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              {viewMode === "grid" ? (
                <Card
                  hover
                  className="group cursor-pointer overflow-hidden"
                  onClick={() => setSelectedPattern(pattern.id)}
                >
                  {/* Pattern Preview */}
                  <div
                    className={`aspect-square bg-gradient-to-br ${pattern.gradient} p-6 relative`}
                  >
                    {/* Abstract Pattern Visualization */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 10 + i * 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="absolute inset-0 rounded-full border-2 border-white/30"
                            style={{
                              transform: `scale(${0.6 + i * 0.2})`,
                            }}
                          />
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Palette className="w-12 h-12 text-white/80" />
                        </div>
                      </div>
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button variant="secondary" size="icon" className="w-10 h-10">
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button variant="secondary" size="icon" className="w-10 h-10">
                        <Edit3 className="w-5 h-5" />
                      </Button>
                      <Button variant="secondary" size="icon" className="w-10 h-10">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {pattern.name}
                        </h3>
                        <p className="text-sm text-slate-500">{pattern.emotion}</p>
                      </div>
                      <span className="text-xs text-slate-400">
                        Used {pattern.usedCount}x
                      </span>
                    </div>

                    {/* Color Palette */}
                    <div className="flex gap-1 mb-3">
                      {pattern.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {pattern.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Intensity Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">Intensity</span>
                        <span className="font-medium text-foreground">
                          {pattern.intensity}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${pattern.gradient} rounded-full`}
                          style={{ width: `${pattern.intensity}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* List View */
                <Card hover className="cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pattern.gradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <Palette className="w-8 h-8 text-white/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {pattern.name}
                      </h3>
                      <p className="text-sm text-slate-500">{pattern.emotion}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {pattern.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pattern.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {pattern.intensity}%
                      </p>
                      <p className="text-xs text-slate-500">
                        Used {pattern.usedCount}x
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Create Pattern Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsCreating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Create New Pattern
                  </h2>
                  <p className="text-sm text-slate-500">
                    Draw and associate with an emotion
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCreating(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="grid lg:grid-cols-2 gap-6 p-6">
                {/* Canvas Area */}
                <div>
                  <div className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-4">
                        <Pencil className="w-8 h-8 text-coral" />
                      </div>
                      <p className="text-slate-600 font-medium">
                        Draw your pattern here
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        Express your emotion through colors and shapes
                      </p>
                    </div>
                  </div>

                  {/* Drawing Tools */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {drawingTools.map((tool) => (
                      <Button
                        key={tool.name}
                        variant={tool.active ? "primary" : "outline"}
                        size="sm"
                      >
                        <tool.icon className="w-4 h-4" />
                        {tool.name}
                      </Button>
                    ))}
                    <div className="flex gap-2 ml-4">
                      {["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA"].map(
                        (color) => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded-full shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pattern Name
                    </label>
                    <Input placeholder="e.g., Morning Calm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Associated Emotion
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Joy", "Calm", "Love", "Sad", "Anxious", "Excited"].map(
                        (emotion) => (
                          <button
                            key={emotion}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-coral hover:text-coral transition-colors"
                          >
                            {emotion}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Intensity
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-full accent-coral"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>Subtle</span>
                      <span>Overwhelming</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tags
                    </label>
                    <Input placeholder="peaceful, relaxed, meditation" />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" className="flex-1">
                      <Sparkles className="w-5 h-5" />
                      Save Pattern
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
