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

The comprehensive guide covers:

- ✅ **What is Flask?** - From a developer's perspective
- ✅ **Why Virtual Environments?** - Real scenarios and benefits
- ✅ **Flask Routes** - URLs, dynamic routes, HTTP methods
- ✅ **Project Structure** - templates/, static/ folders explained
- ✅ **Git Basics** - Commits, branches, workflow
- ✅ **Common Issues** - Solutions to every problem you'll hit

**Start here:** [WORKSHOP_GUIDE.md](WORKSHOP_GUIDE.md)

---

## 🎯 Running Your Flask App

### Step 1: Activate Virtual Environment

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
├── setup.ps1                 # Automated setup (Windows)
├── setup.sh                  # Automated setup (Linux/Mac)
├── WORKSHOP_GUIDE.md         # 📖 Complete learning guide
├── venv/                     # Virtual environment (created by setup)
├── app.py                    # Your Flask application (created by setup)
├── templates/                # HTML files (created by setup)
│   └── index.html
└── static/                   # CSS, JS, images (created by setup)
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

### Flask Commands
```powershell
# Run app
python app.py

# Visit in browser
http://localhost:5000
```

### Git Commands
```powershell
# Setup (first time only)
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"

# Save changes
git add .
git commit -m "Your message"
git push

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main
```

---

## 🐛 Common Issues

### Windows Execution Policy Error
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

### Module Not Found: flask
```powershell
# You forgot to activate venv!
.\venv\Scripts\Activate.ps1
python app.py
```

**More solutions:** [WORKSHOP_GUIDE.md - Common Issues](WORKSHOP_GUIDE.md#common-issues--solutions)

---

## 📚 Learning Resources

### Main Documentation
- **[Workshop Guide](WORKSHOP_GUIDE.md)** - Complete learning path
- **[Windows Setup](WINDOWS_SETUP.md)** - Detailed Windows instructions
- **[Quick Start](QUICKSTART.md)** - Fast track guide

### What You'll Learn

By completing this workshop:
- ✅ Understand Python virtual environments
- ✅ Build Flask web applications
- ✅ Use routes and templates
- ✅ Work with static files (CSS, JS, images)
- ✅ Use Git for version control
- ✅ Work with branches
- ✅ Debug common errors
- ✅ Follow professional workflows

---

## 🎨 What's Included

### Automated Setup
- One command creates everything
- Virtual environment with Flask
- Project folders and starter code
- Beautiful starter template with Tailwind CSS

### Beginner-Friendly
- No prior Flask knowledge needed
- Clear error messages
- Step-by-step instructions
- Real developer workflows

### Production-Ready Practices
- Virtual environments
- Git version control
- Proper project structure
- Industry standards

---

## 🛠️ Requirements

- Python 3.8+
- Git
- Text editor (VS Code recommended)
- Internet connection (for setup)

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Test your changes
4. Submit a pull request

---

## 📜 License

MIT License - free for educational use!

---

## 📞 Support

- **Issues:** [Report bugs](https://github.com/DANI-cloud-del/Flask-Workshop-Assistant/issues)
- **Questions:** [GitHub Discussions](https://github.com/DANI-cloud-del/Flask-Workshop-Assistant/discussions)
- **Documentation:** [Workshop Guide](WORKSHOP_GUIDE.md)

---

## 🚀 Ready to Start?

1. **Clone the repo**
2. **Run setup script** (`setup.ps1` or `setup.sh`)
3. **Read the [Workshop Guide](WORKSHOP_GUIDE.md)**
4. **Build something awesome!**

---

**🎉 Let's learn Flask together!**

Built with ❤️ for Flask learners everywhere.
