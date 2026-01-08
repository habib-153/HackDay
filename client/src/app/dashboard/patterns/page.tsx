"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Palette,
  Plus,
  Search,
  Grid3X3,
  List,
  Heart,
  Trash2,
  X,
  Pencil,
  Eraser,
  Sparkles,
  Send,
  Eye,
} from "lucide-react";

const DEMO_PATTERNS = [
  {
    id: "1",
    name: "Morning Joy",
    emotion: "Happy",
    intensity: 0.85,
    colors: ["#22C55E", "#10B981", "#34D399"],
    tags: ["bright", "energetic", "warm"],
    usedCount: 12,
    imageUrl: null,
  },
  {
    id: "2",
    name: "Peaceful Waves",
    emotion: "Calm",
    intensity: 0.7,
    colors: ["#06B6D4", "#0EA5E9", "#38BDF8"],
    tags: ["flowing", "serene", "gentle"],
    usedCount: 8,
  },
  {
    id: "3",
    name: "Warm Gratitude",
    emotion: "Grateful",
    intensity: 0.9,
    colors: ["#F59E0B", "#FBBF24", "#FCD34D"],
    tags: ["warm", "soft", "heartfelt"],
    usedCount: 15,
  },
  {
    id: "4",
    name: "Gentle Love",
    emotion: "Love",
    intensity: 0.95,
    colors: ["#EC4899", "#F472B6", "#F9A8D4"],
    tags: ["tender", "intimate", "soft"],
    usedCount: 20,
  },
];

const EMOTIONS = ["Happy", "Calm", "Love", "Sad", "Anxious", "Excited", "Grateful", "Hopeful"];

const COLORS = [
  "#0D9488", "#F59E0B", "#EF4444", "#8B5CF6", "#22C55E", "#3B82F6",
  "#EC4899", "#F97316", "#06B6D4", "#84CC16", "#6366F1", "#14B8A6",
];

