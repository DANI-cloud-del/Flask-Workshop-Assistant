# 🤖 Groq API Integration Guide

**Complete guide for connecting Groq AI to your Flask application**

---

## 📋 Table of Contents

1. [What is Groq?](#what-is-groq)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Step-by-Step Integration](#step-by-step-integration)
5. [Testing the Connection](#testing-the-connection)
6. [Frontend Integration](#frontend-integration)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 What is Groq?

Groq is a **high-performance AI inference platform** that provides:
- ⚡ **Ultra-fast responses** (faster than most AI providers)
- 🆓 **Free tier** with generous limits
- 🧠 **Multiple LLM models** (Llama, Mixtral, Gemma)
- 🔌 **Simple API** compatible with OpenAI format

### Why Use Groq?

| Feature | Groq | OpenAI | Others |
|---------|------|--------|--------|
| Speed | ⚡⚡⚡ Very Fast | ⚡⚡ Fast | ⚡ Normal |
| Free Tier | ✅ 30 RPM | ❌ Paid Only | ✅ Limited |
| Latency | ~200ms | ~500ms | ~1000ms |
| Models | Llama 3.3, Mixtral | GPT-4, GPT-3.5 | Varies |

---

## 📦 Prerequisites

Before starting, make sure you have:

- ✅ Python 3.8+ installed
- ✅ Flask application setup
- ✅ Basic understanding of REST APIs
- ✅ Text editor (VS Code, PyCharm, etc.)

---

## 🚀 Getting Started

### Step 1: Get Your Groq API Key

1. **Visit Groq Console**: https://console.groq.com
2. **Sign up** (free account)
3. **Navigate to**: API Keys section
4. **Create new key**: Click "Create API Key"
5. **Copy the key**: Save it securely (shown only once!)

**Example Key Format:**
```
gsk_abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK
```

### Step 2: Install Required Packages

```bash
# Install Groq SDK
pip install groq

# Install other dependencies
pip install flask python-dotenv
```

**Check Installation:**
```bash
pip show groq
# Should show: Version: 0.4.1 or higher
```

### Step 3: Set Up Environment Variables

Create a `.env` file in your project root:

```bash
# .env
GROQ_API_KEY=gsk_your_actual_key_here
SECRET_KEY=your_flask_secret_key
```

⚠️ **Security Note:** Never commit `.env` file to Git!

Add to `.gitignore`:
```
.env
*.pyc
__pycache__/
```

---

## 🔨 Step-by-Step Integration

### Phase 1: Test API Connection (Standalone)

Before integrating with Flask, **test Groq API independently**.

#### Test Script 1: Basic Connection

Create `test_groq_basic.py`:

```python
"""
Test 1: Basic Groq API Connection
Verifies API key and basic functionality
"""

from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

print("="*50)
print("🧪 TEST 1: Basic Groq Connection")
print("="*50)

# Check if API key exists
api_key = os.getenv('GROQ_API_KEY')

if not api_key:
    print("❌ ERROR: GROQ_API_KEY not found in .env file")
    exit(1)

print(f"✅ API Key found: {api_key[:15]}...")

# Initialize Groq client
try:
    client = Groq(api_key=api_key)
    print("✅ Groq client initialized")
except Exception as e:
    print(f"❌ ERROR: {e}")
    exit(1)

# Test simple completion
print("\n📤 Sending test message...")

try:
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Say 'Hello from Groq!' in one sentence."
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=50
    )
    
    ai_response = response.choices[0].message.content
    
    print("\n✅ SUCCESS! Groq API is working!")
    print(f"\n🤖 AI Response: {ai_response}")
    print(f"\n📊 Model: {response.model}")
    print(f"📊 Tokens used: {response.usage.total_tokens}")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    exit(1)

print("\n" + "="*50)
print("✅ Test completed successfully!")
print("="*50)
```

**Run the test:**
```bash
python test_groq_basic.py
```

**Expected Output:**
```
==================================================
🧪 TEST 1: Basic Groq Connection
==================================================
✅ API Key found: gsk_abcdefghij...
✅ Groq client initialized

📤 Sending test message...

✅ SUCCESS! Groq API is working!

🤖 AI Response: Hello from Groq!

📊 Model: llama-3.3-70b-versatile
📊 Tokens used: 15

==================================================
✅ Test completed successfully!
==================================================
```

---

#### Test Script 2: Conversation History

Create `test_groq_conversation.py`:

```python
"""
Test 2: Groq with Conversation History
Tests multi-turn conversations with context
"""

from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

print("="*50)
print("🧪 TEST 2: Conversation History")
print("="*50)

client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Conversation history
conversation = [
    {
        "role": "system",
        "content": "You are a helpful assistant. Keep responses brief."
    }
]

def chat(user_message):
    """Send message and get response"""
    print(f"\n👤 User: {user_message}")
    
    # Add user message
    conversation.append({
        "role": "user",
        "content": user_message
    })
    
    # Get AI response
    response = client.chat.completions.create(
        messages=conversation,
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=100
    )
    
    ai_response = response.choices[0].message.content
    
    # Add AI response to history
    conversation.append({
        "role": "assistant",
        "content": ai_response
    })
    
    print(f"🤖 AI: {ai_response}")
    return ai_response

# Test conversation
print("\n📝 Starting conversation...")

chat("My name is Alice.")
chat("What's my name?")  # Should remember "Alice"
chat("Tell me a joke about programming.")

print("\n" + "="*50)
print(f"✅ Conversation length: {len(conversation)} messages")
print("✅ Context is maintained!")
print("="*50)
```

**Run the test:**
```bash
python test_groq_conversation.py
```

**Expected Output:**
```
==================================================
🧪 TEST 2: Conversation History
==================================================

📝 Starting conversation...

👤 User: My name is Alice.
🤖 AI: Nice to meet you, Alice!

👤 User: What's my name?
🤖 AI: Your name is Alice!

👤 User: Tell me a joke about programming.
🤖 AI: Why do programmers prefer dark mode? Because light attracts bugs!

==================================================
✅ Conversation length: 7 messages
✅ Context is maintained!
==================================================
```

---

#### Test Script 3: Different Models

Create `test_groq_models.py`:

```python
"""
Test 3: Compare Different Groq Models
Tests various models available on Groq
"""

from groq import Groq
from dotenv import load_dotenv
import os
import time

load_dotenv()

print("="*50)
print("🧪 TEST 3: Model Comparison")
print("="*50)

client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Available models
models = [
    "llama-3.3-70b-versatile",     # Best overall (recommended)
    "llama-3.1-70b-versatile",     # Previous version
    "mixtral-8x7b-32768",          # Good for long context
    "gemma2-9b-it",                # Lightweight, fast
]

test_prompt = "Explain Flask in one sentence."

print(f"\n📤 Testing prompt: '{test_prompt}'\n")

for model in models:
    print(f"\n{'='*50}")
    print(f"🤖 Model: {model}")
    print(f"{'='*50}")
    
    try:
        start_time = time.time()
        
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": test_prompt}],
            model=model,
            temperature=0.7,
            max_tokens=100
        )
        
        elapsed = time.time() - start_time
        
        print(f"\n⏱️  Response time: {elapsed:.2f}s")
        print(f"📝 Response: {response.choices[0].message.content}")
        print(f"🎫 Tokens: {response.usage.total_tokens}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

print("\n" + "="*50)
print("✅ Model comparison complete!")
print("💡 Recommended: llama-3.3-70b-versatile")
print("="*50)
```

**Run the test:**
```bash
python test_groq_models.py
```

---

### Phase 2: Integrate with Flask Backend

Now integrate Groq into your Flask app.

#### Step 1: Update `app.py`

```python
from flask import Flask, jsonify, request, render_template
from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY') or os.urandom(24)

# Initialize Groq client
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# System prompt (defines AI personality)
SYSTEM_PROMPT = """You are a helpful AI assistant for Flask Workshop.
You help users with Python, Flask, and web development questions.
Keep responses concise (2-3 sentences for simple questions).
Be friendly and encouraging."""

@app.route('/')
def home():
    return render_template('chat.html')

@app.route('/api/chat', methods=['POST'])
def api_chat():
    """
    Handle chat messages from frontend
    
    Request JSON:
    {
        "message": "user message",
        "conversation_history": []
    }
    
    Response JSON:
    {
        "success": true,
        "response": "AI response",
        "model": "model name"
    }
    """
    try:
        # Get data from request
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': 'No message provided'
            }), 400
        
        user_message = data['message']
        conversation_history = data.get('conversation_history', [])
        
        print(f"\n💬 User: {user_message}")
        
        # Build messages array
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
        
        print("🤖 Calling Groq API...")
        
        # Call Groq API
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,        # Creativity (0-2)
            max_tokens=1024,        # Max response length
            top_p=1,                # Nucleus sampling
            stream=False            # Get full response at once
        )
        
        # Extract AI response
        ai_response = chat_completion.choices[0].message.content
        
        print(f"✅ AI: {ai_response[:100]}...")
        
        return jsonify({
            'success': True,
            'response': ai_response,
            'model': 'llama-3.3-70b-versatile'
        })
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred. Please try again.'
        }), 500

if __name__ == '__main__':
    print("\n🚀 Flask App Starting...")
    
    # Verify Groq API key
    groq_key = os.getenv('GROQ_API_KEY')
    if groq_key:
        print(f"✅ Groq API Key loaded: {groq_key[:15]}...")
    else:
        print("❌ WARNING: GROQ_API_KEY not found!")
    
    print("\n🌐 Visit: http://localhost:5000\n")
    
    app.run(debug=True, port=5000)
```

#### Step 2: Test Backend Endpoint

Create `test_flask_api.py`:

```python
"""
Test 4: Flask API Endpoint
Tests the /api/chat endpoint
"""

import requests
import json

print("="*50)
print("🧪 TEST 4: Flask API Endpoint")
print("="*50)

# API endpoint
url = "http://localhost:5000/api/chat"

# Test data
test_messages = [
    "Hello!",
    "What is Flask?",
    "Tell me about Python."
]

print("\n⚠️  Make sure Flask app is running first!")
print("   Run: python app.py\n")

input("Press Enter when Flask is running...")

for message in test_messages:
    print(f"\n{'='*50}")
    print(f"👤 Sending: {message}")
    print(f"{'='*50}")
    
    # Prepare request
    payload = {
        "message": message,
        "conversation_history": []
    }
    
    try:
        # Send POST request
        response = requests.post(
            url,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        # Parse response
        if response.status_code == 200:
            data = response.json()
            
            if data['success']:
                print(f"\n✅ Status: {response.status_code}")
                print(f"🤖 AI Response: {data['response']}")
                print(f"📊 Model: {data['model']}")
            else:
                print(f"\n❌ API Error: {data.get('error')}")
        else:
            print(f"\n❌ HTTP Error: {response.status_code}")
            print(f"Response: {response.text}")
    
    except requests.exceptions.ConnectionError:
        print("\n❌ Connection Error: Flask app not running!")
        print("   Start Flask with: python app.py")
        break
    except Exception as e:
        print(f"\n❌ Error: {e}")

print("\n" + "="*50)
print("✅ API test complete!")
print("="*50)
```

**Run the test:**
```bash
# Terminal 1: Start Flask
python app.py

# Terminal 2: Test API
python test_flask_api.py
```

---

## 🎨 Frontend Integration

### Step 1: Create Chat Interface (JavaScript)

In `static/js/ai_assistant.js`:

```javascript
// Send message to Flask backend
async function sendMessage() {
    const input = document.getElementById('aiSearchInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    console.log('📤 Sending:', message);
    
    try {
        // Call Flask API
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
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ AI Response:', data.response);
            
            // Update conversation history
            conversationHistory.push(
                { role: "user", content: message },
                { role: "assistant", content: data.response }
            );
            
            // Display response
            displayMessage(data.response, 'ai');
        } else {
            console.error('❌ Error:', data.error);
            displayMessage('Sorry, an error occurred.', 'ai');
        }
        
    } catch (error) {
        console.error('❌ Network error:', error);
        displayMessage('Connection error. Please try again.', 'ai');
    }
}
```

### Step 2: Test Frontend

1. **Open browser**: `http://localhost:5000`
2. **Open Console**: F12 → Console tab
3. **Send message**: Type in chat and send
4. **Check logs**:
   - `📤 Sending: your message`
   - `✅ AI Response: response text`

---

## 🔧 Advanced Features

### 1. Streaming Responses (Real-time)

```python
@app.route('/api/chat/stream', methods=['POST'])
def api_chat_stream():
    """Stream AI responses in real-time"""
    
    def generate():
        data = request.get_json()
        messages = build_messages(data)
        
        # Stream response
        stream = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1024,
            stream=True  # Enable streaming
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    
    return Response(generate(), mimetype='text/plain')
```

### 2. Custom Parameters

```python
# Temperature: Controls creativity
temperature=0.0   # Focused, deterministic
temperature=1.0   # Balanced (default)
temperature=2.0   # Very creative

# Max tokens: Response length
max_tokens=50     # Very short
max_tokens=500    # Medium
max_tokens=2000   # Long

# Top P: Nucleus sampling
top_p=0.5         # Conservative
top_p=1.0         # Balanced (default)
```

### 3. Error Handling

```python
from groq import RateLimitError, APIError

try:
    response = groq_client.chat.completions.create(...)
except RateLimitError:
    return jsonify({'error': 'Rate limit exceeded. Wait a moment.'}), 429
except APIError as e:
    return jsonify({'error': f'API error: {str(e)}'}), 500
except Exception as e:
    return jsonify({'error': 'Unexpected error'}), 500
```

---

## 🐛 Troubleshooting

### Problem: "Invalid API Key"

✅ **Solution:**
```bash
# Check .env file
cat .env
# Should show: GROQ_API_KEY=gsk_...

# Verify in Python
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print(os.getenv('GROQ_API_KEY'))"
```

### Problem: "Connection timeout"

✅ **Solution:**
```python
# Add timeout
response = groq_client.chat.completions.create(
    messages=messages,
    model="llama-3.3-70b-versatile",
    timeout=30  # 30 seconds
)
```

### Problem: "Rate limit exceeded"

✅ **Solution:**
- Free tier: 30 requests per minute
- Add delay between requests
- Implement request queuing

```python
import time

time.sleep(2)  # Wait 2 seconds between requests
```

### Problem: "Empty response"

✅ **Solution:**
```python
# Check response
if not response.choices or not response.choices[0].message.content:
    return jsonify({'error': 'Empty response from AI'}), 500
```

---

## 📊 Best Practices

### 1. Security
- ✅ Never expose API key in frontend
- ✅ Use environment variables
- ✅ Add `.env` to `.gitignore`
- ✅ Rotate keys periodically

### 2. Performance
- ✅ Limit conversation history (last 10 messages)
- ✅ Use appropriate `max_tokens`
- ✅ Cache common responses
- ✅ Implement rate limiting

### 3. User Experience
- ✅ Show loading indicators
- ✅ Handle errors gracefully
- ✅ Provide clear error messages
- ✅ Add retry logic

### 4. Costs
- ✅ Monitor usage in Groq console
- ✅ Set token limits
- ✅ Optimize prompts
- ✅ Use shorter system prompts

---

## 🎓 Teaching Tips

### Demo Flow for Class:

1. **Show Groq Console** (5 min)
   - Sign up process
   - API key generation
   - Usage dashboard

2. **Run Test Scripts** (10 min)
   - `test_groq_basic.py` - Connection
   - `test_groq_conversation.py` - Context
   - `test_groq_models.py` - Models

3. **Integrate Backend** (15 min)
   - Update `app.py`
   - Test with `test_flask_api.py`
   - Show Flask console logs

4. **Test Frontend** (10 min)
   - Open browser
   - Send messages
   - Show browser console
   - Demonstrate conversation memory

5. **Live Debugging** (10 min)
   - Remove API key → Show error
   - Fix and restart → Works again
   - Show rate limiting

---

## 📚 Additional Resources

- 🌐 **Groq Documentation**: https://console.groq.com/docs
- 📖 **API Reference**: https://console.groq.com/docs/api-reference
- 🎥 **Video Tutorials**: YouTube "Groq AI Tutorial"
- 💬 **Community**: Groq Discord

---

## ✅ Summary Checklist

- [ ] Groq account created
- [ ] API key generated and saved
- [ ] `.env` file configured
- [ ] Dependencies installed (`pip install groq`)
- [ ] Test scripts passing
- [ ] Flask backend working
- [ ] Frontend connected
- [ ] Error handling implemented
- [ ] Documentation understood

---

**Questions?** Check troubleshooting section or raise an issue!

**Happy coding! 🚀**