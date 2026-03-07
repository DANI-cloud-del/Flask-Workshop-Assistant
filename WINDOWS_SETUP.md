# Windows Setup Guide 🪟

## Quick Start for Windows Users

Since most of your students are on Windows, use the **PowerShell version** of the validation script.

### Step 1: Clone Repository

```powershell
# Option A: If you have Git
git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
cd Flask-Workshop-Assistant

# Option B: Download ZIP
# Download from: https://github.com/DANI-cloud-del/Flask-Workshop-Assistant/archive/refs/heads/main.zip
# Extract, then:
cd Flask-Workshop-Assistant-main
```

### Step 2: Run PowerShell Script

```powershell
cd student_workspace
..\workshop_check.ps1 1
```

**First Time Issue?** PowerShell might block the script. Fix it:

```powershell
# One-time setup (run as normal user, not admin):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run again:
..\workshop_check.ps1 1
```

## What the Script Does

```
╭────────────────────────────────────────────────────╮
│  Flask Workshop - Checkpoint 1 Validator          │
╰────────────────────────────────────────────────────╯

ℹ️  Checking your environment setup...

📋 Check 1/6: Python Installation
✅ Python found: Python 3.11.0

📋 Check 2/6: Virtual Environment
❌ Virtual environment not found
ℹ️  Auto-fix enabled. Fixing...
✅ Virtual environment created!

📋 Check 3/6: Virtual Environment Activation
⚠️  Virtual environment not activated

ℹ️  To activate:
  .\venv\Scripts\Activate.ps1

ℹ️  If you get an error about execution policy:
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

ℹ️  After activating, run this script again
```

## Complete Workflow

### First Time Setup

```powershell
# 1. Navigate to workspace
cd Flask-Workshop-Assistant\student_workspace

# 2. Run checkpoint 1
..\workshop_check.ps1 1
# This creates venv, installs Flask

# 3. Activate virtual environment
.\venv\Scripts\Activate.ps1

# You should see (venv) in your prompt:
# (venv) PS C:\...\student_workspace>

# 4. Run checkpoint 1 again (to verify)
..\workshop_check.ps1 1
```

### Creating Your Flask App

```powershell
# Make sure venv is activated (you see "(venv)" in prompt)

# Create app.py
code app.py  # Opens in VS Code
# Or use notepad:
notepad app.py
```

**app.py content:**
```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
```

**Create templates/index.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Flask Workshop</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-8">
        <h1 class="text-4xl font-bold text-blue-600">Hello Flask!</h1>
        <p class="mt-4">My first web app</p>
    </div>
    
    <!-- AI Widget (optional) -->
    <script src="http://localhost:5002/widget.js"></script>
</body>
</html>
```

### Validate Your Work

```powershell
# Check checkpoint 2
..\workshop_check.ps1 2

# Check checkpoint 3
..\workshop_check.ps1 3
```

### Run Your App

```powershell
# Make sure venv is activated!
python app.py

# Visit in browser:
# http://localhost:5000
```

## Common Windows Issues

### Issue 1: "Execution Policy" Error

**Error:**
```
.\workshop_check.ps1 : File cannot be loaded because running scripts is disabled on this system.
```

**Fix:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

This is safe and only affects your user account.

### Issue 2: Virtual Environment Won't Activate

**Error:**
```
.\venv\Scripts\Activate.ps1 : File cannot be loaded
```

**Fix:**
```powershell
# Same as above:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then:
.\venv\Scripts\Activate.ps1
```

### Issue 3: "Python not found"

**Error:**
```
python : The term 'python' is not recognized
```

**Fix:**
1. Download Python from: https://www.python.org/downloads/
2. **IMPORTANT**: Check "Add Python to PATH" during installation
3. Restart PowerShell
4. Test: `python --version`

### Issue 4: Port 5000 Already in Use

**Error:**
```
Address already in use
```

**Fix:** Change port in app.py:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Changed from 5000
```

Then visit: http://localhost:5001

