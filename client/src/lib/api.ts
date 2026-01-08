const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthData {
  accessToken: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// ============ Pattern Types ============
interface PatternFeatures {
  shapeType: string;
  colorMood: string;
  lineQuality: string;
  density: number;
  symmetry: number;
  dominantColors?: string[];
  movement?: string;
  complexity?: string;
}

interface Pattern {
  _id: string;
  userId: string;
  imageUrl: string;
  emotion: string;
  intensity: number;
  tags: string[];
  colorPalette: string[];
  features?: PatternFeatures;
  usedCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface PatternAnalysisResult {
  success: boolean;
  features: PatternFeatures;
  suggestedEmotion: string;
  suggestedIntensity: number;
  interpretation: string;
  suggestedTags: string[];
  error?: string;
}

interface CreatePatternPayload {
  imageData: string;
  emotion?: string;
  intensity?: number;
  tags?: string[];
  colorPalette?: string[];
}

interface PatternInterpretResult {
  success: boolean;
  interpretation: string;
  emotionalContext: string;
  suggestedResponses: string[];
  patternInfo?: {
    name: string;
    emotion: string;
    intensity: number;
    tags: string[];
  };
  error?: string;
}

// ============ Chat Types ============
interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface EmotionMessage {
  _id: string;
  senderId: string;
  recipientId: string;
  conversationId: string;
  type: 'text' | 'emotion' | 'pattern';
  content?: string;
  emotionComposition?: {
    primary: { emotion: string; intensity: number };
    secondary?: { emotion: string; intensity: number };
  };
  patternId?: string;
  patternData?: {
    imageUrl: string;
    emotion: string;
    intensity: number;
  };
  interpretation?: string;
  createdAt: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAccessToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include',
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  // ============ Auth ============
  async login(payload: LoginPayload): Promise<ApiResponse<AuthData>> {
    return this.request<AuthData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthData>> {
    return this.request<AuthData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async refreshToken(): Promise<ApiResponse<AuthData>> {
    return this.request<AuthData>('/auth/refresh-token', {
      method: 'POST',
    });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    return this.request<null>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  // ============ Patterns ============
  async getPatterns(): Promise<ApiResponse<Pattern[]>> {
    return this.request<Pattern[]>('/patterns');
  }

  async getPatternById(id: string): Promise<ApiResponse<Pattern>> {
    return this.request<Pattern>(`/patterns/${id}`);
  }

  async getPatternsByEmotion(emotion: string): Promise<ApiResponse<Pattern[]>> {
    return this.request<Pattern[]>(`/patterns/emotion/${emotion}`);
  }

  async createPattern(payload: CreatePatternPayload): Promise<ApiResponse<{ pattern: Pattern; aiAnalysis: PatternAnalysisResult | null }>> {
    return this.request<{ pattern: Pattern; aiAnalysis: PatternAnalysisResult | null }>('/patterns', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async analyzePattern(imageData: string): Promise<ApiResponse<PatternAnalysisResult>> {
    return this.request<PatternAnalysisResult>('/patterns/analyze', {
      method: 'POST',
      body: JSON.stringify({ imageData }),
    });
  }

  async updatePattern(id: string, payload: Partial<CreatePatternPayload>): Promise<ApiResponse<Pattern>> {
    return this.request<Pattern>(`/patterns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  async deletePattern(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/patterns/${id}`, {
      method: 'DELETE',
    });
  }

  async interpretPattern(patternId: string, senderName: string, imageData?: string): Promise<ApiResponse<PatternInterpretResult>> {
    return this.request<PatternInterpretResult>('/patterns/interpret', {
      method: 'POST',
      body: JSON.stringify({ patternId, senderName, imageData }),
    });
  }

  async usePattern(id: string): Promise<ApiResponse<Pattern>> {
    return this.request<Pattern>(`/patterns/${id}/use`, {
      method: 'POST',
    });
  }

  // ============ Chat ============
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return this.request<Conversation[]>('/chat/conversations');
  }

  async getOrCreateConversation(participantId: string): Promise<ApiResponse<Conversation>> {
    return this.request<Conversation>('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ participantId }),
    });
  }

  async getMessages(conversationId: string): Promise<ApiResponse<EmotionMessage[]>> {
    return this.request<EmotionMessage[]>(`/chat/conversations/${conversationId}/messages`);
  }

  async sendTextMessage(conversationId: string, content: string): Promise<ApiResponse<EmotionMessage>> {
    return this.request<EmotionMessage>(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ type: 'text', content }),
    });
  }

  async sendPatternMessage(
    conversationId: string, 
    patternId: string, 
    imageData?: string
  ): Promise<ApiResponse<EmotionMessage>> {
    return this.request<EmotionMessage>(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ 
        type: 'pattern', 
        patternId,
        imageData,
      }),
    });
  }

  async sendEmotionMessage(
    conversationId: string, 
    emotionComposition: {
      primary: { emotion: string; intensity: number };
      secondary?: { emotion: string; intensity: number };
    }
  ): Promise<ApiResponse<EmotionMessage>> {
    return this.request<EmotionMessage>(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ 
        type: 'emotion', 
        emotionComposition,
      }),
    });
  }

  // ============ Contacts ============
  async getContacts(): Promise<ApiResponse<Array<{ _id: string; name: string; email: string; status: string }>>> {
    return this.request('/contacts');
  }

  // ============ Token Management ============
  setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  removeAccessToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const api = new ApiClient(API_BASE_URL);
export type { 
  LoginPayload, 
  RegisterPayload, 
  AuthData, 
  ApiResponse,
  Pattern,
  PatternFeatures,
  PatternAnalysisResult,
  CreatePatternPayload,
  PatternInterpretResult,
  Conversation,
  EmotionMessage,
};
