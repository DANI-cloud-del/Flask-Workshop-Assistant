# Flask Workshop - Complete Guide

## Table of Contents
1. [What is Flask?](#what-is-flask)
2. [Why Virtual Environments?](#why-virtual-environments)
3. [Setup Instructions](#setup-instructions)
4. [Understanding Flask Routes](#understanding-flask-routes)
5. [Project Structure](#project-structure)
6. [Git Basics for Developers](#git-basics-for-developers)
7. [Common Issues & Solutions](#common-issues--solutions)

---

## What is Flask?

### From a Developer's Perspective

Flask is a **lightweight Python web framework** that helps you build web applications quickly. Think of it as a toolkit that handles the boring parts of web development (routing URLs, handling requests, rendering templates) so you can focus on building your application logic.

**Why developers love Flask:**

1. **Simple & Minimal** - Start with just a few lines of code
2. **Flexible** - Add only what you need, when you need it
3. **Python-based** - Use familiar Python syntax
4. **Great for APIs** - Perfect for building REST APIs
5. **Easy to learn** - Great for beginners, powerful for experts

**Real-world uses:**
- REST APIs for mobile apps
- Small to medium web applications
- Microservices
- Prototypes and MVPs
- Backend for React/Vue/Angular frontends

### Flask vs Other Frameworks

| Framework | Best For | Complexity |
|-----------|----------|------------|
| **Flask** | Small-medium apps, APIs, learning | Low |
| Django | Large apps, content sites, admin panels | High |
| FastAPI | High-performance APIs, async | Medium |
| Express.js | JavaScript developers | Low |

---

## Why Virtual Environments?

### The Problem Virtual Environments Solve

Imagine you're working on two projects:

**Project A (Old):**
- Built last year
- Uses Flask 2.0
- Works perfectly

**Project B (New):**
- Building today
- Needs Flask 3.0 (has new features)
- Won't work with Flask 2.0

**Without virtual environments:**
```powershell
pip install Flask==3.0  # Upgrades to 3.0
# Now Project A breaks! 💔
```

**With virtual environments:**
```
Project-A/
└── venv/  # Has Flask 2.0

Project-B/
└── venv/  # Has Flask 3.0

# Both projects work! 🎉
```

### Real Developer Scenario

```
You: "Hey, can you run my code?"
Colleague: "Sure!" *runs code*
Colleague: "It's broken! ModuleNotFoundError: No module named 'flask'"
You: "But it works on my machine..."

# With virtual environment + requirements.txt:
Colleague: "pip install -r requirements.txt"
Colleague: "It works! Thanks!"
```

### Key Benefits

1. **Isolation** - Each project has its own dependencies
2. **No conflicts** - Different versions don't interfere
3. **Reproducibility** - Share exact environment with team
4. **Clean system** - Don't pollute global Python
5. **Professional** - Industry standard practice

---

## Setup Instructions

### Step 1: Run Setup Script

**Windows (PowerShell):**
```powershell
cd Flask-Workshop-Assistant
.\setup.ps1
```

**Linux/Mac (Bash):**
```bash
cd Flask-Workshop-Assistant
chmod +x setup.sh
./setup.sh
```

**What this does:**
1. ✓ Checks Python installation
2. ✓ Creates virtual environment (`venv/`)
3. ✓ Installs Flask inside the venv
4. ✓ Creates project folders (`templates/`, `static/`)
5. ✓ Creates starter files (`app.py`, `index.html`)

### Step 2: Activate Virtual Environment

**Every time you work on the project, activate the venv first!**

**Windows:**
```powershell
.\venv\Scripts\Activate.ps1
```

You should see `(venv)` in your prompt:
```
(venv) PS C:\Flask-Workshop-Assistant>
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

You should see:
```
(venv) user@computer:~/Flask-Workshop-Assistant$
```

**To deactivate (when done working):**
```powershell
deactivate
```

### Step 3: Run Your Flask App

```powershell
python app.py
```

Open browser: **http://localhost:5000**

---

## Understanding Flask Routes

### What is a Route?

A **route** maps a URL to a Python function. When someone visits that URL, Flask runs your function.

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')           # URL: http://localhost:5000/
def home():
    return "Home Page"

@app.route('/about')      # URL: http://localhost:5000/about
def about():
    return "About Us"

@app.route('/contact')    # URL: http://localhost:5000/contact
def contact():
    return "Contact: email@example.com"
```

### Dynamic Routes (URL Parameters)

```python
@app.route('/user/<username>')
def user_profile(username):
    return f"Profile page for {username}"

# Visit: http://localhost:5000/user/john
# Shows: "Profile page for john"
```

```python
@app.route('/post/<int:post_id>')
def show_post(post_id):
    return f"Showing post #{post_id}"

# Visit: http://localhost:5000/post/42
# Shows: "Showing post #42"
```

### HTTP Methods

```python
# GET request (default - for viewing pages)
@app.route('/products')
def products():
    return "List of products"

# POST request (for submitting forms)
@app.route('/submit', methods=['POST'])
def submit_form():
    return "Form submitted!"

# Both GET and POST
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Process login
        return "Logging in..."
    else:
        # Show login form
        return "Please log in"
```

---

## Project Structure

### Folder Organization

```
Flask-Workshop-Assistant/
├── venv/                    # Virtual environment (DON'T EDIT)
├── app.py                   # Main Flask application
├── templates/               # HTML files
│   ├── index.html
│   ├── about.html
│   └── base.html          # Template inheritance
├── static/                  # CSS, JS, images
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/
│       └── logo.png
└── requirements.txt        # List of dependencies
```

### The `templates/` Folder

**Purpose:** Store HTML files that Flask renders

**Why separate folder?**
- Flask looks for templates here automatically
- Keeps code organized
- Enables template inheritance
- Security (Flask escapes variables)

**Example:**

```python
# app.py
from flask import render_template

@app.route('/')
def home():
    return render_template('index.html', name="John")
```

```html
<!-- templates/index.html -->
<!DOCTYPE html>
<html>
<body>
    <h1>Hello {{ name }}!</h1>
</body>
</html>
```

Visit `/` → Shows: "Hello John!"

### The `static/` Folder

**Purpose:** Store files that don't change (CSS, JS, images, fonts)

**Why static?**
- Fast delivery (no processing needed)
- Browser caching
- CDN-friendly
- Clear separation from dynamic content

**Accessing static files:**

```html
<!-- In your HTML templates -->

<!-- CSS -->
<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">

<!-- JavaScript -->
<script src="{{ url_for('static', filename='js/script.js') }}"></script>

<!-- Images -->
<img src="{{ url_for('static', filename='images/logo.png') }}" alt="Logo">
```

**File structure example:**

```
static/
├── css/
│   ├── style.css       # Your custom styles
│   └── bootstrap.css   # Framework CSS
├── js/
│   ├── script.js       # Your JavaScript
│   └── jquery.js       # Libraries
└── images/
    ├── logo.png
    └── banner.jpg
```

---

## Git Basics for Developers

### Why Use Git?

**From a developer's perspective:**

1. **Time Machine** - Go back to any previous version
2. **Backup** - Your code is safe on GitHub
3. **Collaboration** - Work with teammates without conflicts
4. **Portfolio** - Show your work to employers
5. **Experimentation** - Try new features without breaking code

### Real Developer Scenario

```
Situation: You added a feature. It broke everything.

Without Git:
"Uh oh... I need to undo 50 changes manually..."
*spends 2 hours fixing*

With Git:
"git checkout ."
*back to working version in 2 seconds*
```

### Essential Git Commands

#### First-Time Setup (Run Once)

```powershell
# Set your identity
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"
```

**Why this matters:**
Git needs to know who made each change. This shows up in commit history and helps teams track contributions.

#### Daily Workflow

**1. Check what changed:**
```powershell
git status
```

Shows:
- Modified files (red = not staged)
- New files
- Deleted files

**2. Stage changes (prepare for commit):**
```powershell
git add .                  # Add all changes
git add app.py             # Add specific file
git add templates/         # Add folder
```

**3. Commit (save snapshot):**
```powershell
git commit -m "Add about page route"
```

**Good commit messages:**
- ✓ "Add user login functionality"
- ✓ "Fix navbar alignment bug"
- ✓ "Update homepage styling"

**Bad commit messages:**
- ✗ "changes"
- ✗ "stuff"
- ✗ "asdfasdf"

**4. Push to GitHub (backup online):**
```powershell
git push
```

**5. Pull from GitHub (get latest changes):**
```powershell
git pull
```

### Working with Branches

**Why branches matter:**

Imagine working on a new feature. You don't want to break the working version while experimenting.

```
main branch:     [Working App] ----------> [Still Working]
                        \
                         \
feature branch:           [Experiment] -> [Try stuff] -> [Merge when ready]
```

#### Branch Commands

**Create a new branch:**
```powershell
git branch feature-login
```

**Switch to branch:**
```powershell
git checkout feature-login
```

**Create AND switch (shortcut):**
```powershell
git checkout -b feature-login
```

**See all branches:**
```powershell
git branch
```

Output:
```
  main
* feature-login    # * means you're here
  feature-signup
```

**Switch back to main:**
```powershell
git checkout main
```

**Merge branch into main:**
```powershell
git checkout main          # Go to main first
git merge feature-login    # Bring in changes
```

**Delete branch (after merging):**
```powershell
git branch -d feature-login
```

#### Real Workflow Example

```powershell
# Working on main branch
git checkout main

# Create feature branch
git checkout -b add-contact-page

# Make changes to app.py
# Add templates/contact.html

# Commit changes
git add .
git commit -m "Add contact page with form"

# Push feature branch to GitHub
git push -u origin add-contact-page

# Switch back to main
git checkout main

# Merge feature when ready
git merge add-contact-page

# Push updated main
git push
```

### Why Branching is Essential

**1. Safe experimentation:**
```
main:        [v1.0 - Working]
feature:              [Try new design] -> Works? Merge! 
                                         Broken? Delete branch!
```

**2. Team collaboration:**
```
Dev 1:  main -> [feature-login]     -> merge
Dev 2:  main -> [feature-payment]   -> merge
Dev 3:  main -> [feature-dashboard] -> merge

# All work in parallel, no conflicts!
```

**3. Production safety:**
```
main:         [Users see this - must always work!]
development:  [Test features here first]
features:     [Individual experiments]
```

---

## Common Issues & Solutions

### Issue 1: "Permission denied" or "Execution Policy" Error

**Error:**
```
.\setup.ps1 cannot be loaded because running scripts is disabled
```

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run the script again.

---

### Issue 2: Git Identity Error

**Error:**
```
*** Please tell me who you are.
fatal: no email was given and auto-detection is disabled
```

**Solution:**
```powershell
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"
```

**To verify it worked:**
```powershell
git config --global --list
```

---

### Issue 3: Flask Not Auto-Refreshing

**Problem:** You change code, but browser shows old version

**Solution:**

**Method 1: Hard restart (Most reliable)**
```powershell
# Stop Flask (Ctrl+C)
python app.py
# Refresh browser (F5)
```

**Method 2: Enable autosave in VS Code**
1. File → Preferences → Settings
2. Search "Auto Save"
3. Set to "afterDelay"

**Method 3: Clear browser cache**
- Chrome/Edge: `Ctrl+Shift+R`
- Firefox: `Ctrl+F5`

---

### Issue 4: "Module not found: flask"

**Error:**
```
ModuleNotFoundError: No module named 'flask'
```

**Solution:**

You forgot to activate the virtual environment!

```powershell
# Activate venv first
.\venv\Scripts\Activate.ps1

# You should see (venv) in prompt
(venv) PS C:\...>

# Now run Flask
python app.py
```

---

### Issue 5: Port 5000 Already in Use

**Error:**
```
Address already in use
```

**Solution 1: Kill the process**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (use PID from above)
taskkill /PID <PID> /F
```

**Solution 2: Use different port**

In `app.py`, change:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Changed from 5000
```

Then visit: http://localhost:5001

---

### Issue 6: 404 Not Found on Route

**Problem:** Visiting `/about` shows "404 Not Found"

**Checklist:**

1. **Is route defined?**
   ```python
   @app.route('/about')  # Must have this!
   def about():
       return "About page"
   ```

2. **Saved the file?**
   - Press `Ctrl+S` in editor
   - Look for dot next to filename (indicates unsaved)

3. **Restarted Flask?**
   ```powershell
   # Stop (Ctrl+C) and restart
   python app.py
   ```

4. **Correct URL?**
   - ✓ `http://localhost:5000/about`
   - ✗ `http://localhost:5000/About` (wrong case)
   - ✗ `http://localhost:5000/about/` (extra slash)

---

## Quick Reference Card

### Virtual Environment
```powershell
# Create
python -m venv venv

# Activate (Windows)
.\venv\Scripts\Activate.ps1

# Activate (Linux/Mac)
source venv/bin/activate

# Deactivate
deactivate
```

### Flask
```powershell
# Install Flask
pip install Flask

# Run app
python app.py

# Visit
http://localhost:5000
```

### Git
```powershell
# Setup (once)
git config --global user.email "email@example.com"
git config --global user.name "Your Name"

# Daily workflow
git status
git add .
git commit -m "Message"
git push

# Branches
git checkout -b new-feature
git checkout main
git merge new-feature
```

---

## Next Steps

Now that you understand the basics:

1. ✓ Virtual environments prevent version conflicts
2. ✓ Flask routes map URLs to functions
3. ✓ Templates store HTML, static stores CSS/JS/images
4. ✓ Git tracks changes and enables collaboration
5. ✓ Branches let you experiment safely

**Ready to build?**

1. Run `setup.ps1` to create your environment
2. Activate venv
3. Edit `app.py` to add routes
4. Create templates in `templates/`
5. Add styles in `static/css/`
6. Commit your work with Git
7. Build something awesome! 🚀

---

**Questions? Issues?**
Check the [Common Issues](#common-issues--solutions) section or ask your instructor!
