# 🤖 Groq API Integration - Complete Teaching Guide

**Comprehensive documentation for teaching Groq AI integration with Flask**

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Getting API Key](#getting-api-key)
5. [Testing Connection](#testing-connection)
6. [Backend Integration](#backend-integration)
7. [Frontend Integration](#frontend-integration)
8. [API Flow Explanation](#api-flow-explanation)
9. [Code Walkthrough](#code-walkthrough)
10. [Advanced Features](#advanced-features)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)
13. [Teaching Resources](#teaching-resources)

---

## 🎯 Introduction

### What is Groq?

Groq is an **AI inference platform** that provides ultra-fast responses using custom LPU (Language Processing Unit) hardware.

**Key Features:**
- ⚡ **Speed**: 18x faster than traditional GPU inference
- 🆓 **Free Tier**: 30 requests/minute, 14,400 requests/day
- 🧠 **Models**: Llama 3.3, Mixtral, Gemma
- 🔌 **OpenAI-Compatible**: Easy to integrate

### Why Groq for This Project?

| Aspect | Groq | OpenAI | Other |
|--------|------|--------|-------|
| **Speed** | ~1-2 sec | ~3-5 sec | ~5-10 sec |
| **Cost** | Free tier | Paid only | Varies |
| **Setup** | Simple | Complex | Varies |
| **Learning** | Great for demos | Production | Varies |

### What We'll Build

A **real-time AI chat assistant** with:
1. Flask backend handling API calls
2. Groq API for AI responses
3. JavaScript frontend for UI
4. Conversation history for context
5. Text-to-Speech integration

---

## 🏗️ Architecture Overview

### System Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🌐 Browser (http://localhost:5000)                  │  │
│  │  • AI Pill floating button                           │  │
│  │  • Chat interface with history                       │  │
│  │  • Input field + Send button                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ User types message
┌─────────────────────────────────────────────────────────────┐
│               FRONTEND (JavaScript)                         │
│  File: static/js/ai_assistant.js                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  async function sendMessage() {                      │  │
│  │    1. Get user input                                 │  │
│  │    2. Display in chat                                │  │
│  │    3. Show typing indicator                          │  │
│  │    4. Call Flask API                                 │  │
│  │  }                                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ fetch('/api/chat', {...})
┌─────────────────────────────────────────────────────────────┐
│                 FLASK BACKEND (Python)                      │
│  File: app.py                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  @app.route('/api/chat', methods=['POST'])           │  │
│  │  1. Receive JSON request                             │  │
│  │  2. Extract message & history                        │  │
│  │  3. Build messages array                             │  │
│  │  4. Add system prompt                                │  │
│  │  5. Call Groq API                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ groq_client.chat.completions.create()
┌─────────────────────────────────────────────────────────────┐
│                     GROQ API                                │
│  URL: https://api.groq.com/openai/v1/chat/completions     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • Receives messages array                           │  │
│  │  • Processes with Llama 3.3 (70B params)             │  │
│  │  • Runs on LPU hardware (ultra-fast)                 │  │
│  │  • Returns AI response                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ JSON response
┌─────────────────────────────────────────────────────────────┐
│                 FLASK BACKEND                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  6. Extract AI response text                         │  │
│  │  7. Create JSON response                             │  │
│  │  8. Send to frontend                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ return jsonify({...})
┌─────────────────────────────────────────────────────────────┐
│               FRONTEND (JavaScript)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  5. Hide typing indicator                            │  │
│  │  6. Display AI response                              │  │
│  │  7. Update conversation history                      │  │
│  │  8. Auto-play TTS if enabled                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Request Journey:**
```
User Input → JavaScript → Flask → Groq API → Flask → JavaScript → Display
```

**Message Format:**
```json
// Request to Flask
{
  "message": "What is Flask?",
  "conversation_history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi!"}
  ]
}

// Response from Flask
{
  "success": true,
  "response": "Flask is a lightweight Python web framework...",
  "model": "llama-3.3-70b-versatile"
}
```

---

## 📦 Prerequisites

### Required Software

```bash
# Check Python version (need 3.8+)
python --version
# Output: Python 3.10.x or higher

# Check pip
pip --version

# Check Flask installation
python -c "import flask; print(flask.__version__)"
```

### Install Dependencies

```bash
# Core packages
pip install groq flask python-dotenv

# Verify installation
pip list | grep groq
# Should show: groq  0.4.1 (or higher)
```

### Project Structure

```
Flask-Workshop-Assistant/
├── app.py                      # Flask backend with Groq
├── .env                        # API keys (DO NOT COMMIT!)
├── .gitignore                  # Excludes .env
├── requirements.txt            # Python dependencies
├── static/
│   ├── js/
│   │   ├── ai_assistant.js    # Chat frontend
│   │   ├── settings.js        # Settings management
│   │   └── tts.js             # Text-to-Speech
│   └── css/
│       └── ai_assistant.css   # UI styles
├── templates/
│   ├── base.html              # Base template
│   ├── chat.html              # Chat page
│   └── components/
│       └── ai_assistant.html  # AI pill component
└── docs/
    └── GROQ_API_INTEGRATION.md  # This file
```

---

## 🔑 Getting API Key

### Step-by-Step Guide

**1. Create Groq Account**

- Visit: [https://console.groq.com](https://console.groq.com)
- Click **"Sign Up"**
- Choose: Google / GitHub / Email
- Complete registration

**2. Navigate to API Keys**

- After login → **"API Keys"** in sidebar
- Or direct: [https://console.groq.com/keys](https://console.groq.com/keys)

**3. Create New Key**

- Click **"Create API Key"**
- (Optional) Add description: "Flask Workshop"
- Click **"Create"**

**4. Copy and Save Key**

⚠️ **CRITICAL**: Copy the key immediately! You won't see it again!

```
Key format: gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            ^-- Always starts with "gsk_"
```

**5. Store in .env File**

```bash
# Create .env in project root
touch .env

# Add your key
echo "GROQ_API_KEY=gsk_your_actual_key_here" > .env
```

**6. Secure It**

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo "*.pyc" >> .gitignore
echo "__pycache__/" >> .gitignore

# Verify .env is ignored
git status  # .env should NOT appear
```

---

## 🧪 Testing Connection

### Test 1: Basic Connection

Create `test_groq_basic.py`:

```python
"""
Test 1: Verify Groq API Connection
This tests that your API key works and Groq responds
"""

from groq import Groq
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

print("\n" + "="*60)
print("🧪 TEST 1: Basic Groq Connection")
print("="*60 + "\n")

# Step 1: Check API key
api_key = os.getenv('GROQ_API_KEY')

if not api_key:
    print("❌ FAILED: No API key found!")
    print("\n📝 Solution:")
    print("   1. Create .env file in project root")
    print("   2. Add line: GROQ_API_KEY=gsk_...")
    print("   3. Save and try again\n")
    exit(1)

print(f"✅ API Key found: {api_key[:15]}...{api_key[-5:]}")
print(f"   Length: {len(api_key)} characters\n")

# Step 2: Initialize client
try:
    client = Groq(api_key=api_key)
    print("✅ Groq client initialized\n")
except Exception as e:
    print(f"❌ FAILED: {e}\n")
    exit(1)

# Step 3: Send test message
print("📤 Sending test message to Groq...")
print("   Message: 'Say Hello from Groq in one sentence'\n")

try:
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Say 'Hello from Groq!' in exactly one sentence."
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=50
    )
    
    # Extract response
    ai_response = response.choices[0].message.content
    
    # Display results
    print("✅ SUCCESS! Groq API is working!\n")
    print("─" * 60)
    print(f"🤖 AI Response: {ai_response}")
    print("─" * 60)
    print(f"\n📊 Details:")
    print(f"   Model: {response.model}")
    print(f"   Total tokens: {response.usage.total_tokens}")
    print(f"   Prompt tokens: {response.usage.prompt_tokens}")
    print(f"   Completion tokens: {response.usage.completion_tokens}")
    
except Exception as e:
    print(f"❌ FAILED: {e}")
    print(f"\n📝 Common issues:")
    print("   • Invalid API key")
    print("   • No internet connection")
    print("   • Groq service down\n")
    exit(1)

print("\n" + "="*60)
print("✅ Test completed successfully!")
print("="*60 + "\n")
```

**Run test:**
```bash
python test_groq_basic.py
```

**Expected output:**
```
============================================================
🧪 TEST 1: Basic Groq Connection
============================================================

✅ API Key found: gsk_abcdefghij...xyz12
   Length: 56 characters

✅ Groq client initialized

📤 Sending test message to Groq...
   Message: 'Say Hello from Groq in one sentence'

✅ SUCCESS! Groq API is working!

────────────────────────────────────────────────────────────
🤖 AI Response: Hello from Groq!
────────────────────────────────────────────────────────────

📊 Details:
   Model: llama-3.3-70b-versatile
   Total tokens: 18
   Prompt tokens: 12
   Completion tokens: 6

============================================================
✅ Test completed successfully!
============================================================
```

### Test 2: Conversation with Context

Create `test_groq_conversation.py`:

```python
"""
Test 2: Conversation with Memory
Tests that AI remembers previous messages (context)
"""

from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

print("\n" + "="*60)
print("🧪 TEST 2: Conversation with Memory")
print("="*60 + "\n")

client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Conversation history (like our frontend)
conversation = [
    {
        "role": "system",
        "content": "You are a helpful assistant. Keep responses brief."
    }
]

def ask(message):
    """Send message and get response"""
    print(f"\n{'─'*60}")
    print(f"👤 User: {message}")
    
    # Add to history
    conversation.append({"role": "user", "content": message})
    
    # Get response
    response = client.chat.completions.create(
        messages=conversation,
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=100
    )
    
    ai_message = response.choices[0].message.content
    
    # Add to history
    conversation.append({"role": "assistant", "content": ai_message})
    
    print(f"🤖 AI: {ai_message}")
    return ai_message

print("Starting 3-turn conversation...\n")

# Turn 1: Introduce yourself
ask("My name is Alice and I like Python.")

# Turn 2: Test memory (should remember "Alice")
ask("What's my name?")

# Turn 3: Test memory (should remember "Python")
ask("What programming language do I like?")

print(f"\n{'─'*60}")
print(f"\n✅ Test complete!")
print(f"   Total messages in history: {len(conversation)}")
print(f"   (1 system + 6 conversation messages)")
print("\n💡 The AI remembered context across multiple turns!")
print("="*60 + "\n")
```

**Run test:**
```bash
python test_groq_conversation.py
```

**Expected output:**
```
============================================================
🧪 TEST 2: Conversation with Memory
============================================================

Starting 3-turn conversation...

────────────────────────────────────────────────────────────
👤 User: My name is Alice and I like Python.
🤖 AI: Nice to meet you, Alice! Python is a great language.

────────────────────────────────────────────────────────────
👤 User: What's my name?
🤖 AI: Your name is Alice!

────────────────────────────────────────────────────────────
👤 User: What programming language do I like?
🤖 AI: You like Python!

────────────────────────────────────────────────────────────

✅ Test complete!
   Total messages in history: 7
   (1 system + 6 conversation messages)

💡 The AI remembered context across multiple turns!
============================================================
```

---

## 🔧 Backend Integration

### Understanding the Code

Let's break down `app.py` section by section:

#### Part 1: Imports and Setup

```python
from flask import Flask, jsonify, request
from groq import Groq
from dotenv import load_dotenv
import os

# Load .env file into environment
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'default-secret-key')

# Initialize Groq with API key from .env
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))
```

**Explanation:**
- `load_dotenv()`: Reads `.env` file, makes keys available via `os.getenv()`
- `groq_client`: Reusable client for all API calls
- `app.secret_key`: Required for Flask sessions

#### Part 2: System Prompt

```python
SYSTEM_PROMPT = """You are a helpful AI assistant for Flask Workshop.
You help users with Python, Flask, and web development questions.
Keep responses concise (2-3 sentences for simple questions).
Be friendly and encouraging."""
```

**Purpose:**
- Defines AI personality/behavior
- Sets tone and style
- Gives context about what the AI should do

**Try changing it:**
```python
# Professional assistant
SYSTEM_PROMPT = """You are a professional coding tutor.
Provide detailed technical explanations with code examples."""

# Funny assistant
SYSTEM_PROMPT = """You are a witty AI with a sense of humor.
Make jokes and puns while still being helpful."""
```

#### Part 3: API Endpoint

```python
@app.route('/api/chat', methods=['POST'])
def api_chat():
    """
    Handles chat messages from frontend
    
    Expected JSON body:
    {
        "message": "user's question",
        "conversation_history": [{role: "user", content: "..."}]
    }
    
    Returns JSON:
    {
        "success": true,
        "response": "AI's answer",
        "model": "model-name"
    }
    """
```

**Step-by-step breakdown:**

**Step 1: Get and validate request data**
```python
try:
    data = request.get_json()  # Parse JSON from request body
    
    if not data or 'message' not in data:
        return jsonify({
            'success': False,
            'error': 'No message provided'
        }), 400  # 400 = Bad Request
```

**Step 2: Extract message and history**
```python
    user_message = data['message']
    conversation_history = data.get('conversation_history', [])
    
    print(f"💬 User: {user_message}")  # Log for debugging
```

**Step 3: Build messages array for Groq**
```python
    # Start with system prompt
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]
    
    # Add conversation history (last 10 to save tokens)
    messages.extend(conversation_history[-10:])
    
    # Add current user message
    messages.append({
        "role": "user",
        "content": user_message
    })
```

**Why last 10 messages?**
- Reduces token usage (costs)
- Keeps context relevant
- Prevents hitting token limits

**Step 4: Call Groq API**
```python
    print("🤖 Calling Groq API...")
    
    chat_completion = groq_client.chat.completions.create(
        messages=messages,
        model="llama-3.3-70b-versatile",  # AI model
        temperature=0.7,                   # Creativity (0-2)
        max_tokens=1024,                   # Max response length
        top_p=1,                           # Sampling method
        stream=False                       # Get full response
    )
```

**Parameter Guide:**

| Parameter | Type | Range | Purpose |
|-----------|------|-------|----------|
| `messages` | list | - | Conversation history |
| `model` | string | - | Which AI model to use |
| `temperature` | float | 0-2 | Higher = more creative |
| `max_tokens` | int | 1-8000 | Response length limit |
| `top_p` | float | 0-1 | Sampling diversity |
| `stream` | bool | true/false | Chunk-by-chunk or all at once |

**Step 5: Extract and return response**
```python
    # Get AI's response text
    ai_response = chat_completion.choices[0].message.content
    
    print(f"✅ AI: {ai_response[:100]}...")
    
    # Return success response
    return jsonify({
        'success': True,
        'response': ai_response,
        'model': 'llama-3.3-70b-versatile'
    })
```

**Step 6: Error handling**
```python
except Exception as e:
    print(f"❌ Error: {str(e)}")
    return jsonify({
        'success': False,
        'error': 'An error occurred. Please try again.'
    }), 500  # 500 = Server Error
```

---

## 🎨 Frontend Integration

### JavaScript Code Explanation

From `static/js/ai_assistant.js`:

#### Part 1: Global Variables

```javascript
let conversationHistory = [];  // For context (sent to backend)
let chatMessages = [];         // For display (shown in UI)
let isListening = false;       // Microphone state
let isSearchOpen = false;      // Chat UI open/closed
```

#### Part 2: Send Message Function

```javascript
async function sendMessage() {
    // 1. Get user input
    const input = document.getElementById('aiSearchInput');
    const message = input.value.trim();
    
    // Validate
    if (!message) return;
    
    console.log('📤 Sending:', message);
    
    // 2. Display user message immediately (instant feedback)
    addMessageToChat(message, 'user');
    
    // 3. Clear input and disable button
    input.value = '';
    showTypingIndicator();  // Show "AI is thinking..."
    
    try {
        // 4. Send POST request to Flask
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversation_history: conversationHistory
            })
        });
        
        // 5. Parse JSON response
        const data = await response.json();
        
        // 6. Check if successful
        if (data.success) {
            // Update history for next message
            conversationHistory.push(
                {role: "user", content: message},
                {role: "assistant", content: data.response}
            );
            
            // Keep only last 10 messages
            if (conversationHistory.length > 10) {
                conversationHistory = conversationHistory.slice(-10);
            }
            
            // Hide typing, show response
            hideTypingIndicator();
            addMessageToChat(data.response, 'ai');
            
            console.log('✅ Success');
        } else {
            // Show error message
            hideTypingIndicator();
            addMessageToChat('Sorry, an error occurred.', 'ai');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        hideTypingIndicator();
        addMessageToChat('Connection error.', 'ai');
    }
}
```

**Key Concepts:**

1. **async/await**: Clean syntax for promises
2. **fetch()**: Modern way to make HTTP requests
3. **JSON.stringify()**: Convert JS object to JSON string
4. **Error handling**: try-catch prevents crashes
5. **User feedback**: Show loading states

#### Part 3: Display Message

```javascript
function addMessageToChat(content, type) {
    // type = 'user' or 'ai'
    
    // Store for history
    chatMessages.push({content, type, timestamp: Date.now()});
    
    const chatHistory = document.getElementById('aiChatHistory');
    
    // Create message bubble
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${type}`;
    messageDiv.innerHTML = `
        <div class="ai-message-content">
            ${formatResponse(content)}
        </div>
    `;
    
    // Add to DOM
    chatHistory.appendChild(messageDiv);
    scrollChatToBottom();
    
    // Auto-speak if AI response and TTS enabled
    if (type === 'ai') {
        speakAIResponse(content);
    }
}
```

---

## 📊 API Flow Explanation

### Complete Request-Response Cycle

Let's trace a message: **"What is Flask?"**

#### Step 1: User Types Message
```
User interface:
┌────────────────────────┐
│ What is Flask?        │ ← User types here
│                   [▲] │ ← Clicks send
└────────────────────────┘
```

#### Step 2: JavaScript Captures Input
```javascript
const message = "What is Flask?"
addMessageToChat(message, 'user')  // Display immediately
```

UI now shows:
```
┌────────────────────────┐
│ 👤 You                │
│ What is Flask?        │
└────────────────────────┘
```

#### Step 3: Frontend Prepares Request
```javascript
const payload = {
    message: "What is Flask?",
    conversation_history: []  // Empty for first message
}
```

#### Step 4: HTTP POST Request
```http
POST /api/chat HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
    "message": "What is Flask?",
    "conversation_history": []
}
```

#### Step 5: Flask Receives Request
```python
# In app.py
data = request.get_json()
# data = {"message": "What is Flask?", "conversation_history": []}

user_message = data['message']  # "What is Flask?"
conversation_history = data.get('conversation_history', [])  # []
```

#### Step 6: Flask Builds Messages Array
```python
messages = [
    {
        "role": "system",
        "content": "You are a helpful AI assistant..."
    },
    {
        "role": "user",
        "content": "What is Flask?"
    }
]
```

#### Step 7: Flask Calls Groq API
```python
response = groq_client.chat.completions.create(
    messages=messages,
    model="llama-3.3-70b-versatile",
    temperature=0.7,
    max_tokens=1024
)
```

This sends:
```http
POST https://api.groq.com/openai/v1/chat/completions
Authorization: Bearer gsk_...
Content-Type: application/json

{
    "model": "llama-3.3-70b-versatile",
    "messages": [
        {"role": "system", "content": "..."},
        {"role": "user", "content": "What is Flask?"}
    ],
    "temperature": 0.7,
    "max_tokens": 1024
}
```

#### Step 8: Groq Processes (on LPU hardware)
```
Groq LPU:
1. Receives request (~10ms)
2. Loads Llama 3.3 70B model (~50ms)
3. Processes with context (~1000ms)
4. Generates response tokens (~500ms)
5. Returns JSON (~10ms)

Total: ~1.5 seconds ⚡
```

#### Step 9: Groq Returns Response
```json
{
    "id": "chatcmpl-abc123",
    "object": "chat.completion",
    "created": 1709876543,
    "model": "llama-3.3-70b-versatile",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "Flask is a lightweight Python web framework that makes it easy to build web applications with minimal boilerplate code."
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 25,
        "completion_tokens": 22,
        "total_tokens": 47
    }
}
```

#### Step 10: Flask Extracts Response
```python
ai_response = chat_completion.choices[0].message.content
# "Flask is a lightweight Python web framework..."
```

#### Step 11: Flask Sends to Frontend
```python
return jsonify({
    'success': True,
    'response': ai_response,
    'model': 'llama-3.3-70b-versatile'
})
```

HTTP Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "success": true,
    "response": "Flask is a lightweight Python web framework...",
    "model": "llama-3.3-70b-versatile"
}
```

#### Step 12: Frontend Receives Response
```javascript
const data = await response.json();
// data = {success: true, response: "Flask is...", ...}

if (data.success) {
    addMessageToChat(data.response, 'ai');
}
```

#### Step 13: Display in UI
```
┌────────────────────────┐
│ 👤 You                │
│ What is Flask?        │
├────────────────────────┤
│ 🤖 AI                 │
│ Flask is a lightweight│
│ Python web framework  │
│ that makes it easy... │
└────────────────────────┘
```

#### Step 14: Update History
```javascript
conversationHistory.push(
    {role: "user", content: "What is Flask?"},
    {role: "assistant", content: "Flask is a lightweight..."}
)

// Now conversationHistory = [
//   {role: "user", content: "What is Flask?"},
//   {role: "assistant", content: "Flask is..."}
// ]
```

**Next message will include this history for context!**

---

## 🎓 Code Walkthrough

### Example: Multi-turn Conversation

Let's trace a full conversation:

```
Turn 1: "My favorite color is blue"
Turn 2: "What's my favorite color?"
```

#### Turn 1: First Message

**Frontend sends:**
```json
{
    "message": "My favorite color is blue",
    "conversation_history": []
}
```

**Backend builds:**
```python
messages = [
    {"role": "system", "content": "You are helpful..."},
    {"role": "user", "content": "My favorite color is blue"}
]
```

**Groq responds:**
```
"That's great! Blue is a beautiful color."
```

**Frontend updates history:**
```javascript
conversationHistory = [
    {role: "user", content: "My favorite color is blue"},
    {role: "assistant", content: "That's great! Blue is a beautiful color."}
]
```

#### Turn 2: Follow-up Message

**Frontend sends:**
```json
{
    "message": "What's my favorite color?",
    "conversation_history": [
        {"role": "user", "content": "My favorite color is blue"},
        {"role": "assistant", "content": "That's great! Blue is a beautiful color."}
    ]
}
```

**Backend builds:**
```python
messages = [
    {"role": "system", "content": "You are helpful..."},
    {"role": "user", "content": "My favorite color is blue"},
    {"role": "assistant", "content": "That's great! Blue is a beautiful color."},
    {"role": "user", "content": "What's my favorite color?"}
]
```

**Groq responds:**
```
"Your favorite color is blue!"
```

✅ **The AI remembered because we sent the history!**

---

## 🚀 Advanced Features

### 1. Streaming Responses

For real-time typing effect:

**Backend:**
```python
from flask import Response, stream_with_context

@app.route('/api/chat/stream', methods=['POST'])
def api_chat_stream():
    def generate():
        data = request.get_json()
        messages = build_messages(data)
        
        stream = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            stream=True  # Enable streaming
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {chunk.choices[0].delta.content}\n\n"
    
    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream'
    )
```

**Frontend:**
```javascript
const eventSource = new EventSource('/api/chat/stream');

eventSource.onmessage = (event) => {
    const text = event.data;
    appendToMessage(text);  // Add to last message
};
```

### 2. Different Models

```python
# Faster, smaller model
model="llama-3.1-8b-instant"  # ~500ms response

# Best quality
model="llama-3.3-70b-versatile"  # ~1.5s response

# Large context window
model="mixtral-8x7b-32768"  # 32k tokens context
```

### 3. Temperature Experimentation

```python
# Very focused (math, code)
temperature=0.0

# Balanced (general questions)
temperature=0.7

# Creative (stories, brainstorming)
temperature=1.5
```

---

## 🐛 Troubleshooting

### Problem 1: "API Key Not Found"

**Symptom:**
```
❌ WARNING: GROQ_API_KEY not found in .env file!
```

**Solution:**
```bash
# Check .env exists
ls -la .env

# Check content
cat .env
# Should show: GROQ_API_KEY=gsk_...

# Check format (no spaces!)
# ✅ GOOD: GROQ_API_KEY=gsk_abc123
# ❌ BAD:  GROQ_API_KEY = gsk_abc123
#         (spaces around =)

# Restart Flask after fixing
python app.py
```

### Problem 2: "401 Unauthorized"

**Symptom:**
```python
groq.APIError: Error code: 401 - Unauthorized
```

**Solutions:**
1. **Check key validity:**
   ```bash
   # Test key directly
   curl -H "Authorization: Bearer $GROQ_API_KEY" \
        https://api.groq.com/openai/v1/models
   ```

2. **Regenerate key:**
   - Go to [Groq Console](https://console.groq.com/keys)
   - Delete old key
   - Create new key
   - Update `.env`

### Problem 3: "Rate Limit Exceeded"

**Symptom:**
```python
groq.RateLimitError: Rate limit reached for requests
```

**Free Tier Limits:**
- **30 requests per minute**
- **14,400 requests per day**

**Solutions:**
1. **Add delay:**
   ```python
   import time
   time.sleep(2)  # Wait 2 seconds
   ```

2. **Check usage:**
   - [Groq Console](https://console.groq.com) → Usage tab

3. **Implement rate limiting:**
   ```python
   from flask_limiter import Limiter
   
   limiter = Limiter(app, key_func=lambda: request.remote_addr)
   
   @app.route('/api/chat', methods=['POST'])
   @limiter.limit("10 per minute")  # Limit per IP
   def api_chat():
       ...
   ```

### Problem 4: "No Response"

**Symptom:** Frontend says "Connection error"

**Debug steps:**
```bash
# 1. Check Flask is running
curl http://localhost:5000
# Should return HTML

# 2. Test API endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","conversation_history":[]}'
# Should return JSON

# 3. Check Flask logs
# Look for errors in terminal where Flask is running

# 4. Check browser console
# F12 → Console → Look for errors
```

### Problem 5: "Slow Responses"

**Symptom:** Takes 5+ seconds

**Solutions:**
1. **Use faster model:**
   ```python
   model="llama-3.1-8b-instant"  # Much faster
   ```

2. **Reduce max_tokens:**
   ```python
   max_tokens=256  # Shorter responses
   ```

3. **Check internet speed:**
   ```bash
   ping google.com
   # Should be <50ms
   ```

---

## ✨ Best Practices

### Security

✅ **DO:**
- Store API keys in `.env`
- Add `.env` to `.gitignore`
- Never commit secrets
- Rotate keys regularly
- Use environment variables

❌ **DON'T:**
- Hardcode API keys
- Share keys publicly
- Commit `.env` to GitHub
- Store keys in frontend JavaScript

### Performance

✅ **DO:**
- Limit conversation history (10 messages)
- Use appropriate `max_tokens`
- Cache common responses
- Implement rate limiting

❌ **DON'T:**
- Send entire conversation history
- Use unnecessarily high `max_tokens`
- Make unnecessary API calls

### User Experience

✅ **DO:**
- Show loading indicators
- Handle errors gracefully
- Provide clear error messages
- Auto-scroll to new messages
- Disable send button while processing

❌ **DON'T:**
- Leave users wondering if it's working
- Show technical error messages
- Allow double-sending
- Let UI freeze

---

## 📚 Teaching Resources

### For Students

**Exercises:**

1. **Beginner:**
   - Change system prompt
   - Try different models
   - Add message timestamps
   - Create "Clear Chat" button

2. **Intermediate:**
   - Implement character counter
   - Add "Copy" button to messages
   - Save chat to localStorage
   - Create different chat modes

3. **Advanced:**
   - Implement streaming responses
   - Add rate limiting
   - Create feedback system (👍/👎)
   - Build chat export feature

### For Teachers

**Demo Flow (50-minute class):**

1. **Introduction (10 min)**
   - What is Groq?
   - Why use AI APIs?
   - Show live demo

2. **Setup (10 min)**
   - Get API key (live)
   - Create `.env`
   - Run test script

3. **Backend (15 min)**
   - Explain `app.py`
   - Show API endpoint
   - Test with curl

4. **Frontend (10 min)**
   - Explain JavaScript
   - Show browser console
   - Trace network requests

5. **Q&A (5 min)**
   - Answer questions
   - Show troubleshooting

### Additional Resources

- 📖 [Groq Documentation](https://console.groq.com/docs)
- 🎥 [Video: Groq API Basics](https://youtube.com)
- 💬 [Groq Discord Community](https://discord.gg/groq)
- 📝 [More Examples](https://github.com/groq/groq-python/tree/main/examples)

---

## ✅ Summary

### What We Built

1. ✅ Flask backend with Groq API
2. ✅ REST API endpoint (`/api/chat`)
3. ✅ JavaScript frontend with fetch()
4. ✅ Conversation history for context
5. ✅ Error handling and validation
6. ✅ Loading states and UX feedback
7. ✅ Security with environment variables

### Key Takeaways

- 🔑 **API keys** must be secured in `.env`
- 📜 **Conversation history** provides context
- ⚡ **Groq is fast** thanks to LPU hardware
- 🎯 **System prompts** define AI behavior
- 🛡️ **Error handling** prevents crashes
- 📊 **Logging** helps debugging
- 🔄 **Async/await** for clean async code

### Next Steps

- Experiment with different models
- Try streaming responses
- Implement advanced features
- Build your own AI app!

---

**Documentation Version:** 2.0  
**Last Updated:** March 9, 2026  
**Author:** DANI  
**Course:** Flask AI Workshop

---

*Happy Learning! 🚀🤖*