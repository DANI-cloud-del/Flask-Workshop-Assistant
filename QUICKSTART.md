# Quick Start for Wednesday Workshop 🚀

## For Instructor (DANI) - Do This Now

### 1. Test the System (15 minutes)

```bash
# Clone your new repo
git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
cd Flask-Workshop-Assistant

# Make script executable
chmod +x workshop_check.sh

# Test checkpoint 1
cd student_workspace
../workshop_check.sh 1

# Should auto-create venv, install Flask, create folders
```

### 2. Get Your Groq API Key (5 minutes)

1. Visit: https://console.groq.com
2. Sign up (free)
3. Create API key
4. Save it somewhere safe

**Note**: Free tier = 14,400 requests/day (plenty!)

### 3. Prepare for Workshop (Tomorrow)

**Write on Board**:
```
Repository: https://github.com/DANI-cloud-del/Flask-Workshop-Assistant

Commands:
1. git clone <URL>
2. cd Flask-Workshop-Assistant/student_workspace
3. ../workshop_check.sh 1
```

**Backup Plan**:
- If git fails → Download ZIP from GitHub
- If script fails → Show solution code from `solutions/`
- If everything fails → Live code together on projector

## For Students - Workshop Day

### Step 1: Clone Repository

```bash
git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
cd Flask-Workshop-Assistant/student_workspace
```

### Step 2: Run Checkpoint 1

```bash
../workshop_check.sh 1
```

**What it does**:
- ✅ Checks Python installed
- ✅ Creates virtual environment
- ✅ Installs Flask
- ✅ Creates project folders
- ✅ All automatic!

### Step 3: Activate Virtual Environment

**Windows**:
```bash
venv\Scripts\activate
```

**Ubuntu**:
```bash
source venv/bin/activate
```

You should see `(venv)` in your prompt.

### Step 4: Create Your Flask App

Create `app.py`:

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
```

Create `templates/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Flask App</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-8">
        <h1 class="text-4xl font-bold text-blue-600">Hello Flask!</h1>
    </div>
</body>
</html>
```

### Step 5: Validate Your Work

```bash
# Check checkpoint 2
../workshop_check.sh 2

# Check checkpoint 3
../workshop_check.sh 3
```

### Step 6: Run Your App

```bash
python app.py
```

Visit: http://localhost:5000

## Workshop Flow

### Checkpoint 1: Environment (15 mins)
- Setup Python, venv, Flask
- **Goal**: See "✅ CHECKPOINT 1 PASSED!"

### Checkpoint 2: First Flask App (20 mins)
- Create app.py
- Define routes
- **Goal**: App runs on localhost:5000

### Checkpoint 3: Tailwind CSS (20 mins)
- Add Tailwind CDN
- Use utility classes
- **Goal**: Beautiful styled pages

### Checkpoint 4: AI Integration (25 mins)
- Add API endpoints
- Environment variables
- **Goal**: Working chat interface

## Common Issues

### "bash: ./workshop_check.sh: Permission denied"
```bash
chmod +x workshop_check.sh
```

### "No module named 'flask'"
```bash
# Activate venv first!
venv\Scripts\activate  # Windows
source venv/bin/activate  # Ubuntu

pip install Flask
```

### "Port 5000 already in use"
```python
# In app.py:
app.run(debug=True, port=5001)
```

### "Template not found"
```bash
# Make sure templates/ folder exists
mkdir templates
# Put HTML files inside templates/
```

## Help Resources

1. **Validation failed?** → Read the error message carefully
2. **Stuck on code?** → Check `solutions/` folder
3. **Need explanation?** → Check `docs/TROUBLESHOOTING.md`
4. **Still stuck?** → Raise your hand!

## What You'll Learn

By the end:
- ✅ How to set up Python virtual environments
- ✅ Create web applications with Flask
- ✅ Style with Tailwind CSS
- ✅ Debug common errors
- ✅ Professional development workflow

## Success Criteria

**You're successful if you**:
- Can create and activate a virtual environment
- Can write a basic Flask app
- Understand routes and templates
- Have a working app on localhost

**Don't worry about**:
- Finishing all 4 checkpoints
- Perfect code
- Understanding everything immediately

## After Workshop

**Continue learning**:
- Build your own Flask projects
- Add more features (database, authentication)
- Deploy to cloud (Railway, Render, PythonAnywhere)
- Explore Flask extensions

**Resources**:
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Python Tutorial](https://docs.python.org/3/tutorial/)

---

## Instructor Notes

### Time Management
- **Don't wait** for everyone to finish each checkpoint
- **Move on** when ~70% complete
- **Help strugglers** during next section
- **Skip Checkpoint 4** if running late

### Teaching Tips
- **Live code** - show your mistakes
- **Encourage questions** - no dumb questions
- **Pair students** - advanced help beginners
- **Celebrate wins** - cheer when checkpoints pass!

### Backup Plans
- WiFi fails? → Scripts work offline
- Repo inaccessible? → Download ZIP
- Mass confusion? → Live code together
- Running late? → Focus on checkpoints 1-2

### Success Metrics
- 80%+ complete checkpoint 1-2 → Success!
- 60%+ complete checkpoint 3 → Great!
- 40%+ complete checkpoint 4 → Amazing!

---

**Good luck and have fun! 🎉**

*Remember: The goal is learning, not perfection!*
