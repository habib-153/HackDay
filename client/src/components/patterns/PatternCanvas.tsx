"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Edit3, Eraser, Undo, Redo, Trash2 } from "lucide-react";

interface PatternCanvasProps {
  onSave?: (imageData: string) => void;
  width?: number;
  height?: number;
}

type Tool = "pen" | "brush" | "eraser";

export default function PatternCanvas({
  onSave,
  width = 500,
  height = 500,
}: PatternCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>("pen");
  const [currentColor, setCurrentColor] = useState("#F87171");
  const [lineWidth, setLineWidth] = useState(3);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize with white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // Save initial state
    saveToHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setHistoryStep(historyStep - 1);
      ctx.putImageData(history[historyStep - 1], 0, 0);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setHistoryStep(historyStep + 1);
      ctx.putImageData(history[historyStep + 1], 0, 0);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    saveToHistory();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (currentTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = lineWidth * 3;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentTool === "brush" ? lineWidth * 2 : lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL("image/png");
    if (onSave) {
      onSave(imageData);
    }
    return imageData;
  };

  const colors = [
    "#F87171", // coral/red
    "#FBBF24", // amber/yellow
    "#34D399", // green
    "#60A5FA", // blue
    "#A78BFA", // purple/lavender
    "#F472B6", // pink
    "#14B8A6", // teal
    "#FB923C", // orange
  ];

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-dashed border-slate-200 rounded-2xl cursor-crosshair bg-white shadow-sm"
          style={{ touchAction: "none" }}
        />
      </div>

      {/* Tools */}
      <div className="flex items-center justify-between gap-4">
        {/* Drawing Tools */}
        <div className="flex items-center gap-2">
          <Button
            variant={currentTool === "pen" ? "primary" : "outline"}
            size="sm"
            onClick={() => setCurrentTool("pen")}
          >
            <Pencil className="w-4 h-4" />
            Pen
          </Button>
          <Button
            variant={currentTool === "brush" ? "primary" : "outline"}
            size="sm"
            onClick={() => setCurrentTool("brush")}
          >
            <Edit3 className="w-4 h-4" />
            Brush
          </Button>
          <Button
            variant={currentTool === "eraser" ? "primary" : "outline"}
            size="sm"
            onClick={() => setCurrentTool("eraser")}
          >
            <Eraser className="w-4 h-4" />
            Eraser
          </Button>
        </div>

        {/* History Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={undo}
            disabled={historyStep <= 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={redo}
            disabled={historyStep >= history.length - 1}
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={clearCanvas}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Color Picker */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">Color:</span>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-8 h-8 rounded-full shadow-sm hover:scale-110 transition-transform ${
                currentColor === color ? "ring-2 ring-coral ring-offset-2" : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Line Width */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Brush Size:
          </span>
          <span className="text-sm text-slate-500">{lineWidth}px</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="w-full accent-coral"
        />
      </div>
    </div>
  );
}

export { PatternCanvas };
