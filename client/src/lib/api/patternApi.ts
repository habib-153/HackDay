import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface PatternFeatures {
  shapeType: "spiral" | "angular" | "flowing" | "geometric" | "chaotic" | "organic";
  colorMood: "warm" | "cool" | "vibrant" | "muted" | "monochrome";
  lineQuality: "smooth" | "jagged" | "continuous" | "broken";
  density: number;
  symmetry: number;
  description?: string;
}

export interface Pattern {
  _id: string;
  userId: string;
  imageUrl: string;
  emotion: string;
  intensity: number;
  tags: string[];
  colorPalette: string[];
  features?: PatternFeatures;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
  
  // UI-specific properties (for compatibility with frontend display)
  id?: number | string;
  name?: string;
  colors?: string[];
  gradient?: string;
  usedCount?: number;
}

export interface CreatePatternPayload {
  imageData: string;
  emotion: string;
  intensity: number;
  tags: string[];
  colorPalette: string[];
}

export interface InterpretPatternPayload {
  imageData: string;
  senderId: string;
}

export interface InterpretPatternResponse {
  interpretation: string;
  matchedPatterns: string[];
  confidence: number;
}

class PatternAPI {
  private getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async createPattern(payload: CreatePatternPayload): Promise<Pattern> {
    const response = await axios.post(
      `${API_BASE_URL}/patterns`,
      payload,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async getPatterns(): Promise<Pattern[]> {
    const response = await axios.get(`${API_BASE_URL}/patterns`, {
      headers: this.getAuthHeader(),
    });
    return response.data.data;
  }

  async getPatternById(id: string): Promise<Pattern> {
    const response = await axios.get(`${API_BASE_URL}/patterns/${id}`, {
      headers: this.getAuthHeader(),
    });
    return response.data.data;
  }

  async getPatternsByEmotion(emotion: string): Promise<Pattern[]> {
    const response = await axios.get(
      `${API_BASE_URL}/patterns/emotion/${emotion}`,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async deletePattern(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/patterns/${id}`, {
      headers: this.getAuthHeader(),
    });
  }

  async interpretPattern(
    payload: InterpretPatternPayload
  ): Promise<InterpretPatternResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/patterns/interpret`,
      payload,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }
}

export const patternApi = new PatternAPI();
