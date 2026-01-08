

<h1 align="center">HeartSpeak AI</h1>

<p align="center">
  <strong>Speak Without Words</strong><br/>
  An AI-powered multimodal communication platform for speech-impaired individuals
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Python-FastAPI-teal?style=flat-square&logo=python" alt="Python"/>
  <img src="https://img.shields.io/badge/AI-Gemini%20%7C%20GPT--4o-orange?style=flat-square&logo=google" alt="AI"/>
  <img src="https://img.shields.io/badge/WebRTC-P2P-red?style=flat-square&logo=webrtc" alt="WebRTC"/>
</p>

---

## 🌟 Overview

**HeartSpeak AI** transforms non-verbal expressions—facial expressions, gestures, drawings, and patterns—into meaningful emotional communication. This platform enables mute individuals to "speak" their hearts fluently through AI-powered emotion recognition and translation.

> *"Communication from the heart, not the mouth."*

### 🎯 Core Vision

Traditional AAC (Augmentative and Alternative Communication) apps focus on building sentences word by word. HeartSpeak takes a revolutionary **emotion-first approach**, capturing and translating feelings into natural, contextual language.

---

## ✨ Key Features

### 🎥 1. Visual Emotion Recognition Video Call
Real-time video calling where facial expressions and gestures are analyzed and converted to emotional text for the other participant.

- **Real-time facial analysis** using MediaPipe + Gemini AI
- **Micro-expression detection** capturing nuanced emotions
- **Natural language generation** ("Your friend seems thoughtful and mildly concerned")
- **WebRTC peer-to-peer** video streaming

### 🎨 2. Pattern-Based Emotional Language
Create visual patterns (drawings, colors, shapes) that represent emotions. AI learns personal associations.

- **Personal pattern dictionary** unique to each user
- **Visual emotion mapping** (spirals → confusion, warm gradients → comfort)
- **Historical symbol integration** (semaphore, universal visual languages)
- **Create "secret codes"** with friends and family

### 💬 3. Heart-to-Heart Chat System
Emotion-first messaging where users select feelings, intensity, and context—AI generates natural text.

- **Emotion composer** with primary/secondary emotions
- **Intensity slider** from subtle to overwhelming
- **Context layers** (body sensations, memory links)
- **Auto-generated emotion gradients** and visual art

### 🤖 4. Personal Emotion Avatar
An AI companion that learns your unique emotional patterns and communication style.

- **Learns your emotional vocabulary** over time
- **Relationship-aware** suggestions (different tone for family vs friends)
- **Proactive insights** ("You haven't connected with Mom in 2 weeks...")
- **Authentic voice** that maintains your personality

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         HeartSpeak AI                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   Client     │◄──►│   Server     │◄──►│   AI Service     │  │
│  │  (Next.js)   │    │  (Node.js)   │    │   (FastAPI)      │  │
│  │              │    │              │    │                  │  │
│  │ • Dashboard  │    │ • REST API   │    │ • Gemini AI      │  │
│  │ • Video Call │    │ • Socket.io  │    │ • GPT-4o         │  │
│  │ • Chat       │    │ • WebRTC Sig │    │ • MediaPipe      │  │
│  │ • Patterns   │    │ • MongoDB    │    │ • LangChain      │  │
│  │ • Avatar     │    │ • Auth/JWT   │    │ • Emotion Chains │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│         │                   │                    │              │
│         └───────────────────┴────────────────────┘              │
│                         WebSocket + REST                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
HackDay/
├── 📁 client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── dashboard/     # Protected dashboard routes
│   │   │   ├── signin/        # Authentication
│   │   │   └── test-call/     # Video call testing
│   │   ├── components/        # React components
│   │   │   ├── dashboard/     # Dashboard UI
│   │   │   ├── landing/       # Landing page sections
│   │   │   ├── ui/            # Reusable UI components
│   │   │   └── video-call/    # Video call components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities & API client
│   │   ├── store/             # Zustand state management
│   │   └── types/             # TypeScript types
│   └── package.json
│
├── 📁 Server/                 # Node.js Backend
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/       # Feature modules
│   │   │   │   ├── Auth/      # Authentication
│   │   │   │   ├── User/      # User management
│   │   │   │   └── Video/     # Video call logic
│   │   │   ├── socket/        # WebSocket handlers
│   │   │   ├── services/      # External service integrations
│   │   │   ├── middlewares/   # Express middlewares
│   │   │   └── utils/         # Utility functions
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Entry point + Socket.io
│   └── package.json
│
├── 📁 AI-Service/             # Python AI Service
│   ├── app/
│   │   ├── api/v1/            # API endpoints
│   │   ├── agents/            # LangChain agents
│   │   ├── chains/            # LangChain chains
│   │   ├── memory/            # Conversation memory
│   │   ├── services/          # AI service wrappers
│   │   └── main.py            # FastAPI entry point
│   └── requirements.txt
│
├── 📁 shared/                 # Shared resources
│   ├── constants/             # Emotion definitions, colors
│   └── types/                 # Shared TypeScript types
│
├── idea.md                    # Project vision & concept
├── pipeline.md                # Complete architecture docs
└── README.md                  # This file
```

---

## 🛠️ Tech Stack

### Frontend (`client/`)
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TailwindCSS 4** | Utility-first styling |
| **Framer Motion** | Animations |
| **Zustand** | State management |
| **Socket.io-client** | Real-time communication |
| **simple-peer** | WebRTC wrapper |
| **Lucide React** | Icons |

### Backend (`Server/`)
| Technology | Purpose |
|------------|---------|
| **Express.js** | Web framework |
| **TypeScript** | Type safety |
| **MongoDB/Mongoose** | Database |
| **Socket.io** | WebSocket server |
| **JWT** | Authentication |
| **Zod** | Validation |
| **Cloudinary** | Media storage |
| **bcryptjs** | Password hashing |

### AI Service (`AI-Service/`)
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python web framework |
| **LangChain** | AI orchestration |
| **Google Gemini** | Vision & fast analysis |
| **OpenAI GPT-4o** | Creative text generation |
| **MediaPipe** | Face/gesture detection |
| **OpenCV** | Image processing |
| **Redis** | Session/memory storage |
| **Motor** | Async MongoDB |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ 
- **Python** 3.10+
- **MongoDB** (local or Atlas)
- **Redis** (optional, for production)
- **API Keys**: Gemini AI, OpenAI (optional)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/heartspeak-ai.git
cd heartspeak-ai
```

