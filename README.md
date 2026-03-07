# Flask Workshop Assistant 🤖

An intelligent, self-healing workshop assistant that helps students learn Flask through automated validation, error detection, and AI-powered guidance.

## 🎯 What This Does

- **Automated Environment Validation**: Checks Python, venv, Flask installation
- **Self-Healing**: Auto-fixes common issues (creates folders, installs packages)
- **Intelligent Error Detection**: Parses code, finds syntax errors, validates structure
- **AI-Powered Help**: Explains errors and provides solutions (uses instructor's API key)
- **Progress Tracking**: Students track their own checkpoint completion
- **Offline Capable**: Works without internet (falls back to static help)
- **Cross-Platform**: Detects Windows/Ubuntu and adjusts commands

## 📋 Prerequisites

### For Instructor (You)
- Python 3.8+
- Groq API key (free tier: 14,400 requests/day) - Get from https://console.groq.com
- Git

### For Students
- Python 3.8+
- Git
- Code editor (VS Code recommended)

## 🚀 Quick Start

### Instructor Setup (Before Workshop)

```bash
# 1. Clone repository
git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
cd Flask-Workshop-Assistant

# 2. Create virtual environment
python -m venv venv

# 3. Activate venv
# Windows:
venv\Scripts\activate
# Ubuntu:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Configure .env file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# 6. Test assistant (optional)
python workshop_assistant.py
# Visit: http://localhost:5002
```

### Student Setup (During Workshop)

```bash
# 1. Clone repository
git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
cd Flask-Workshop-Assistant/student_workspace

# 2. Run checkpoint validation
../workshop_check.sh 1
```

## 📚 Workshop Structure

### Checkpoint 1: Environment Setup (15 mins)
- ✅ Python installation verified
- ✅ Virtual environment created & activated
- ✅ Flask installed correctly
- ✅ Project folders created (templates/, static/)
- ✅ Git initialized

### Checkpoint 2: First Flask App (20 mins)
- ✅ app.py created with basic structure
- ✅ Valid Python syntax
- ✅ Flask imported correctly
- ✅ Route defined (@app.route)
- ✅ App can start successfully

### Checkpoint 3: Tailwind CSS (20 mins)
- ✅ HTML template exists
- ✅ Tailwind CDN integrated
- ✅ Utility classes used (bg-, text-, p-, etc.)
- ✅ Interactive elements (hover effects)

### Checkpoint 4: AI Integration (25 mins)
- ✅ Environment variables configured
- ✅ API endpoint created
- ✅ Working chat interface

## 🎮 Usage

### For Students

**Run checkpoint validation**:
```bash
./workshop_check.sh [checkpoint_number]

Examples:
./workshop_check.sh 1  # Check environment setup
./workshop_check.sh 2  # Check Flask app
./workshop_check.sh 3  # Check Tailwind CSS
./workshop_check.sh 4  # Check AI integration
```

**Auto-fix mode** (default - automatically fixes issues):
```bash
./workshop_check.sh 1
```

**Manual mode** (asks before fixing):
```bash
AUTO_FIX=false ./workshop_check.sh 1
```

### For Instructor

**Option 1: Fully Offline (Recommended)**
- Students run scripts locally
- No network setup needed
- Static help messages
- You walk around helping

**Option 2: With AI Assistant (Optional)**
```bash
# Start AI assistant on your laptop
python workshop_assistant.py

# Students can call your laptop IP for AI help
# Update ASSISTANT_API in workshop_check.sh with your IP
```

## 🔧 How It Works

### Self-Healing Example
```bash
$ ./workshop_check.sh 1

📋 Check 2/6: Virtual Environment
❌ Virtual environment not found
ℹ️  Auto-fix enabled. Fixing...
✅ Virtual environment created successfully!

📋 Check 3/6: Virtual Environment Activation
⚠️  Virtual environment not activated
ℹ️  To activate:
  Windows: venv\Scripts\activate
  Ubuntu: source venv/bin/activate

✅ CHECKPOINT 1 PASSED!
```

### Intelligent Validation
- **File structure checks**: Validates folders exist
- **Syntax parsing**: Uses Python AST to check code
- **Runtime tests**: Actually tries to start Flask
- **Cross-platform**: Detects OS and adjusts commands

### AI Integration (Optional)
- Students paste errors → get explanations
- Uses **your** Groq API key (students don't need one)
- Falls back to static help if offline
- Works on local network or cloud-deployed

## 📁 File Structure

```
Flask-Workshop-Assistant/
├── workshop_check.sh              # Main validation script
├── workshop_assistant.py          # AI assistant API (optional)
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment template
├── README.md                      # This file
│
├── student_workspace/             # Where students work
│   ├── app.py                     # Their Flask app
│   ├── templates/                 # HTML templates
│   └── static/                    # CSS, JS, images
│
├── solutions/                     # Reference code
│   ├── checkpoint1/
│   ├── checkpoint2/
│   ├── checkpoint3/
│   └── checkpoint4/
│
└── docs/                          # Guides
    ├── SETUP_GUIDE.md
    ├── TROUBLESHOOTING.md
    └── COMMON_ERRORS.md
```

## 🎯 Design Philosophy

1. **Offline-First**: Core functionality works without internet
2. **Self-Healing**: Auto-fixes common mistakes
3. **Gradual Complexity**: Simple → Advanced checkpoints
4. **Learn By Doing**: Validation guides, doesn't solve
5. **Scalable**: Works with 5 or 50 students

## 🐛 Troubleshooting

### Script won't run
```bash
# Make executable (Unix/Mac)
chmod +x workshop_check.sh

# Or run with bash
bash workshop_check.sh 1

# Windows (Git Bash)
bash workshop_check.sh 1
```

### "Permission denied"
```bash
chmod +x workshop_check.sh
```

### AI assistant not working
- Check .env has GROQ_API_KEY
- Verify: curl http://localhost:5002/health
- Script still works offline with static help

## 🎓 Learning Outcomes

By completing all checkpoints:
- ✅ Understand virtual environments
- ✅ Create Flask web applications
- ✅ Use Tailwind CSS styling
- ✅ Integrate external APIs
- ✅ Debug common errors
- ✅ Follow professional workflows

## 📞 Support

- Issues: GitHub Issues tab
- Documentation: `docs/` folder
- Workshop prep: See `docs/SETUP_GUIDE.md`

## 📄 License

MIT License - Free for educational use

---

**Made with ❤️ for Flask learners**
