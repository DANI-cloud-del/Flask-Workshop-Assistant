# 🚀 Groq AI Integration Guide - Flask Workshop Assistant

**Complete guide to integrating Groq's ultra-fast LLM API into your Flask application**

---

## 📋 Table of Contents

1. [What is Groq?](#what-is-groq)
2. [Getting Started](#getting-started)
3. [Installation](#installation)
4. [Getting Your API Key](#getting-your-api-key)
5. [Setting Up Environment Variables](#setting-up-environment-variables)
6. [Testing Groq (Standalone)](#testing-groq-standalone)
7. [Flask Integration Options](#flask-integration-options)
8. [Full Implementation](#full-implementation)
9. [Testing Your Integration](#testing-your-integration)
10. [Troubleshooting](#troubleshooting)
11. [Advanced Features](#advanced-features)

---

## 🤖 What is Groq?

**Groq** is a hardware and software company that provides ultra-fast AI inference using specialized LPU (Language Processing Unit) chips.

### **Why Groq?**

| Feature | Groq | Traditional Cloud |
|---------|------|------------------|
| **Speed** | ⚡ 10x faster | Standard |
| **Latency** | < 100ms | 1-3 seconds |
| **Cost** | 🆓 Free tier | Often paid |
| **Models** | Llama, Mixtral, Gemma | Various |

### **Use Cases:**
- ✅ Real-time chatbots
- ✅ AI assistants
- ✅ Content generation
- ✅ Code completion
- ✅ Question answering

---

## 🎯 Getting Started

### **Prerequisites**

Before starting, make sure you have:

```bash
✅ Python 3.8 or higher installed
✅ pip (Python package manager)
✅ A text editor (VS Code recommended)
✅ Internet connection
✅ A Groq account (free)
```

### **Check Your Python Version**

```bash
# Check Python version
python --version
# or
python3 --version

# Should show: Python 3.8.x or higher
```

---

## 📦 Installation

### **Step 1: Create Virtual Environment (Recommended)**

```bash
# Navigate to your project folder
cd Flask-Workshop-Assistant

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

# You should see (venv) in your terminal prompt
```

### **Step 2: Install Required Packages**

```bash
# Install Groq SDK
pip install groq

# Install python-dotenv (for environment variables)
pip install python-dotenv

# Optional: Install requests (if not already installed)
pip install requests

# Save all dependencies
pip freeze > requirements.txt
```

### **Verify Installation**

```bash
# Check if groq is installed
pip show groq

# Should show:
# Name: groq
# Version: x.x.x
# Summary: The official Python library for the Groq API
```

---

## 🔑 Getting Your API Key

### **Step 1: Create Groq Account**

1. Visit: **https://console.groq.com/**
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with:
   - Google account (recommended)
   - GitHub account
   - Email address

### **Step 2: Access API Keys**

1. After logging in, go to: **https://console.groq.com/keys**
2. Click **"Create API Key"**
3. Give it a name: `flask-workshop-app`
4. Click **"Create"**
5. **Copy the key immediately** (starts with `gsk_...`)

⚠️ **IMPORTANT**: 
- Save your API key somewhere safe
- You can only see it once
- Never share it publicly
- Never commit it to GitHub

### **Step 3: Test API Key (Quick Check)**

```bash
# Set temporary environment variable (Mac/Linux)
export GROQ_API_KEY="gsk_your_key_here"

# Set temporary environment variable (Windows)
set GROQ_API_KEY=gsk_your_key_here
```

---

## 🔐 Setting Up Environment Variables

### **Why Use `.env` Files?**

✅ **Security**: Keep secrets out of code  
✅ **Flexibility**: Easy to change without editing code  
✅ **Best Practice**: Industry standard  
✅ **GitHub Safe**: Won't be committed if in `.gitignore`

### **Step 1: Create `.env` File**

Create a file named `.env` in your project root:

```bash
# Navigate to project root
cd Flask-Workshop-Assistant

# Create .env file
# Windows:
type nul > .env

# Mac/Linux:
touch .env
```

### **Step 2: Add Your API Key**

Open `.env` in your text editor and add:

```env
# Groq API Configuration
GROQ_API_KEY=gsk_your_actual_api_key_here

# Flask Configuration
SECRET_KEY=your-secret-key-change-this-in-production
FLASK_ENV=development

# Optional: Other API keys
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Replace `gsk_your_actual_api_key_here` with your real API key!**

### **Step 3: Add `.env` to `.gitignore`**

**CRITICAL STEP**: Prevent committing secrets to GitHub

```bash
# Create/edit .gitignore
echo ".env" >> .gitignore

# Also add:
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
```

Your `.gitignore` should look like:

```
# Python
venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite
```

---

## 🧪 Testing Groq (Standalone)

### **Test File 1: Simple Test**

Create `test_groq_simple.py`:

```python
"""
Simple Groq API Test
Tests basic connection and response
"""

from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get API key
api_key = os.getenv('GROQ_API_KEY')

# Check if API key exists
if not api_key:
    print("❌ ERROR: GROQ_API_KEY not found in .env file")
    exit(1)

print("✅ API key loaded successfully")
print(f"Key starts with: {api_key[:10]}...")

# Initialize Groq client
client = Groq(api_key=api_key)

print("\n🤖 Sending test message to Groq...")

# Send a simple message
try:
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Say 'Hello from Groq!' if you can read this."
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    
    # Extract response
    response = chat_completion.choices[0].message.content
    
    print("\n✅ SUCCESS! Groq responded:")
    print(f"📝 Response: {response}")
    print(f"🤖 Model: {chat_completion.model}")
    print(f"⏱️  Usage: {chat_completion.usage.total_tokens} tokens")

except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print("\nTroubleshooting:")
    print("1. Check your API key is correct")
    print("2. Check your internet connection")
    print("3. Visit https://console.groq.com/ to verify account")
```

**Run the test:**

```bash
python test_groq_simple.py
```

**Expected Output:**

```
✅ API key loaded successfully
Key starts with: gsk_abc123...

🤖 Sending test message to Groq...

✅ SUCCESS! Groq responded:
📝 Response: Hello from Groq!
🤖 Model: llama-3.3-70b-versatile
⏱️  Usage: 15 tokens
```

---

### **Test File 2: Interactive Chat Test**

Create `test_groq_chat.py`:

```python
"""
Interactive Groq Chat Test
Allows you to have a conversation with the AI
"""

from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# System prompt
SYSTEM_PROMPT = """You are a helpful AI assistant. 
Be friendly, concise, and informative."""

# Conversation history
conversation_history = []

print("=" * 60)
print("🤖 Groq Interactive Chat Test")
print("=" * 60)
print("Type your messages below. Type 'quit' to exit.\n")

while True:
    # Get user input
    user_input = input("You: ").strip()
    
    # Check for exit
    if user_input.lower() in ['quit', 'exit', 'bye']:
        print("\n👋 Goodbye!")
        break
    
    if not user_input:
        continue
    
    # Add user message to history
    conversation_history.append({
        "role": "user",
        "content": user_input
    })
    
    try:
        # Build messages
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(conversation_history)
        
        # Call Groq API
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1024
        )
        
        # Get AI response
        ai_response = chat_completion.choices[0].message.content
        
        # Add to history
        conversation_history.append({
            "role": "assistant",
            "content": ai_response
        })
        
        # Print response
        print(f"\n🤖 AI: {ai_response}\n")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}\n")

print("\n📊 Conversation Stats:")
print(f"Total messages: {len(conversation_history)}")
print(f"Your messages: {len([m for m in conversation_history if m['role'] == 'user'])}")
print(f"AI messages: {len([m for m in conversation_history if m['role'] == 'assistant'])}")
```

**Run the interactive test:**

```bash
python test_groq_chat.py
```

**Example interaction:**

```
============================================================
🤖 Groq Interactive Chat Test
============================================================
Type your messages below. Type 'quit' to exit.

You: Hello! What can you do?

🤖 AI: Hello! I'm an AI assistant powered by Groq. I can help you with:
- Answering questions
- Writing and explaining code
- Providing information on various topics
- Having natural conversations
What would you like to know?

You: Tell me a joke

🤖 AI: Why don't programmers like nature?
It has too many bugs! 😄

You: quit

👋 Goodbye!

📊 Conversation Stats:
Total messages: 4
Your messages: 2
AI messages: 2
```

---

### **Test File 3: Model Comparison Test**

Create `test_groq_models.py`:

```python
"""
Groq Models Comparison Test
Tests different Groq models and compares responses
"""

from groq import Groq
from dotenv import load_dotenv
import os
import time

load_dotenv()
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Models to test
MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768"
]

# Test question
TEST_QUESTION = "Explain what Flask is in one sentence."

print("=" * 70)
print("🔬 Testing Different Groq Models")
print("=" * 70)
print(f"\nQuestion: {TEST_QUESTION}\n")

for model in MODELS:
    print(f"\n{'='*70}")
    print(f"🤖 Model: {model}")
    print('='*70)
    
    try:
        start_time = time.time()
        
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": TEST_QUESTION}
            ],
            model=model,
            max_tokens=100
        )
        
        end_time = time.time()
        response_time = (end_time - start_time) * 1000  # Convert to ms
        
        response = chat_completion.choices[0].message.content
        tokens = chat_completion.usage.total_tokens
        
        print(f"\n📝 Response: {response}")
        print(f"\n⏱️  Response Time: {response_time:.0f}ms")
        print(f"🎯 Tokens Used: {tokens}")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")

print(f"\n{'='*70}")
print("✅ Test Complete!")
print('='*70)
```

**Run the model comparison:**

```bash
python test_groq_models.py
```

---

## 🔌 Flask Integration Options

You have **3 main approaches** to integrate Groq with Flask:

### **Option 1: Direct Integration (Simplest)**

**Best for:** Quick prototypes, simple apps

```python
from flask import Flask, request, jsonify
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message')
    
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": message}],
        model="llama-3.3-70b-versatile"
    )
    
    return jsonify({
        'response': response.choices[0].message.content
    })
```

**Pros:** ✅ Simple, ✅ Few lines of code  
**Cons:** ❌ No conversation history, ❌ Limited error handling

---

### **Option 2: With Conversation History (Recommended)**

**Best for:** Chatbots, assistants that need context

```python
from flask import Flask, request, jsonify, session
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

SYSTEM_PROMPT = "You are a helpful AI assistant."

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')
    
    # Get or create conversation history
    if 'conversation' not in session:
        session['conversation'] = []
    
    # Add user message
    session['conversation'].append({
        "role": "user",
        "content": user_message
    })
    
    # Build messages with history
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(session['conversation'][-10:])  # Last 10 messages
    
    # Get AI response
    response = client.chat.completions.create(
        messages=messages,
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=1024
    )
    
    ai_response = response.choices[0].message.content
    
    # Add AI response to history
    session['conversation'].append({
        "role": "assistant",
        "content": ai_response
    })
    
    session.modified = True
    
    return jsonify({
        'success': True,
        'response': ai_response
    })
```

**Pros:** ✅ Maintains context, ✅ Natural conversations  
**Cons:** ⚠️ Uses session storage (limited size)

---

### **Option 3: With Database Storage (Production)**

**Best for:** Multi-user apps, persistent history

```python
from flask import Flask, request, jsonify, session
from groq import Groq
from dotenv import load_dotenv
import os
import json
from datetime import datetime

load_dotenv()
app = Flask(__name__)
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Simplified - use SQLAlchemy/MongoDB in production
CONVERSATIONS = {}  # {user_id: [messages]}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_id = session.get('user_id', 'guest')
    user_message = data.get('message')
    
    # Get conversation history
    if user_id not in CONVERSATIONS:
        CONVERSATIONS[user_id] = []
    
    conversation = CONVERSATIONS[user_id]
    
    # Add user message
    conversation.append({
        "role": "user",
        "content": user_message,
        "timestamp": datetime.now().isoformat()
    })
    
    # Prepare messages for Groq
    groq_messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]
    
    # Add last 10 conversation messages
    for msg in conversation[-10:]:
        groq_messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    
    # Get AI response
    response = client.chat.completions.create(
        messages=groq_messages,
        model="llama-3.3-70b-versatile"
    )
    
    ai_response = response.choices[0].message.content
    
    # Store AI response
    conversation.append({
        "role": "assistant",
        "content": ai_response,
        "timestamp": datetime.now().isoformat()
    })
    
    # Keep only last 50 messages
    if len(conversation) > 50:
        conversation = conversation[-50:]
        CONVERSATIONS[user_id] = conversation
    
    return jsonify({
        'success': True,
        'response': ai_response,
        'conversation_length': len(conversation)
    })

@app.route('/api/chat/history', methods=['GET'])
def get_history():
    user_id = session.get('user_id', 'guest')
    return jsonify({
        'history': CONVERSATIONS.get(user_id, [])
    })

@app.route('/api/chat/clear', methods=['POST'])
def clear_history():
    user_id = session.get('user_id', 'guest')
    CONVERSATIONS[user_id] = []
    return jsonify({'success': True})
```

**Pros:** ✅ Persistent, ✅ Multi-user, ✅ Scalable  
**Cons:** ⚠️ More complex, ⚠️ Needs database setup

---

## 📝 Full Implementation

### **Complete `app.py` (Option 2 - Recommended)**

```python
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'change-this-secret-key')

# Initialize Groq client
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# System prompt
SYSTEM_PROMPT = """You are a helpful AI assistant for Flask Workshop Assistant.
You help users with their questions in a friendly and informative way.
Keep responses concise but complete."""

# ==========================================
# ROUTES
# ==========================================

@app.route('/')
def home():
    """Redirect to chat page"""
    return redirect(url_for('chat'))

@app.route('/chat')
def chat():
    """Main chat interface"""
    user = session.get("user", None)
    return render_template('chat.html', user=user)

@app.route('/settings')
def settings():
    """Settings page"""
    return render_template('settings.html')

# ==========================================
# API ENDPOINTS
# ==========================================

@app.route('/api/chat', methods=['POST'])
def api_chat():
    """
    Handle chat messages from frontend
    
    Request JSON:
    {
        "message": "User's message",
        "conversation_history": [...] (optional)
    }
    
    Response JSON:
    {
        "success": true,
        "response": "AI's response",
        "model": "model_name"
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': 'No message provided'
            }), 400
        
        user_message = data['message']
        
        # Get conversation history from request or session
        if 'conversation_history' in data:
            conversation_history = data['conversation_history']
        else:
            # Use session storage
            if 'conversation' not in session:
                session['conversation'] = []
            conversation_history = session['conversation']
        
        # Build messages for Groq
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        
        # Add conversation history (last 10 messages for context)
        messages.extend(conversation_history[-10:])
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        # Call Groq API
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
            stream=False
        )
        
        # Extract AI response
        ai_response = chat_completion.choices[0].message.content
        
        # Update conversation history in session
        if 'conversation_history' not in data:
            session['conversation'].append({
                "role": "user",
                "content": user_message
            })
            session['conversation'].append({
                "role": "assistant",
                "content": ai_response
            })
            session.modified = True
        
        # Return response
        return jsonify({
            'success': True,
            'response': ai_response,
            'model': 'llama-3.3-70b-versatile'
        })
    
    except Exception as e:
        print(f"Error in chat API: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred processing your request'
        }), 500

@app.route('/api/chat/clear', methods=['POST'])
def clear_chat():
    """Clear conversation history"""
    session['conversation'] = []
    return jsonify({'success': True})

# ==========================================
# ERROR HANDLERS
# ==========================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ==========================================
# RUN APP
# ==========================================

if __name__ == '__main__':
    # Check if API key is set
    if not os.getenv('GROQ_API_KEY'):
        print("⚠️  WARNING: GROQ_API_KEY not found in environment variables")
        print("Please add it to your .env file")
    
    app.run(debug=True, port=5000)
```

---

## 🧪 Testing Your Integration

### **Test 1: Manual Testing**

```bash
# Run your Flask app
python app.py

# Should see:
# * Running on http://127.0.0.1:5000

# Open browser: http://localhost:5000
# Type a message in the AI search bar
# Press Enter
# You should get an AI response!
```

---

### **Test 2: API Testing with cURL**

```bash
# Test the chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'

# Should return:
# {
#   "success": true,
#   "response": "Hello! I'm doing well, thank you for asking...",
#   "model": "llama-3.3-70b-versatile"
# }
```

---

### **Test 3: Python Test Script**

Create `test_flask_api.py`:

```python
"""
Test Flask API Integration
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_chat():
    """Test chat endpoint"""
    print("Testing /api/chat endpoint...")
    
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json={"message": "What is 2+2?"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    assert response.json()['success'] == True
    print("✅ Chat endpoint test passed!")

def test_conversation():
    """Test conversation flow"""
    print("\nTesting conversation flow...")
    
    # First message
    response1 = requests.post(
        f"{BASE_URL}/api/chat",
        json={"message": "My name is John"}
    )
    
    print(f"Response 1: {response1.json()['response']}")
    
    # Second message (should remember context)
    response2 = requests.post(
        f"{BASE_URL}/api/chat",
        json={"message": "What is my name?"}
    )
    
    print(f"Response 2: {response2.json()['response']}")
    
    # Check if AI remembers
    if "john" in response2.json()['response'].lower():
        print("✅ Conversation context test passed!")
    else:
        print("⚠️  AI didn't remember the name")

if __name__ == "__main__":
    print("=" * 60)
    print("Flask API Integration Tests")
    print("=" * 60)
    print("\n⚠️  Make sure Flask app is running on http://localhost:5000\n")
    
    try:
        test_chat()
        test_conversation()
        print("\n" + "=" * 60)
        print("✅ All tests passed!")
        print("=" * 60)
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
```

**Run the test:**

```bash
# Terminal 1: Run Flask app
python app.py

# Terminal 2: Run test
python test_flask_api.py
```

---

## 🐛 Troubleshooting

### **Issue 1: "Module 'groq' not found"**

```bash
# Solution: Install groq
pip install groq

# Verify installation
pip show groq

# If still not working, check virtual environment is activated
# You should see (venv) in your terminal
```

---

### **Issue 2: "API key not found"**

```python
# Check 1: .env file exists
# Run in terminal:
ls -la .env  # Mac/Linux
dir .env     # Windows

# Check 2: load_dotenv() is called
# Make sure this is at the top of app.py:
from dotenv import load_dotenv
load_dotenv()

# Check 3: Print API key (for debugging only!)
import os
print(f"API Key: {os.getenv('GROQ_API_KEY')}")
# Remove this line after debugging!
```

---

### **Issue 3: "Rate limit exceeded"**

```
Error: Rate limit reached for requests

Groq Free Tier Limits:
- 30 requests per minute
- 14,400 requests per day
- 7,000 tokens per minute
```

**Solutions:**
```python
# Add rate limiting to your Flask app
from flask_limiter import Limiter

limiter = Limiter(
    app,
    default_limits=["20 per minute"]
)

@app.route('/api/chat', methods=['POST'])
@limiter.limit("10 per minute")
def api_chat():
    ...
```

---

### **Issue 4: "Connection timeout"**

```python
# Add timeout to Groq client
chat_completion = groq_client.chat.completions.create(
    messages=messages,
    model="llama-3.3-70b-versatile",
    timeout=30  # 30 seconds timeout
)
```

---

### **Issue 5: "Invalid JSON response"**

```python
# Add error handling
try:
    data = request.get_json()
except Exception as e:
    return jsonify({
        'success': False,
        'error': 'Invalid JSON format'
    }), 400
```

---

## 🚀 Advanced Features

### **Feature 1: Streaming Responses**

Real-time typing effect (like ChatGPT):

```python
@app.route('/api/chat/stream', methods=['POST'])
def chat_stream():
    """Stream AI responses in real-time"""
    data = request.get_json()
    user_message = data['message']
    
    def generate():
        stream = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            stream=True  # Enable streaming
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content:
                # Send each chunk to frontend
                yield f"data: {chunk.choices[0].delta.content}\n\n"
        
        yield "data: [DONE]\n\n"
    
    return app.response_class(
        generate(),
        mimetype='text/event-stream'
    )
```

**Frontend JavaScript:**

```javascript
async function sendMessageStreaming(message) {
    const eventSource = new EventSource('/api/chat/stream?' + new URLSearchParams({
        message: message
    }));
    
    let fullResponse = '';
    
    eventSource.onmessage = function(event) {
        if (event.data === '[DONE]') {
            eventSource.close();
            return;
        }
        
        fullResponse += event.data;
        displayMessage(fullResponse, 'ai', true); // Update display
    };
    
    eventSource.onerror = function() {
        eventSource.close();
        console.error('Streaming error');
    };
}
```

---

### **Feature 2: Custom System Prompts**

Different personalities for different use cases:

```python
PROMPTS = {
    'assistant': """You are a helpful AI assistant. 
    Be friendly and informative.""",
    
    'teacher': """You are an experienced programming teacher.
    Explain concepts clearly with examples.
    Encourage students and be patient.""",
    
    'comedian': """You are a funny AI comedian.
    Make jokes and keep responses entertaining.
    But still be helpful!""",
    
    'professional': """You are a professional consultant.
    Be formal, precise, and business-oriented."""
}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    prompt_type = data.get('prompt_type', 'assistant')
    
    system_prompt = PROMPTS.get(prompt_type, PROMPTS['assistant'])
    
    # Use system_prompt in messages...
```

---

### **Feature 3: Model Selection**

Let users choose their preferred model:

```python
AVAILABLE_MODELS = {
    'fast': 'llama-3.1-8b-instant',
    'balanced': 'llama-3.3-70b-versatile',
    'smart': 'mixtral-8x7b-32768'
}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    model_preference = data.get('model', 'balanced')
    
    model = AVAILABLE_MODELS.get(model_preference, 'llama-3.3-70b-versatile')
    
    chat_completion = groq_client.chat.completions.create(
        messages=messages,
        model=model,  # Use selected model
        ...
    )
```

---

### **Feature 4: Token Usage Tracking**

Monitor API usage:

```python
@app.route('/api/chat', methods=['POST'])
def chat():
    # ... existing code ...
    
    # Track token usage
    usage = chat_completion.usage
    
    return jsonify({
        'success': True,
        'response': ai_response,
        'usage': {
            'prompt_tokens': usage.prompt_tokens,
            'completion_tokens': usage.completion_tokens,
            'total_tokens': usage.total_tokens
        }
    })
```

---

## 📚 Additional Resources

### **Official Documentation**
- **Groq Docs**: https://console.groq.com/docs
- **Groq Python SDK**: https://github.com/groq/groq-python
- **API Reference**: https://console.groq.com/docs/api-reference

### **Community**
- **Groq Discord**: Community support and discussions
- **GitHub Issues**: Report bugs or request features

### **Learning Resources**
- **Flask Tutorial**: https://flask.palletsprojects.com/tutorial/
- **Python Requests**: https://requests.readthedocs.io/

---

## 🎓 Workshop Exercises

### **Exercise 1: Basic Integration**
✅ Set up Groq API key  
✅ Create test file  
✅ Get first response  

### **Exercise 2: Flask Integration**
✅ Add `/api/chat` endpoint  
✅ Test with cURL  
✅ Connect to frontend  

### **Exercise 3: Conversation History**
✅ Store messages in session  
✅ Maintain context  
✅ Test multi-turn conversations  

### **Exercise 4: Advanced Features**
✅ Add streaming responses  
✅ Implement model selection  
✅ Track token usage  

---

## ✅ Checklist

Before moving to production:

- [ ] API key stored in `.env`
- [ ] `.env` added to `.gitignore`
- [ ] Error handling implemented
- [ ] Rate limiting added
- [ ] Input validation
- [ ] Logging configured
- [ ] Tests written
- [ ] Documentation updated

---

## 🎉 Conclusion

You now have a complete guide to integrating Groq AI into your Flask application!

**What you learned:**
✅ How to get and secure API keys  
✅ How to test Groq standalone  
✅ Three integration approaches  
✅ Full Flask implementation  
✅ Troubleshooting common issues  
✅ Advanced features  

**Next steps:**
- Customize system prompts for your use case
- Add user authentication
- Implement database storage
- Deploy to production

---

**Questions or issues?** Open an issue on GitHub or check the official Groq documentation!

**Happy coding!** 🚀