### 2️⃣ Setup the Backend Server

```bash
cd Server
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/heartspeak
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=365d
BCRYPT_SALT_ROUNDS=12
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PYTHON_AI_SERVICE_URL=http://localhost:8000
```

Start the server:

```bash
npm run dev
```

### 3️⃣ Setup the AI Service

```bash
cd AI-Service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

Edit `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
MONGODB_URL=mongodb://localhost:27017/heartspeak
REDIS_URL=redis://localhost:6379
NODE_SERVER_URL=http://localhost:5000
```

Start the AI service:

```bash
uvicorn app.main:app --reload --port 8000
```

### 4️⃣ Setup the Frontend Client

```bash
cd client
npm install

# Create environment file (if needed)
# Add your environment variables
```

Start the development server:

```bash
npm run dev
```

### 5️⃣ Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service API**: http://localhost:8000/docs (Swagger UI)

---

## 📡 API Reference

### Node.js Server Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | User login |
| `POST` | `/api/v1/auth/refresh-token` | Refresh access token |
| `POST` | `/api/v1/auth/change-password` | Change password |

### Python AI Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/emotion/analyze` | Analyze facial emotions from image |
| `POST` | `/api/v1/pattern/analyze` | Analyze pattern features |
| `POST` | `/api/v1/pattern/interpret` | Interpret pattern with context |
| `POST` | `/api/v1/chat/generate` | Generate emotion-to-text |
| `POST` | `/api/v1/avatar/suggest` | Get avatar suggestions |
| `POST` | `/api/v1/avatar/build-profile` | Build/update avatar profile |

---

## 🔌 Socket.io Events

### Video Call Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `call:initiate` | Client → Server | Start a call |
| `call:incoming` | Server → Client | Notify recipient |
| `call:accept` | Client → Server | Accept call |
| `call:reject` | Client → Server | Reject call |
| `call:signal` | Bidirectional | WebRTC signaling |
| `call:emotion` | Server → Client | Emotion analysis result |
| `call:end` | Bidirectional | End call |

### Chat Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `chat:message` | Server → Client | New emotion message |
| `chat:typing` | Bidirectional | Typing indicator |
| `chat:reaction` | Bidirectional | Message reaction |

---

## 🤖 AI Strategy

HeartSpeak uses a smart routing system to choose the best AI for each task:

```
┌─────────────────────────────────────────────────────────┐
│                  AI REQUEST ROUTING                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Has Image/Video? ──YES──► 🟦 GEMINI (Vision tasks)    │
│        │                                                │
│       NO                                                │
│        │                                                │
│  Needs Creativity? ─YES──► 🟩 GPT-4o (Rich text gen)   │
│        │                                                │
│       NO                                                │
│        │                                                │
│  Simple Task? ──────YES──► 🟦 GEMINI FLASH (Fast)      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Use Case | Best AI | Reasoning |
|----------|---------|-----------|
| Real-time video analysis | Gemini Flash | Fast, cost-effective, multimodal |
| Pattern recognition | Gemini Flash | Superior visual understanding |
| Emotion text generation | GPT-4o | Nuanced, empathetic writing |
| Avatar conversations | GPT-4o | Personality consistency |
| Quick classification | Gemini Flash | Low latency |

---

## 🧪 Testing Video Calls

See the [VIDEO_CALL_TEST_GUIDE.md](./VIDEO_CALL_TEST_GUIDE.md) for comprehensive testing instructions.

Quick test:
1. Open http://localhost:3000/test-call in two browser tabs
2. Register/login with different users
3. Initiate a call from one tab
4. Accept in the other tab
5. Observe emotion detection overlays

---

## 🚢 Deployment

### Recommended Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Cloudflare (CDN/DNS)                                  │
│        │                                                │
│   ┌────┴────────────────────────────────┐              │
│   │            │            │           │              │
│   ▼            ▼            ▼           ▼              │
│ Vercel     Railway      Railway     MongoDB            │
│ (Next.js)  (Node.js)    (Python)    Atlas              │
│                                                         │
│              │            │                            │
│              └────────────┴──► Redis (Upstash)         │
│                              + Cloudinary              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📜 Scripts Reference

### Server
```bash
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

### AI Service
```bash
uvicorn app.main:app --reload --port 8000  # Development
uvicorn app.main:app --host 0.0.0.0 --port 8000  # Production
```

### Client
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Start production
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the modular architecture pattern
4. Add TypeScript types & Zod validation
5. Test Socket.io events manually
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- **MediaPipe** for face/gesture detection
- **LangChain** for AI orchestration
- **Google Gemini** & **OpenAI** for AI capabilities
- All contributors and the open-source community

---

<p align="center">
  <strong>HeartSpeak AI</strong> — Empowering communication from the heart ❤️
</p>

<p align="center">
  <sub>Built with 💜 for those who speak without words</sub>
</p>

