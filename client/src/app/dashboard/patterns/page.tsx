"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Edit3,
  Trash2,
  Eye,
  X,
  Pencil,
  Activity,
  Eraser,
  RotateCcw,
  Sparkles,
  Send,
  MessageSquare,
  Wand2,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api, Pattern, PatternAnalysisResult, PatternInterpretResult } from "@/lib/api";

// Emotion definitions with colors and emojis
const emotionOptions = [
  { name: "Joy", emoji: "😊", color: "#F59E0B" },
  { name: "Calm", emoji: "😌", color: "#0D9488" },
  { name: "Love", emoji: "❤️", color: "#EC4899" },
  { name: "Sad", emoji: "😢", color: "#6366F1" },
  { name: "Anxious", emoji: "😰", color: "#8B5CF6" },
  { name: "Excited", emoji: "🎉", color: "#F97316" },
  { name: "Confused", emoji: "😕", color: "#64748B" },
  { name: "Grateful", emoji: "🙏", color: "#10B981" },
  { name: "Hopeful", emoji: "🌟", color: "#0EA5E9" },
  { name: "Lonely", emoji: "😔", color: "#475569" },
  { name: "Frustrated", emoji: "😤", color: "#EF4444" },
  { name: "Peaceful", emoji: "🕊️", color: "#14B8A6" },
];

const emotionCategories = [
  { name: "All", count: 0 },
  { name: "Joy", count: 0 },
  { name: "Calm", count: 0 },
  { name: "Love", count: 0 },
  { name: "Sad", count: 0 },
  { name: "Anxious", count: 0 },
  { name: "Excited", count: 0 },
];

// Drawing color palette
const colorPalette = [
  "#EF4444", "#F97316", "#F59E0B", "#EAB308", "#84CC16",
  "#22C55E", "#10B981", "#14B8A6", "#06B6D4", "#0EA5E9",
  "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF",
  "#EC4899", "#F43F5E", "#64748B", "#1E293B", "#FFFFFF",
];

interface LocalPattern extends Pattern {
  localImageData?: string; // For newly created patterns before saved to server
}

