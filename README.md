# Flask Workshop Assistant 🤖

A beginner-friendly Flask workshop with automated setup and comprehensive documentation.

## 🚀 Quick Start

**One command sets up everything:**

**Windows (PowerShell):**
```powershell
git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
cd Flask-Workshop-Assistant
.\setup.ps1
```

**Linux/Mac (Bash):**
```bash
git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
cd Flask-Workshop-Assistant
chmod +x setup.sh
./setup.sh
```

**What it creates:**
- ✅ Virtual environment with Flask installed
- ✅ Project folders (templates/, static/)
- ✅ Starter `app.py` with basic route
- ✅ Starter `index.html` with Tailwind CSS
- ✅ Ready-to-run Flask application!

---

## 📖 Complete Documentation

### 👉 **[READ THE WORKSHOP GUIDE](WORKSHOP_GUIDE.md)** 👈

**Everything you need to know is here:**

- ✅ **What is Flask?** - From a developer's perspective
- ✅ **Why Virtual Environments?** - Real scenarios and benefits  
- ✅ **Flask Routes** - URLs, dynamic routes, HTTP methods
- ✅ **Project Structure** - templates/, static/ folders explained
- ✅ **Git Basics** - Setup, commits, branches, workflow
- ✅ **Common Issues** - Solutions to every problem

---

## 🎯 Running Your Flask App

### Step 1: Activate Virtual Environment

**Windows:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your prompt.

### Step 2: Run Flask

```powershell
python app.py
```

### Step 3: Open Browser

**http://localhost:5000**

---

## 📁 Project Structure

```
Flask-Workshop-Assistant/
├── setup.ps1                 # Windows setup script
├── setup.sh                  # Linux/Mac setup script
├── README.md                 # This file
├── WORKSHOP_GUIDE.md         # 📖 Complete guide
├── requirements.txt          # Python dependencies
├── venv/                     # Virtual environment
├── app.py                    # Your Flask app
├── templates/                # HTML files
│   └── index.html
└── static/                   # CSS, JS, images
```

---

## ⚡ Quick Reference

### Virtual Environment
```powershell
# Activate (Windows)
.\venv\Scripts\Activate.ps1

# Activate (Linux/Mac)
source venv/bin/activate

# Deactivate
deactivate
```

### Flask
```powershell
# Run app
python app.py

# Visit in browser
http://localhost:5000
```

### Git
```powershell
# First-time setup
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"

# Save changes
git add .
git commit -m "Your message"
git push

# Branches
git checkout -b feature-name    # Create new branch
git checkout main               # Switch to main
git merge feature-name          # Merge branch
```

---

## 🐛 Common Issues

### Windows Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Git Identity Error
```powershell
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"
```

### Flask Not Refreshing
1. Save file (`Ctrl+S`)
2. Stop Flask (`Ctrl+C`)
3. Restart (`python app.py`)
4. Refresh browser (`F5`)

### Module Not Found
```powershell
# Activate venv first!
.\venv\Scripts\Activate.ps1
python app.py
```

**More solutions:** [WORKSHOP_GUIDE.md](WORKSHOP_GUIDE.md#common-issues--solutions)

---

## 🎓 What You'll Learn

- ✅ Python virtual environments
- ✅ Flask web applications
- ✅ Routes and templates
- ✅ Static files (CSS, JS, images)
- ✅ Git version control
- ✅ Working with branches
- ✅ Debugging common errors
- ✅ Professional workflows

---

## 🛠️ Requirements

- Python 3.8+
- Git
- Text editor (VS Code recommended)
- Internet connection (for setup)

---

## 📜 License

MIT License - free for educational use!

---

## 📞 Support

- **Documentation:** [WORKSHOP_GUIDE.md](WORKSHOP_GUIDE.md)
- **Issues:** [Report bugs](https://github.com/DANI-cloud-del/Flask-Workshop-Assistant/issues)
- **Discussions:** [Ask questions](https://github.com/DANI-cloud-del/Flask-Workshop-Assistant/discussions)

---

## 🚀 Ready to Start?

1. Clone the repo
2. Run `setup.ps1` (Windows) or `setup.sh` (Linux/Mac)
3. Read [WORKSHOP_GUIDE.md](WORKSHOP_GUIDE.md)
4. Build something awesome!

---

**Built with ❤️ for Flask learners**
