# Video Call Test Guide

Complete end-to-end guide for testing the HeartSpeak video call feature with emotion recognition.

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client A      │     │   Node Server   │     │   Client B      │
│   (Browser)     │     │   (Port 5000)   │     │   (Browser)     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │◄──── Socket.io ──────►│◄──── Socket.io ──────►│
         │                       │                       │
         │◄═══════ WebRTC P2P Video/Audio ══════════════►│
         │                       │                       │
         │    ┌──────────────────┴──────────────────┐    │
         │    │         AI Service (Port 8000)      │    │
         │    │         - Emotion Analysis          │    │
         │    │         - Text Generation           │    │
         │    └─────────────────────────────────────┘    │
```

---

## Prerequisites

### 1. MongoDB (Required for call sessions)
```bash
# Start MongoDB (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or if MongoDB is installed locally
sudo systemctl start mongod
```

### 2. Environment Files

**Server/.env:**
```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/heartspeak
JWT_ACCESS_SECRET=your_secret_key_here
NODE_ENV=development
```

**AI-Service/.env:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URL=mongodb://localhost:27017/heartspeak
NODE_SERVER_URL=http://localhost:5000
```

---

## Starting All Services

Open 3 terminal windows:

### Terminal 1: Node.js Server
```bash
cd /media/nafiz/NewVolume/HackDay/Server
npm install  # First time only
npm run dev
```
Expected output:
```
🚀 Server is running on port 5000
📡 Socket.io initialized
🌐 Accessible at http://YOUR_IP:5000
```

### Terminal 2: AI Service
```bash
cd /media/nafiz/NewVolume/HackDay/AI-Service
pip install -r requirements.txt  # First time only
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started reloader process
```

### Terminal 3: Next.js Client
```bash
cd /media/nafiz/NewVolume/HackDay/client
npm install  # First time only
npm run dev
```
Expected output:
```
▲ Next.js 16.x.x
- Local:        http://localhost:3000
```

---

## Test Scenario 1: Same Computer (Two Browser Windows)

### Step 1: Open Test Page
- Open **Chrome**: `http://localhost:3000/test-call`
- Open **Chrome Incognito** (Ctrl+Shift+N): `http://localhost:3000/test-call`

### Step 2: Configure Window 1 (Alice)
| Field | Value |
|-------|-------|
| Server IP | *(leave empty for localhost)* |
| Your User ID | `alice` |
| Contact's User ID | `bob` |

### Step 3: Configure Window 2 (Bob)
| Field | Value |
|-------|-------|
| Server IP | *(leave empty for localhost)* |
| Your User ID | `bob` |
| Contact's User ID | `alice` |

### Step 4: Make the Call
1. In Window 1 (Alice): Click **"Start Call"**
2. In Window 2 (Bob): You'll see "Incoming Call" - Click **"Accept"**
3. Both windows should show **"Connected"** status

### Step 5: Verify Connection
- ✅ Both windows show "Call Active" status
- ✅ You see your camera preview in the corner
- ✅ Console (F12) shows: "Connected to server" and signaling messages

---

## Test Scenario 2: Two Different Computers (Same Network)

### Step 1: Find Server Computer's IP
On the computer running the servers:
```bash
hostname -I
# Example output: 192.168.1.100
```

### Step 2: Start Servers (Computer 1)
```bash
# Terminal 1 - Node Server
cd /media/nafiz/NewVolume/HackDay/Server
npm run dev

# Terminal 2 - AI Service  
cd /media/nafiz/NewVolume/HackDay/AI-Service
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 3 - Client (accessible on network)
cd /media/nafiz/NewVolume/HackDay/client
npm run dev -- -H 0.0.0.0
```

### Step 3: Access from Computer 2
Open browser and go to:
```
http://192.168.1.100:3000/test-call
```
*(Replace 192.168.1.100 with actual IP from Step 1)*

### Step 4: Configure Both Computers

**Computer 1:**
| Field | Value |
|-------|-------|
| Server IP | `192.168.1.100` |
| Your User ID | `alice` |
| Contact's User ID | `bob` |

**Computer 2:**
| Field | Value |
|-------|-------|
| Server IP | `192.168.1.100` |
| Your User ID | `bob` |
| Contact's User ID | `alice` |

### Step 5: Make the Call
1. Either computer clicks **"Start Call"**
2. Other computer clicks **"Accept"**
3. Both should show **"Connected"**

---

## Test Scenario 3: With Emotion Detection

> **Note:** Emotion detection requires the AI Service to be running with a valid Gemini API key.

### Step 1: Verify AI Service
```bash
# Test AI Service health
curl http://localhost:8000/

# Expected: {"message": "HeartSpeak AI Service"}
```