export default function PatternsPage() {
  const [patterns, setPatterns] = useState(DEMO_PATTERNS);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  
  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#0D9488");
  const [brushSize, setBrushSize] = useState(5);
  const [usedColors, setUsedColors] = useState<string[]>([]);
  
  // New pattern state
  const [patternName, setPatternName] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [intensity, setIntensity] = useState(70);
  const [tags, setTags] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<{
    suggestedEmotion: string;
    suggestedIntensity: number;
    interpretation: string;
    shapeType: string;
    colorMood: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Interpretation modal
  const [showInterpret, setShowInterpret] = useState(false);
  const [interpretingPattern, setInterpretingPattern] = useState<typeof DEMO_PATTERNS[0] | null>(null);
  const [interpretation, setInterpretation] = useState("");

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && isCreating) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [isCreating]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (brushColor !== "#FFFFFF" && !usedColors.includes(brushColor)) {
      setUsedColors([...usedColors, brushColor]);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setUsedColors([]);
  };

  const analyzePattern = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const emotions = ["Happy", "Calm", "Excited", "Peaceful", "Hopeful"];
      const shapes = ["flowing", "angular", "spiral", "organic", "geometric"];
      const moods = ["warm", "cool", "vibrant", "muted", "energetic"];
      
      setAiAnalysis({
        suggestedEmotion: emotions[Math.floor(Math.random() * emotions.length)],
        suggestedIntensity: Math.floor(Math.random() * 40) + 60,
        interpretation: "This pattern expresses a sense of openness and emotional warmth. The flowing lines suggest a peaceful state of mind, while the color choices indicate positive energy.",
        shapeType: shapes[Math.floor(Math.random() * shapes.length)],
        colorMood: moods[Math.floor(Math.random() * moods.length)],
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const savePattern = () => {
    if (!patternName || !selectedEmotion) return;

    const newPattern = {
      id: Date.now().toString(),
      name: patternName,
      emotion: selectedEmotion,
      intensity: intensity / 100,
      colors: usedColors.length > 0 ? usedColors : [brushColor],
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      usedCount: 0,
    };

    setPatterns([newPattern, ...patterns]);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setPatternName("");
    setSelectedEmotion("");
    setIntensity(70);
    setTags("");
    setAiAnalysis(null);
    setUsedColors([]);
  };

  const interpretPattern = (pattern: typeof DEMO_PATTERNS[0]) => {
    setInterpretingPattern(pattern);
    setShowInterpret(true);
    
    // Simulate AI interpretation
    setTimeout(() => {
      const interpretations = [
        `This "${pattern.name}" pattern beautifully captures the essence of ${pattern.emotion.toLowerCase()}. The ${pattern.colors.length > 1 ? 'blend of colors' : 'color choice'} suggests a deeply felt emotion that the sender wants to share with you.`,
        `Through this visual expression, they're conveying ${pattern.emotion.toLowerCase()} with ${Math.round(pattern.intensity * 100)}% intensity. The pattern's characteristics indicate a genuine and heartfelt message.`,
        `"${pattern.name}" represents their unique way of expressing ${pattern.emotion.toLowerCase()}. The visual elements they chose reflect their personal emotional vocabulary.`,
      ];
      setInterpretation(interpretations[Math.floor(Math.random() * interpretations.length)]);
    }, 800);
  };

  const filteredPatterns = patterns.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.emotion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "All" || p.emotion === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patterns</h1>
          <p className="text-sm text-slate-500">Your visual emotion vocabulary</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4" />
          Create Pattern
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Patterns", value: patterns.length.toString() },
          { label: "Times Used", value: patterns.reduce((a, p) => a + p.usedCount, 0).toString() },
          { label: "Emotions", value: new Set(patterns.map(p => p.emotion)).size.toString() },
          { label: "AI Accuracy", value: "94%" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
          {["All", ...EMOTIONS].map((emotion) => (
            <button
              key={emotion}
              onClick={() => setSelectedFilter(emotion)}
              className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${
                selectedFilter === emotion
                  ? "bg-primary text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-primary"
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex bg-white rounded-md border border-slate-200 p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-primary text-white" : "text-slate-400"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-primary text-white" : "text-slate-400"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Patterns Grid */}
      <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
        {filteredPatterns.map((pattern) => (
          <Card key={pattern.id} className="group overflow-hidden hover:border-primary/50 transition-colors">
            <div
              className="aspect-square flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${pattern.colors[0]}, ${pattern.colors[1] || pattern.colors[0]})`,
              }}
            >
              <Palette className="w-16 h-16 text-white/40" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-10 h-10"
                  onClick={() => interpretPattern(pattern)}
                >
                  <Eye className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="icon" className="w-10 h-10">
                  <Send className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-10 h-10"
                  onClick={() => setPatterns(patterns.filter(p => p.id !== pattern.id))}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-slate-900">{pattern.name}</h3>
                  <p className="text-sm text-slate-500">{pattern.emotion}</p>
                </div>
                <span className="text-xs text-slate-400">Used {pattern.usedCount}x</span>
              </div>
              <div className="flex gap-1 mb-3">
                {pattern.colors.map((color, i) => (
                  <div key={i} className="w-5 h-5 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {pattern.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${pattern.intensity * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{Math.round(pattern.intensity * 100)}% intensity</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Pattern Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Create Pattern</h2>
                <p className="text-sm text-slate-500">Draw your emotional expression</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setIsCreating(false); resetForm(); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 grid lg:grid-cols-2 gap-6 p-6 overflow-y-auto">
              {/* Drawing Area */}
              <div>
                <div className="bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full cursor-crosshair"
                  />
                </div>
                <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                  <Button
                    variant={brushColor !== "#FFFFFF" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setBrushColor("#0D9488")}
                  >
                    <Pencil className="w-4 h-4" /> Pen
                  </Button>
                  <Button
                    variant={brushColor === "#FFFFFF" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setBrushColor("#FFFFFF")}
                  >
                    <Eraser className="w-4 h-4" /> Eraser
                  </Button>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-20 accent-primary"
                  />
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    Clear
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-7 h-7 rounded-full border-2 ${brushColor === color ? 'border-slate-900' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setBrushColor(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Pattern Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pattern Name</label>
                  <Input
                    value={patternName}
                    onChange={(e) => setPatternName(e.target.value)}
                    placeholder="e.g., Morning Joy"
                  />
                </div>

                <Button
                  variant="secondary"
                  onClick={analyzePattern}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "AI Analyze Pattern"}
                </Button>

                {aiAnalysis && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 text-sm space-y-2">
                      <p className="font-medium text-primary flex items-center gap-1">
                        <Sparkles className="w-4 h-4" /> AI Analysis
                      </p>
                      <p><strong>Suggested Emotion:</strong> {aiAnalysis.suggestedEmotion}</p>
                      <p><strong>Intensity:</strong> {aiAnalysis.suggestedIntensity}%</p>
                      <p><strong>Shape Type:</strong> {aiAnalysis.shapeType}</p>
                      <p><strong>Color Mood:</strong> {aiAnalysis.colorMood}</p>
                      <p className="text-slate-600 italic">&quot;{aiAnalysis.interpretation}&quot;</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEmotion(aiAnalysis.suggestedEmotion);
                          setIntensity(aiAnalysis.suggestedIntensity);
                        }}
                      >
                        Apply Suggestions
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emotion</label>
                  <select
                    value={selectedEmotion}
                    onChange={(e) => setSelectedEmotion(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="">Select emotion</option>
                    {EMOTIONS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Intensity: {intensity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="peaceful, warm, gentle"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => { setIsCreating(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={savePattern} disabled={!patternName || !selectedEmotion}>
                    Save Pattern
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interpretation Modal */}
      {showInterpret && interpretingPattern && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Pattern Interpretation</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowInterpret(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6">
              <div
                className="w-full h-40 rounded-lg mb-4 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${interpretingPattern.colors[0]}, ${interpretingPattern.colors[1] || interpretingPattern.colors[0]})`,
                }}
              >
                <Palette className="w-12 h-12 text-white/40" />
              </div>
              <h4 className="font-medium text-slate-900 mb-1">{interpretingPattern.name}</h4>
              <p className="text-sm text-primary mb-3">{interpretingPattern.emotion} • {Math.round(interpretingPattern.intensity * 100)}%</p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 flex items-start gap-2">
                  <Heart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {interpretation || "Analyzing pattern..."}
                </p>
              </div>
              <Button variant="primary" className="w-full mt-4" onClick={() => setShowInterpret(false)}>
                <Send className="w-4 h-4 mr-2" />
                Send in Chat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
