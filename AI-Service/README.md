# HeartSpeak AI - Python AI Service

Python FastAPI service for AI-powered emotion analysis and text generation.

## Setup

```bash
# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your API keys

# Run development server
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

- `POST /api/v1/emotion/analyze` - Analyze facial emotions from image
- `POST /api/v1/pattern/analyze` - Analyze pattern features
- `POST /api/v1/pattern/interpret` - Interpret pattern with context
- `POST /api/v1/chat/generate` - Generate emotion text
- `POST /api/v1/avatar/suggest` - Get avatar suggestions
- `POST /api/v1/avatar/build-profile` - Build/update avatar profile

## Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
MONGODB_URL=mongodb://localhost:27017/heartspeak
REDIS_URL=redis://localhost:6379
NODE_SERVER_URL=http://localhost:5000
```
