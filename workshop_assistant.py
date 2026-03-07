#!/usr/bin/env python3
"""
Flask Workshop AI Assistant
Runs on instructor's laptop, provides AI help to students via API
"""

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow requests from student apps on localhost:5000

GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# ============================================================================
# AI ASSISTANT ENDPOINTS
# ============================================================================

@app.route('/api/ask', methods=['POST'])
def ask_assistant():
    """Main AI assistant endpoint."""
    data = request.get_json()
    
    question = data.get('question', '')
    code_context = data.get('code', '')
    checkpoint = data.get('checkpoint', 1)
    
    if not question.strip():
        return jsonify({'error': 'Question required'}), 400
    
    # Build prompt with context
    prompt = f"""You are a friendly Flask workshop instructor helping a student at Checkpoint {checkpoint}.

Student's Question: {question}

{f"Student's Code:\n```python\n{code_context}\n```" if code_context else ""}

Provide a helpful, beginner-friendly answer:
1. Direct answer (2-3 sentences)
2. If it's an error, explain what caused it
3. Show exact code or commands to fix it
4. One example if helpful

Keep it simple and encouraging!"""

    try:
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {GROQ_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'llama-3.3-70b-versatile',
                'messages': [
                    {'role': 'system', 'content': 'You are a patient Flask instructor.'},
                    {'role': 'user', 'content': prompt}
                ],
                'temperature': 0.4,
                'max_tokens': 800
            },
            timeout=20
        )
        
        result = response.json()
        answer = result['choices'][0]['message']['content']
        
        return jsonify({
            'answer': answer,
            'success': True
        })
        
    except Exception as e:
        return jsonify({
            'answer': f'AI temporarily unavailable. Please ask instructor.\n\nError: {str(e)}',
            'success': False
        })

@app.route('/api/explain-code', methods=['POST'])
def explain_code():
    """Explain what a piece of code does."""
    data = request.get_json()
    code = data.get('code', '')
    
    if not code.strip():
        return jsonify({'error': 'Code required'}), 400
    
    prompt = f"""Explain this Flask code in simple terms for a beginner:

```python
{code}
```

Provide:
1. What this code does (2 sentences)
2. How it works (step by step)
3. Why it's useful

Use simple language, no jargon."""

    try:
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {GROQ_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'llama-3.3-70b-versatile',
                'messages': [
                    {'role': 'system', 'content': 'You are a code explainer for beginners.'},
                    {'role': 'user', 'content': prompt}
                ],
                'temperature': 0.3,
                'max_tokens': 600
            },
            timeout=15
        )
        
        result = response.json()
        explanation = result['choices'][0]['message']['content']
        
        return jsonify({'explanation': explanation})
        
    except Exception as e:
        return jsonify({'explanation': f'Unable to explain. Error: {str(e)}'})

@app.route('/api/suggest', methods=['POST'])
def suggest_next():
    """Suggest what student should do next."""
    data = request.get_json()
    checkpoint = data.get('checkpoint', 1)
    
    suggestions = {
        1: "Great! Now create app.py with a simple Flask route.",
        2: "Nice! Add Tailwind CSS to make your app beautiful.",
        3: "Awesome! Try adding more routes or interactive features.",
        4: "Amazing! You've completed the workshop. Try deploying your app!"
    }
    
    return jsonify({
        'suggestion': suggestions.get(checkpoint, 'Keep building!')
    })