### Step 2: Use Full Video Call Page
Instead of `/test-call`, use the dashboard:
```
http://localhost:3000/dashboard/calls
```

### Step 3: Enable Emotion Detection
1. Start a video call
2. Click the **Smile icon (😊)** in call controls to enable emotion detection
3. Your facial expressions are analyzed every 3 seconds
4. The other person sees your detected emotions

### What to Look For:
- Emotion overlay shows: "Detected Emotion: Happy 😊 85%"
- AI translation text appears at bottom
- Console shows: "Emotion received: happy"

---

## Verification Checklist

### ✅ Socket Connection
Open browser console (F12) and check for:
```
Socket: Connected
User alice connected
```

### ✅ Call Signaling
When call is initiated, console shows:
```
[Call] User alice initiating call to bob
[Call] Call initiated by alice
Call initiated: <call_id>
```

### ✅ Call Acceptance
When call is accepted:
```
[Call] Call accepted, both parties notified
Call accepted: <call_id>
```

### ✅ WebRTC Connection
```
Received signal from: bob
Peer connection established
Remote stream received
```

### ✅ Emotion Analysis (if enabled)
```
[Emotion] Processing frame for call <call_id>
Emotion received: happy
```

---

## Troubleshooting

### Problem: "Connection error" in browser
**Solution:**
1. Check if Node server is running on port 5000
2. Verify Server IP is correct
3. Check firewall allows port 5000

```bash
# Test server connectivity
curl http://localhost:5000/
# Should return: "HackDay Server is running!"
```

### Problem: Camera not working
**Solution:**
1. Allow camera permission in browser
2. Check if another app is using the camera
3. Try refreshing the page

### Problem: Call doesn't connect
**Solution:**
1. Both users must be connected to socket (check console)
2. Verify both users entered correct User IDs
3. Check MongoDB is running for call sessions

```bash
# Check MongoDB
mongosh
> use heartspeak
> db.callsessions.find()
```

### Problem: Emotion detection not working
**Solution:**
1. Verify AI Service is running on port 8000
2. Check GEMINI_API_KEY in .env
3. Ensure emotion toggle is ON (smile icon highlighted)

```bash
# Test AI Service
curl -X POST http://localhost:8000/api/v1/emotion/analyze \
  -H "Content-Type: application/json" \
  -d '{"image": "test", "call_id": "test123"}'
```

### Problem: Can't connect from other computer
**Solution:**
1. Both computers must be on same network
2. Check firewall on server computer:
```bash
# Allow ports (Ubuntu)
sudo ufw allow 3000
sudo ufw allow 5000
sudo ufw allow 8000
```

---

## Quick Reference Commands

```bash
# Start everything (run each in separate terminal)
cd /media/nafiz/NewVolume/HackDay/Server && npm run dev
cd /media/nafiz/NewVolume/HackDay/AI-Service && python -m uvicorn app.main:app --reload --port 8000
cd /media/nafiz/NewVolume/HackDay/client && npm run dev

# Find your IP
hostname -I

# Check ports in use
sudo lsof -i :5000
sudo lsof -i :8000
sudo lsof -i :3000

# Kill process on port (if needed)
kill -9 $(lsof -t -i:5000)
```

---

## Test URLs

| Service | Local URL | Network URL |
|---------|-----------|-------------|
| Client | http://localhost:3000 | http://YOUR_IP:3000 |
| Test Page | http://localhost:3000/test-call | http://YOUR_IP:3000/test-call |
| Dashboard | http://localhost:3000/dashboard/calls | http://YOUR_IP:3000/dashboard/calls |
| Node Server | http://localhost:5000 | http://YOUR_IP:5000 |
| AI Service | http://localhost:8000 | http://YOUR_IP:8000 |
| AI Docs | http://localhost:8000/docs | http://YOUR_IP:8000/docs |

---

## Expected Flow Summary

```
1. Alice opens /test-call, enters userId="alice", contactId="bob"
2. Bob opens /test-call, enters userId="bob", contactId="alice"
3. Alice clicks "Start Call"
   → Server creates CallSession in MongoDB
   → Server emits "call:incoming" to Bob
4. Bob sees incoming call, clicks "Accept"
   → Server emits "call:accepted" to Alice
   → Both clients start WebRTC peer connection
5. WebRTC signals exchanged via Socket.io
6. P2P connection established
7. Video/audio streams directly between browsers
8. (Optional) Frames sent to AI Service for emotion analysis
9. Either party clicks "End Call"
   → Call session updated in MongoDB
   → Both clients disconnect
```

