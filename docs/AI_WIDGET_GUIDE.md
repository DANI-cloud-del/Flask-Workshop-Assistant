# AI Widget Setup Guide 🤖

## What Is This?

A **beautiful, floating AI assistant** that appears in students' Flask apps. It can:
- Answer questions about Flask
- Explain code
- Debug errors
- Suggest next steps
- Provide examples

## What It Looks Like

```
                                    Student's Flask App (localhost:5000)
┌───────────────────────────────────────────────────────────┐
│                                                                         │
│  Welcome to Flask! 🚀                                                │
│                                                                         │
│  [Feature Cards]                                          ╭─────────╮ │
│                                                           │ 🤖 AI  │ │
│                                                           │ Assistant│ │
│  [Content]                                                │          │ │
│                                                           ├─────────┤ │
│                                                           │ Messages │ │
│                                                           │          │ │
│                                                           ├─────────┤ │
│                                                           │ [Input]  │ │
│                                          ╭────────╮  ╰─────────╯ │
│                                          │  🤖  │ <- Floating    │
│                                          ╰────────╯    Button     │
└───────────────────────────────────────────────────────────┘

         Click robot button → Chat window opens → Ask questions!
```

## Setup (2 Steps)

### Step 1: Start AI Assistant (Instructor)

On **your laptop** before workshop:

```bash
cd Flask-Workshop-Assistant

# Make sure .env has your GROQ_API_KEY
python workshop_assistant.py

# Should see:
# 🤖 Workshop AI Assistant Starting...
# 📍 Running on: http://localhost:5002
# 💡 AI Status: ✅ Connected
```

Leave this running in background.

### Step 2: Add One Line to Student Apps

Students add this to their `templates/base.html` (or any HTML file):

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Flask App</title>
</head>
<body>
    <!-- Your content here -->
    
    <!-- ADD THIS ONE LINE -->
    <script src="http://localhost:5002/widget.js"></script>
</body>
</html>
```

That's it! The AI widget will appear automatically.

## How It Works

```
Student's Browser                Your Laptop
┌─────────────────╮               ┌─────────────────────╮
│ Flask App       │               │ workshop_assistant.py│
│ localhost:5000  │               │ (port 5002)          │
├─────────────────┤               ├─────────────────────┤
│ 🤖 AI Widget    │ <-- API --> │ Groq LLM API        │
│ (JavaScript)    │    calls    │ (Your key)          │
╰─────────────────╯               ╰─────────────────────╯

1. Student asks question in widget
2. JavaScript calls http://localhost:5002/api/ask
3. Your laptop's assistant calls Groq API
4. AI response sent back to student
5. Widget displays answer
```

**Key Point**: Students don't need API keys! They use **your** assistant running on **your** laptop.

## Using base.html (Template Inheritance)

### Why Use base.html?

Instead of adding the widget script to every HTML file, create one `base.html` that all pages inherit from.

**Without base.html** (repetitive):
```
templates/
├── index.html     <- Script tag here
├── about.html     <- Script tag here
├── contact.html   <- Script tag here
└── blog.html      <- Script tag here
```

**With base.html** (DRY - Don't Repeat Yourself):
```
templates/
├── base.html      <- Script tag ONCE here
├── index.html     <- Extends base
├── about.html     <- Extends base
├── contact.html   <- Extends base
└── blog.html      <- Extends base
```

### Example: base.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{% block title %}Flask Workshop{% endblock %}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <!-- Navigation (appears on all pages) -->
    <nav class="bg-white shadow">
        <div class="container mx-auto px-4 py-4">
            <a href="/" class="text-2xl font-bold">My App</a>
        </div>
    </nav>
    
    <!-- Content (different for each page) -->
    <main class="container mx-auto px-4 py-8">
        {% block content %}{% endblock %}
    </main>
    
    <!-- Footer (appears on all pages) -->
    <footer class="bg-gray-800 text-white p-4 mt-16">
        <div class="container mx-auto text-center">
            Built with Flask 🚀
        </div>
    </footer>
    
    <!-- AI Widget (appears on all pages) -->
    <script src="http://localhost:5002/widget.js"></script>
</body>
</html>
```

### Example: index.html (using base.html)

```html
{% extends "base.html" %}

{% block title %}Home - My App{% endblock %}

{% block content %}
<h1 class="text-4xl font-bold">Welcome!</h1>
<p>This is the home page.</p>
{% endblock %}
```

### Example: about.html (using base.html)

```html
{% extends "base.html" %}

{% block title %}About - My App{% endblock %}

{% block content %}
<h1 class="text-4xl font-bold">About Us</h1>
<p>This is the about page.</p>
{% endblock %}
```

**Result**: Both pages have:
- ✅ Navigation
- ✅ Footer
- ✅ AI Widget
- ✅ No code duplication!

## Widget Features

### 1. Welcome Message
When opened, shows what the assistant can help with.

### 2. Quick Action Buttons
- "📍 Routes" - Explains Flask routes
- "📄 Templates" - Explains templates
- "💡 Next step" - Suggests what to do next

### 3. Text Input
Students can ask anything:
- "How do I add a new route?"
- "Why is my template not found?"
- "Explain this error: ModuleNotFoundError"

### 4. Code Formatting
AI responses show code nicely formatted with syntax highlighting.

## Example Conversations

### Student Asks: "How do I create a route?"