@app.route('/widget.js')
def widget_script():
    """JavaScript widget to inject into student apps."""
    js_code = '''
(function() {
    'use strict';
    
    const ASSISTANT_API = 'http://localhost:5002';
    
    // Check if assistant is available
    fetch(`${ASSISTANT_API}/health`)
        .then(r => r.ok ? injectWidget() : showOfflineMessage())
        .catch(() => showOfflineMessage());
    
    function injectWidget() {
        // Create widget container
        const widget = document.createElement('div');
        widget.id = 'workshop-ai-assistant';
        widget.innerHTML = `
            <style>
                #workshop-ai-assistant {
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .ai-assistant-btn {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    font-size: 32px;
                    cursor: pointer;
                    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
                    transition: all 0.3s;
                    z-index: 9998;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ai-assistant-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 12px 24px rgba(102, 126, 234, 0.5);
                }
                .ai-chat-window {
                    position: fixed;
                    bottom: 100px;
                    right: 24px;
                    width: 400px;
                    height: 600px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    display: none;
                    flex-direction: column;
                    z-index: 9999;
                    overflow: hidden;
                }
                .ai-chat-window.open {
                    display: flex;
                }
                .ai-chat-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    font-weight: 600;
                    font-size: 18px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .ai-close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 28px;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                .ai-close-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                .ai-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    background: #f7fafc;
                }
                .ai-message {
                    margin-bottom: 16px;
                    padding: 12px 16px;
                    border-radius: 12px;
                    max-width: 90%;
                    word-wrap: break-word;
                    line-height: 1.5;
                }
                .ai-message.user {
                    background: #667eea;
                    color: white;
                    margin-left: auto;
                }
                .ai-message.assistant {
                    background: white;
                    color: #2d3748;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .ai-message.assistant code {
                    background: #f7fafc;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 14px;
                }
                .ai-input-area {
                    padding: 16px;
                    border-top: 1px solid #e2e8f0;
                    background: white;
                }
                .ai-input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #cbd5e0;
                    border-radius: 12px;
                    resize: none;
                    font-family: inherit;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                .ai-input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                .ai-send-btn {
                    width: 100%;
                    padding: 12px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .ai-send-btn:hover {
                    background: #5a67d8;
                }
                .ai-send-btn:disabled {
                    background: #cbd5e0;
                    cursor: not-allowed;
                }
                .ai-quick-actions {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 8px;
                    flex-wrap: wrap;
                }
                .ai-quick-btn {
                    padding: 8px 12px;
                    background: #edf2f7;
                    border: none;
                    border-radius: 8px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ai-quick-btn:hover {
                    background: #e2e8f0;
                    transform: translateY(-1px);
                }
                .ai-welcome {
                    background: linear-gradient(135deg, #e6fffa 0%, #bee3f8 100%);
                    padding: 16px;
                    border-radius: 12px;
                    margin-bottom: 16px;
                    border-left: 4px solid #38b2ac;
                }
                .ai-welcome h4 {
                    margin: 0 0 8px 0;
                    color: #234e52;
                }
                .ai-welcome ul {
                    margin: 8px 0 0 20px;
                    color: #234e52;
                }
            </style>
            
            <button class="ai-assistant-btn" onclick="toggleChat()">
                🤖
            </button>
            
            <div class="ai-chat-window" id="aiChatWindow">
                <div class="ai-chat-header">
                    <span>🤖 Workshop Assistant</span>
                    <button class="ai-close-btn" onclick="toggleChat()">×</button>
                </div>
                
                <div class="ai-messages" id="aiMessages">
                    <div class="ai-welcome">
                        <h4>👋 Hi! I'm your AI assistant</h4>
                        <p style="margin: 8px 0; font-size: 14px; color: #234e52;">I can help you with:</p>
                        <ul style="font-size: 13px;">
                            <li>Explaining Flask concepts</li>
                            <li>Debugging errors</li>
                            <li>Understanding your code</li>
                            <li>Suggesting next steps</li>
                        </ul>
                        <p style="margin: 8px 0 0 0; font-size: 13px; color: #234e52;">Just ask me anything!</p>
                    </div>
                </div>
                
                <div class="ai-input-area">
                    <div class="ai-quick-actions">
                        <button class="ai-quick-btn" onclick="quickAsk('How do I create a route?')">📍 Routes</button>
                        <button class="ai-quick-btn" onclick="quickAsk('Explain templates')">📄 Templates</button>
                        <button class="ai-quick-btn" onclick="quickAsk('What should I do next?')">💡 Next step</button>
                    </div>
                    <textarea id="aiInput" class="ai-input" placeholder="Ask me anything about Flask..." rows="2"></textarea>
                    <button class="ai-send-btn" onclick="sendMessage()" id="aiSendBtn">Send</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        // Handle Enter key
        document.getElementById('aiInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    function showOfflineMessage() {
        const badge = document.createElement('div');
        badge.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 12px 16px;
            background: #fed7d7;
            border: 2px solid #fc8181;
            border-radius: 12px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;
        badge.innerHTML = '🤖 AI Assistant offline';
        document.body.appendChild(badge);
    }
    
    window.toggleChat = function() {
        const chat = document.getElementById('aiChatWindow');
        chat.classList.toggle('open');
    };
    
    window.quickAsk = function(question) {
        document.getElementById('aiInput').value = question;
        sendMessage();
    };
    
    window.sendMessage = async function() {
        const input = document.getElementById('aiInput');
        const sendBtn = document.getElementById('aiSendBtn');
        const question = input.value.trim();
        
        if (!question) return;
        
        // Add user message
        addMessage('user', question);
        input.value = '';
        sendBtn.disabled = true;
        sendBtn.textContent = 'Thinking...';
        
        try {
            const response = await fetch(`${ASSISTANT_API}/api/ask`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({question})
            });
            
            const data = await response.json();
            addMessage('assistant', data.answer || 'Sorry, I couldn\'t process that.');
            
        } catch (error) {
            addMessage('assistant', '❌ Sorry, I\'m having trouble connecting. Please ask the instructor.');
        }
        
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
    };
    
    function addMessage(role, content) {
        const messages = document.getElementById('aiMessages');
        const msg = document.createElement('div');
        msg.className = `ai-message ${role}`;
        
        // Format code blocks
        content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        msg.innerHTML = content.replace(/\n/g, '<br>');
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }
})();
'''
    return js_code, 200, {'Content-Type': 'application/javascript'}