### Issue 5: "Module not found: flask"

**Error:**
```
ModuleNotFoundError: No module named 'flask'
```

**Fix:**
```powershell
# Make sure venv is activated (you see (venv) in prompt)
# If not:
.\venv\Scripts\Activate.ps1

# Then install Flask:
pip install Flask

# Verify:
python -c "import flask; print('OK')"
```

## PowerShell vs Bash

### This Repository Has Both:

| File | For | Command |
|------|-----|----------|
| `workshop_check.ps1` | **Windows PowerShell** | `.\workshop_check.ps1 1` |
| `workshop_check.sh` | Linux/Mac/Git Bash | `./workshop_check.sh 1` |

### Which Should You Use?

**For Windows students**: Use `.ps1` (PowerShell) version

**Advantages:**
- ✅ Works in native Windows PowerShell
- ✅ No additional software needed
- ✅ Same features as bash version
- ✅ Better Windows path handling

## Workshop Commands Cheat Sheet

```powershell
# Navigate to workspace
cd Flask-Workshop-Assistant\student_workspace

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run checkpoints
..\workshop_check.ps1 1  # Environment
..\workshop_check.ps1 2  # Flask app
..\workshop_check.ps1 3  # Tailwind CSS
..\workshop_check.ps1 4  # AI integration

# Run your Flask app
python app.py

# Install packages
pip install Flask
pip install flask-cors

# Deactivate venv when done
deactivate
```

## For Instructors: Running AI Assistant on Windows

```powershell
# 1. Install dependencies
cd Flask-Workshop-Assistant
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 2. Configure .env
copy .env.example .env
notepad .env
# Add your GROQ_API_KEY

# 3. Start assistant
python workshop_assistant.py

# Should see:
# 🤖 Workshop AI Assistant Starting...
# 📍 Running on: http://localhost:5002
```

## Tips for Windows Users

### Use Windows Terminal (Recommended)

**Better than old PowerShell:**
- Install from Microsoft Store: "Windows Terminal"
- Supports tabs, colors, Unicode characters
- Better copy/paste
- Modern interface

### VS Code for Editing

```powershell
# Install VS Code
# Download from: https://code.visualstudio.com/

# Open project in VS Code
cd Flask-Workshop-Assistant
code .

# Or open specific file
code student_workspace\app.py
```

### File Explorer Integration

**Right-click in folder → "Open in Terminal"** to quickly open PowerShell in that directory

## Troubleshooting Checklist

Before asking for help:

- [ ] Python installed and in PATH? (`python --version`)
- [ ] In correct folder? (`cd Flask-Workshop-Assistant\student_workspace`)
- [ ] Virtual environment created? (`Test-Path venv`)
- [ ] Virtual environment activated? (See `(venv)` in prompt)
- [ ] Flask installed? (`python -c "import flask"`)
- [ ] Execution policy set? (If activation fails)
- [ ] File saved before running? (Ctrl+S in editor)

## Getting Help

### Script Help
```powershell
Get-Help .\workshop_check.ps1 -Full
```

### Check Python
```powershell
python --version
pip list
```

### Check Virtual Environment
```powershell
# Should show venv path:
echo $env:VIRTUAL_ENV

# If activated, shows:
# C:\...\Flask-Workshop-Assistant\student_workspace\venv
```

### Manual Mode (Ask Before Fixing)
```powershell
..\workshop_check.ps1 1 -ManualMode
```

## Next Steps

Once Checkpoint 1 passes:

1. **Create app.py** - Basic Flask application
2. **Validate** - Run `..\workshop_check.ps1 2`
3. **Add Tailwind** - Style your app
4. **Validate** - Run `..\workshop_check.ps1 3`
5. **Add AI Widget** - Integrate assistant
6. **Deploy** - Share your app!

---

**Ready to start? Run:**

```powershell
cd Flask-Workshop-Assistant\student_workspace
..\workshop_check.ps1 1
```

🚀 **Let's build something awesome!**