export default function PatternsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState("All");
  const [patterns, setPatterns] = useState<LocalPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pattern creation state
  const [patternName, setPatternName] = useState("");
  const [patternEmotion, setPatternEmotion] = useState("");
  const [patternIntensity, setPatternIntensity] = useState(50);
  const [patternTags, setPatternTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#3B82F6");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"pen" | "brush" | "eraser">("pen");
  const [usedColors, setUsedColors] = useState<string[]>([]);
  
  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<PatternAnalysisResult | null>(null);
  
  // Pattern interpretation demo state
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [selectedPatternForChat, setSelectedPatternForChat] = useState<LocalPattern | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState<PatternInterpretResult | null>(null);

  // Calculate emotion counts
  const emotionCounts = emotionCategories.map(cat => ({
    ...cat,
    count: cat.name === "All" ? patterns.length : patterns.filter(p => p.emotion === cat.name).length
  }));

  const filteredPatterns = selectedEmotion === "All" 
    ? patterns 
    : patterns.filter((p) => p.emotion === selectedEmotion);

  // Fetch patterns on mount
  useEffect(() => {
    fetchPatterns();
  }, []);

  const fetchPatterns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getPatterns();
      if (response.success) {
        setPatterns(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load patterns");
      console.error("Failed to fetch patterns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize canvas
  useEffect(() => {
    if (isCreating && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isCreating]);

  // Drawing functions
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.lineWidth = tool === "brush" ? brushSize * 2 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    if (tool === "eraser") {
      ctx.strokeStyle = "#FFFFFF";
    } else {
      ctx.strokeStyle = currentColor;
      if (!usedColors.includes(currentColor)) {
        setUsedColors(prev => [...prev.slice(-2), currentColor]);
      }
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [isDrawing, brushSize, currentColor, tool, usedColors]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setUsedColors([]);
    setAiAnalysis(null);
  }, []);

  // AI Analysis - Real API call
  const analyzePattern = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsAnalyzing(true);
    setAiAnalysis(null);
    
    try {
      const imageData = canvas.toDataURL("image/png");
      const response = await api.analyzePattern(imageData);
      
      if (response.success && response.data) {
        setAiAnalysis(response.data);
        
        // Auto-fill suggested values if not already set
        if (!patternEmotion && response.data.suggestedEmotion) {
          setPatternEmotion(response.data.suggestedEmotion);
        }
        if (response.data.suggestedIntensity) {
          setPatternIntensity(Math.round(response.data.suggestedIntensity * 100));
        }
        if (response.data.suggestedTags?.length > 0 && !patternTags) {
          setPatternTags(response.data.suggestedTags.join(", "));
        }
      }
    } catch (err) {
      console.error("AI analysis failed:", err);
      // Fallback to mock analysis if API fails
      setAiAnalysis({
        success: false,
        features: {
          shapeType: "organic",
          colorMood: usedColors.some(c => ["#EF4444", "#F97316", "#F59E0B"].includes(c)) ? "warm" : "cool",
          lineQuality: "smooth",
          density: 0.5,
          symmetry: 0.4,
        },
        suggestedEmotion: "calm",
        suggestedIntensity: 0.5,
        interpretation: "Unable to analyze pattern with AI. This is a fallback analysis.",
        suggestedTags: ["expressive"],
        error: err instanceof Error ? err.message : "Analysis failed"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [usedColors, patternEmotion, patternTags]);

  // Save pattern - Real API call
  const savePattern = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !patternEmotion) return;
    
    setIsSaving(true);
    
    try {
      const imageData = canvas.toDataURL("image/png");
      
      const response = await api.createPattern({
        imageData,
        emotion: patternEmotion,
        intensity: patternIntensity / 100,
        tags: patternTags.split(",").map(t => t.trim()).filter(Boolean),
        colorPalette: usedColors.length > 0 ? usedColors : [currentColor],
      });
      
      if (response.success && response.data.pattern) {
        // Add to local state with image data for immediate display
        setPatterns(prev => [{
          ...response.data.pattern,
          localImageData: imageData,
        }, ...prev]);
        
        resetCreator();
        setIsCreating(false);
      }
    } catch (err) {
      console.error("Failed to save pattern:", err);
      setError(err instanceof Error ? err.message : "Failed to save pattern");
    } finally {
      setIsSaving(false);
    }
  }, [patternEmotion, patternIntensity, patternTags, usedColors, currentColor]);

  const resetCreator = useCallback(() => {
    setPatternName("");
    setPatternEmotion("");
    setPatternIntensity(50);
    setPatternTags("");
    setUsedColors([]);
    setAiAnalysis(null);
    clearCanvas();
  }, [clearCanvas]);

  // Delete pattern - Real API call
  const handleDeletePattern = useCallback(async (patternId: string) => {
    try {
      await api.deletePattern(patternId);
      setPatterns(prev => prev.filter(p => p._id !== patternId));
    } catch (err) {
      console.error("Failed to delete pattern:", err);
      setError(err instanceof Error ? err.message : "Failed to delete pattern");
    }
  }, []);

  // Pattern interpretation - Real API call
  const interpretPattern = useCallback(async (pattern: LocalPattern) => {
    setSelectedPatternForChat(pattern);
    setShowInterpretation(true);
    setIsInterpreting(true);
    setInterpretation(null);
    
    try {
      const response = await api.interpretPattern(
        pattern._id,
        "You", // In real app, use sender's name
        pattern.localImageData,
      );
      
      if (response.success && response.data) {
        setInterpretation(response.data);
      }
    } catch (err) {
      console.error("Pattern interpretation failed:", err);
      // Fallback interpretation
      setInterpretation({
        success: false,
        interpretation: `This pattern expresses ${pattern.emotion} with ${Math.round(pattern.intensity * 100)}% intensity. The visual elements create a ${pattern.tags?.join(" and ") || "unique"} emotional signature.`,
        emotionalContext: `Expressing ${pattern.emotion}`,
        suggestedResponses: [
          `I understand you're feeling ${pattern.emotion}`,
          "Thank you for sharing this with me"
        ],
        error: err instanceof Error ? err.message : "Interpretation failed"
      });
    } finally {
      setIsInterpreting(false);
    }
  }, []);

  // Send pattern to chat (demo)
  const handleSendToChat = useCallback(async (recipientId: string) => {
    if (!selectedPatternForChat) return;
    
    try {
      // In a real implementation, this would:
      // 1. Get or create conversation with recipient
      // 2. Send pattern message
      // 3. The recipient would see the pattern with AI interpretation
      
      await api.usePattern(selectedPatternForChat._id);
      
      // Update local usage count
      setPatterns(prev => prev.map(p => 
        p._id === selectedPatternForChat._id 
          ? { ...p, usedCount: (p.usedCount || 0) + 1 }
          : p
      ));
      
      setShowInterpretation(false);
      alert("Pattern sent! (Demo - actual chat integration coming)");
    } catch (err) {
      console.error("Failed to send pattern:", err);
    }
  }, [selectedPatternForChat]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patterns</h1>
          <p className="text-sm text-slate-500">Visual patterns for your emotions</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4" />
          Create Pattern
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Patterns", value: patterns.length.toString(), icon: Palette },
          { label: "Times Used", value: patterns.reduce((acc, p) => acc + (p.usedCount || 0), 0).toString(), icon: Activity },
          { label: "Emotions", value: new Set(patterns.map(p => p.emotion)).size.toString(), icon: Heart },
          { label: "AI Powered", value: "✓", icon: Sparkles },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
          {emotionCounts.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedEmotion(category.name)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors text-sm ${selectedEmotion === category.name ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-primary"}`}
            >
              <span>{category.name}</span>
              <span className={`text-xs ${selectedEmotion === category.name ? "text-white/80" : "text-slate-400"}`}>{category.count}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 lg:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search..." className="pl-9 h-9" />
          </div>
          <div className="flex bg-white rounded-md border border-slate-200 p-0.5">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-slate-400"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-slate-400"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {patterns.length === 0 && !isLoading && (
        <Card className="p-12 text-center">
          <Palette className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No patterns yet</h3>
          <p className="text-sm text-slate-500 mb-4">Create your first visual pattern to express your emotions</p>
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4" />
            Create Your First Pattern
          </Button>
        </Card>
      )}

      {/* Patterns Grid */}
      <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
        {filteredPatterns.map((pattern) => (
          viewMode === "grid" ? (
            <Card key={pattern._id} hover className="group cursor-pointer overflow-hidden">
              <div 
                className="aspect-square flex items-center justify-center relative"
                style={{ 
                  background: pattern.localImageData 
                    ? `url(${pattern.localImageData}) center/cover` 
                    : pattern.imageUrl
                      ? `url(${pattern.imageUrl}) center/cover`
                      : `linear-gradient(135deg, ${pattern.colorPalette?.[0] || '#6B7280'}, ${pattern.colorPalette?.[1] || pattern.colorPalette?.[0] || '#6B7280'})` 
                }}
              >
                {!pattern.localImageData && !pattern.imageUrl && <Palette className="w-12 h-12 text-white/60" />}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="icon" className="w-8 h-8" onClick={() => interpretPattern(pattern)}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="w-8 h-8">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="w-8 h-8"
                    onClick={() => handleDeletePattern(pattern._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-slate-900 flex items-center gap-1">
                      <span>{emotionOptions.find(e => e.name === pattern.emotion)?.emoji}</span>
                      {pattern.emotion}
                    </h3>
                    <p className="text-sm text-slate-500">{Math.round(pattern.intensity * 100)}% intensity</p>
                  </div>
                  <span className="text-xs text-slate-400">Used {pattern.usedCount || 0}x</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {pattern.colorPalette?.map((color, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-slate-200" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {pattern.tags?.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-600">#{tag}</span>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Intensity</span>
                    <span className="font-medium text-slate-900">{Math.round(pattern.intensity * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pattern.intensity * 100}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card key={pattern._id} hover className="cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: pattern.localImageData 
                      ? `url(${pattern.localImageData}) center/cover` 
                      : pattern.imageUrl
                        ? `url(${pattern.imageUrl}) center/cover`
                        : `linear-gradient(135deg, ${pattern.colorPalette?.[0] || '#6B7280'}, ${pattern.colorPalette?.[1] || '#6B7280'})` 
                  }}
                >
                  {!pattern.localImageData && !pattern.imageUrl && <Palette className="w-6 h-6 text-white/60" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900">{emotionOptions.find(e => e.name === pattern.emotion)?.emoji} {pattern.emotion}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pattern.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-600">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pattern.colorPalette?.slice(0, 3).map((color, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{Math.round(pattern.intensity * 100)}%</p>
                  <p className="text-xs text-slate-500">Used {pattern.usedCount || 0}x</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => interpretPattern(pattern)}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleDeletePattern(pattern._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>

      {/* Create Pattern Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setIsCreating(false); resetCreator(); }}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-medium text-slate-900">Create Pattern</h2>
                <p className="text-sm text-slate-500">Draw and associate with an emotion</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setIsCreating(false); resetCreator(); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 p-6">
              {/* Canvas Section */}
              <div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="w-full aspect-square rounded-md bg-white cursor-crosshair border border-slate-200"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                
                {/* Drawing Tools */}
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={tool === "pen" ? "primary" : "outline"} 
                      size="sm"
                      onClick={() => setTool("pen")}
                    >
                      <Pencil className="w-4 h-4" />
                      Pen
                    </Button>
                    <Button 
                      variant={tool === "brush" ? "primary" : "outline"} 
                      size="sm"
                      onClick={() => setTool("brush")}
                    >
                      <Edit3 className="w-4 h-4" />
                      Brush
                    </Button>
                    <Button 
                      variant={tool === "eraser" ? "primary" : "outline"} 
                      size="sm"
                      onClick={() => setTool("eraser")}
                    >
                      <Eraser className="w-4 h-4" />
                      Eraser
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearCanvas}>
                      <RotateCcw className="w-4 h-4" />
                      Clear
                    </Button>
                  </div>

                  {/* Brush Size */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Brush Size: {brushSize}px</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      value={brushSize} 
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Color Palette */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Colors</label>
                    <div className="flex flex-wrap gap-1">
                      {colorPalette.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCurrentColor(color)}
                          className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${currentColor === color ? "ring-2 ring-primary ring-offset-2" : ""}`}
                          style={{ backgroundColor: color, border: color === "#FFFFFF" ? "1px solid #e2e8f0" : "none" }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Used Colors */}
                  {usedColors.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Used Colors</label>
                      <div className="flex gap-1">
                        {usedColors.map((color, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-6 rounded-full border border-slate-200" 
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-4">
                {/* AI Analysis Button */}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={analyzePattern}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      AI Analyze Pattern
                    </>
                  )}
                </Button>

                {/* AI Analysis Results */}
                {aiAnalysis && (
                  <Card className={aiAnalysis.success ? "bg-primary/5 border-primary/20" : "bg-yellow-50 border-yellow-200"}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-slate-900">
                          AI Analysis {!aiAnalysis.success && "(Fallback)"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="p-2 bg-white rounded-md">
                          <span className="text-slate-500">Shape:</span>
                          <span className="ml-1 font-medium capitalize">{aiAnalysis.features.shapeType}</span>
                        </div>
                        <div className="p-2 bg-white rounded-md">
                          <span className="text-slate-500">Mood:</span>
                          <span className="ml-1 font-medium capitalize">{aiAnalysis.features.colorMood}</span>
                        </div>
                        <div className="p-2 bg-white rounded-md">
                          <span className="text-slate-500">Lines:</span>
                          <span className="ml-1 font-medium capitalize">{aiAnalysis.features.lineQuality}</span>
                        </div>
                        <div className="p-2 bg-white rounded-md">
                          <span className="text-slate-500">Density:</span>
                          <span className="ml-1 font-medium">{Math.round(aiAnalysis.features.density * 100)}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600">{aiAnalysis.interpretation}</p>
                      <div className="mt-3 p-2 bg-white rounded-md flex items-center gap-2">
                        <span className="text-xs text-slate-500">Suggested Emotion:</span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs font-medium">
                          {emotionOptions.find(e => e.name === aiAnalysis.suggestedEmotion)?.emoji} {aiAnalysis.suggestedEmotion}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Emotion *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {emotionOptions.slice(0, 9).map((emotion) => (
                      <button 
                        key={emotion.name} 
                        onClick={() => setPatternEmotion(emotion.name)}
                        className={`px-3 py-2 rounded-md border text-sm transition-colors flex items-center gap-1.5 ${
                          patternEmotion === emotion.name 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                        }`}
                      >
                        <span>{emotion.emoji}</span>
                        <span>{emotion.name}</span>
                        {patternEmotion === emotion.name && <Check className="w-3 h-3 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Intensity: <span className="text-primary">{patternIntensity}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={patternIntensity}
                    onChange={(e) => setPatternIntensity(Number(e.target.value))}
                    className="w-full accent-primary" 
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Subtle</span>
                    <span>Overwhelming</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                  <Input 
                    placeholder="peaceful, relaxed, morning" 
                    value={patternTags}
                    onChange={(e) => setPatternTags(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => { setIsCreating(false); resetCreator(); }}>
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1" 
                    onClick={savePattern}
                    disabled={!patternEmotion || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Pattern"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Interpretation Modal */}
      {showInterpretation && selectedPatternForChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowInterpretation(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-md"
                  style={{ 
                    background: selectedPatternForChat.localImageData 
                      ? `url(${selectedPatternForChat.localImageData}) center/cover` 
                      : selectedPatternForChat.imageUrl
                        ? `url(${selectedPatternForChat.imageUrl}) center/cover`
                        : `linear-gradient(135deg, ${selectedPatternForChat.colorPalette?.[0] || '#6B7280'}, ${selectedPatternForChat.colorPalette?.[1] || '#6B7280'})` 
                  }}
                />
                <div>
                  <h2 className="text-lg font-medium text-slate-900">Pattern Interpretation</h2>
                  <p className="text-sm text-slate-500">{selectedPatternForChat.emotion}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowInterpretation(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              {/* Pattern Info */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                <div 
                  className="w-20 h-20 rounded-lg flex-shrink-0"
                  style={{ 
                    background: selectedPatternForChat.localImageData 
                      ? `url(${selectedPatternForChat.localImageData}) center/cover` 
                      : selectedPatternForChat.imageUrl
                        ? `url(${selectedPatternForChat.imageUrl}) center/cover`
                        : `linear-gradient(135deg, ${selectedPatternForChat.colorPalette?.[0] || '#6B7280'}, ${selectedPatternForChat.colorPalette?.[1] || '#6B7280'})` 
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{emotionOptions.find(e => e.name === selectedPatternForChat.emotion)?.emoji}</span>
                    <span className="font-medium text-slate-900">{selectedPatternForChat.emotion}</span>
                    <span className="text-xs text-slate-500">• {Math.round(selectedPatternForChat.intensity * 100)}% intensity</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedPatternForChat.tags?.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-white text-slate-600">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-2">
                    {selectedPatternForChat.colorPalette?.map((color, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Interpretation */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-slate-900">AI Interpretation</span>
                </div>
                <div className={`p-4 rounded-lg ${interpretation?.success ? "bg-primary/5 border border-primary/20" : "bg-yellow-50 border border-yellow-200"}`}>
                  {isInterpreting ? (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Analyzing pattern meaning...</span>
                    </div>
                  ) : interpretation ? (
                    <>
                      <p className="text-sm text-slate-700 leading-relaxed mb-3">{interpretation.interpretation}</p>
                      {interpretation.emotionalContext && (
                        <p className="text-xs text-slate-500 mb-3">Context: {interpretation.emotionalContext}</p>
                      )}
                      {interpretation.suggestedResponses && interpretation.suggestedResponses.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-slate-600 mb-2">Suggested Responses:</p>
                          <div className="flex flex-wrap gap-2">
                            {interpretation.suggestedResponses.map((response, i) => (
                              <span key={i} className="px-3 py-1 bg-white rounded-full text-xs text-slate-600 border border-slate-200">
                                {response}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">Unable to generate interpretation.</p>
                  )}
                </div>
              </div>

              {/* Send to Chat */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-3">Send this pattern to express your emotion</p>
                <div className="flex gap-2">
                  <Input placeholder="Select contact..." className="flex-1" />
                  <Button variant="primary" onClick={() => handleSendToChat("demo")}>
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