**AI Responds:**
```
To create a route in Flask, use the @app.route decorator:

```python
@app.route('/hello')
def hello():
    return 'Hello World!'
```

This creates a new page at http://localhost:5000/hello

The function below the decorator runs when someone visits that URL.
```

### Student Asks: "ModuleNotFoundError: No module named 'flask'"

**AI Responds:**
```
🔍 WHAT HAPPENED:
Flask is not installed in your virtual environment.

🔧 FIX:
1. Make sure virtual environment is activated:
   - You should see (venv) in your terminal
   - If not: source venv/bin/activate (Ubuntu) or venv\Scripts\activate (Windows)

2. Install Flask:
   pip install Flask

3. Verify:
   python -c "import flask; print('OK')"

✅ VERIFY:
You should see "OK" printed.
```

## Network Modes

### Mode 1: Localhost Only (Simplest)

**Setup**: 
- Your laptop runs workshop_assistant.py
- Students work on **same laptop** (pair programming)
- Widget connects to localhost:5002

**Use case**: Small workshop, 2-3 students per laptop

### Mode 2: Local Network (Recommended)

**Setup**:
- All laptops on same WiFi
- Find your IP: `ipconfig` or `ip addr show`
- Students change script URL to: `http://192.168.1.100:5002/widget.js`

**Use case**: Workshop in lab/classroom with WiFi

### Mode 3: Cloud Deployed (Advanced)

**Setup**:
- Deploy workshop_assistant.py to Railway/Render
- Get public URL: `https://your-workshop.railway.app`
- Students use: `https://your-workshop.railway.app/widget.js`

**Use case**: Remote workshop or unreliable venue WiFi

## Offline Fallback

If assistant is not running:

```
┌─────────────────────────────╮
│ 🤖 AI Assistant offline  │  <- Badge shows instead
╰─────────────────────────────╯
```

Widget script automatically detects if assistant is unavailable and shows a small badge instead of the full widget.

## Customization

### Change Widget Position

In `widget.js`, modify:
```javascript
.ai-assistant-btn {
    bottom: 24px;  // Change this
    right: 24px;   // Change this
}
```

### Change Widget Colors

In `widget.js`, modify:
```javascript
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// Change to your preferred gradient
```

### Add More Quick Actions

In `widget.js`, add buttons:
```html
<button class="ai-quick-btn" onclick="quickAsk('Your question here')">
    📌 Your Button
</button>
```

## Troubleshooting

### Widget Doesn't Appear

**Check**:
1. Is workshop_assistant.py running?
   ```bash
   curl http://localhost:5002/health
   # Should return: {"status": "running"}
   ```

2. Is script tag in HTML?
   ```html
   <script src="http://localhost:5002/widget.js"></script>
   ```

3. Check browser console for errors (F12)

### Widget Shows "Offline"

**Reasons**:
- Assistant not running on port 5002
- Firewall blocking connection
- Wrong IP address (if using network mode)

**Fix**:
```bash
# Start assistant
python workshop_assistant.py

# Test health endpoint
curl http://localhost:5002/health
```

### AI Responses Are Slow

**Normal**: First request takes 2-3 seconds (Groq warmup)

**If consistently slow**:
- Check internet connection
- Verify Groq API key is valid
- Check Groq rate limits (free tier: 14,400/day)

### "CORS Error" in Browser Console

**Solution**: Make sure `flask-cors` is installed
```bash
pip install flask-cors
```

Already included in requirements.txt.

## API Endpoints Reference

### POST /api/ask
Ask a general question

**Request**:
```json
{
    "question": "How do I create a route?",
    "code": "optional code context",
    "checkpoint": 2
}
```

**Response**:
```json
{
    "answer": "To create a route...",
    "success": true
}
```

### POST /api/explain-code
Explain what code does

**Request**:
```json
{
    "code": "@app.route('/')\ndef home():\n    return 'Hi'"
}
```

**Response**:
```json
{
    "explanation": "This code creates..."
}
```

### GET /health
Check if assistant is running

**Response**:
```json
{
    "status": "running",
    "port": 5002,
    "ai_available": true
}
```

## Tips for Instructors

### 1. Introduce the Widget

"There's a robot button in the bottom-right. Click it if you need help!"

### 2. Demonstrate It

Show on projector:
- Click robot
- Ask a question
- Get instant answer

### 3. Encourage Usage

"Before raising your hand, try asking the AI first!"

### 4. Monitor Usage (Optional)

Add logging to see what students ask:
```python
@app.route('/api/ask', methods=['POST'])
def ask_assistant():
    question = data.get('question')
    print(f"Student asked: {question}")  # Log questions
    # ... rest of code
```

### 5. Collect Feedback

After workshop:
- "Did you use the AI widget?"
- "Was it helpful?"
- "What questions did you ask?"

## Benefits

### For Students:
- ✅ Instant help without waiting
- ✅ Can ask "dumb" questions anonymously
- ✅ Learn at their own pace
- ✅ Available 24/7 (if assistant running)

### For Instructor:
- ✅ Less repetitive questions
- ✅ Focus on complex issues
- ✅ Scale to more students
- ✅ See common pain points

### For Workshop:
- ✅ Professional feel
- ✅ Modern AI integration
- ✅ Impressive demo
- ✅ Differentiator from other workshops

---

**The AI widget transforms your workshop from "follow along" to "explore with support"!** 🚀