@app.route('/health')
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'running',
        'port': 5002,
        'ai_available': bool(GROQ_API_KEY)
    })

@app.route('/')
def home():
    """Landing page."""
    return render_template_string('''
<!DOCTYPE html>
<html>
<head>
    <title>Workshop Assistant</title>
    <style>
        body {
            font-family: system-ui;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .card {
            background: white;
            color: #2d3748;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 { margin-top: 0; }
        code {
            background: #f7fafc;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 14px;
        }
        .status {
            display: inline-block;
            padding: 8px 12px;
            background: #48bb78;
            color: white;
            border-radius: 8px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>🤖 Workshop AI Assistant</h1>
        <p class="status">✅ Running</p>
        
        <h2>How It Works</h2>
        <p>Students add this to their Flask app's base template:</p>
        <pre><code>&lt;script src="http://localhost:5002/widget.js"&gt;&lt;/script&gt;</code></pre>
        
        <h2>Features</h2>
        <ul>
            <li>Floating AI assistant widget</li>
            <li>Contextual Flask help</li>
            <li>Error explanations</li>
            <li>Code examples</li>
        </ul>
        
        <h2>API Status</h2>
        <p><strong>Groq API:</strong> {{ 'Connected ✅' if groq_key else 'Not configured ⚠️' }}</p>
        
        <h2>Endpoints</h2>
        <ul>
            <li><code>/widget.js</code> - Widget script</li>
            <li><code>/api/ask</code> - Ask questions</li>
            <li><code>/api/explain-code</code> - Code explanations</li>
            <li><code>/health</code> - Health check</li>
        </ul>
    </div>
</body>
</html>
    ''', groq_key=bool(GROQ_API_KEY))

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🤖 Workshop AI Assistant Starting...")
    print("="*60)
    print(f"📍 Running on: http://localhost:5002")
    print(f"🎨 Widget Script: http://localhost:5002/widget.js")
    print(f"💡 AI Status: {'✅ Connected' if GROQ_API_KEY else '❌ No API Key'}")
    print("="*60 + "\n")
    
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5002
    )
