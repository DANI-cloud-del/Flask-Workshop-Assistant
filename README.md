# Flask Workshop Assistant 🤖

An intelligent assistant for Flask web development workshops with automated setup and progressive validation.

## 🎯 Two Ways to Get Started

### Option 1: 🚀 Quick Setup (Recommended for Beginners)

**One command does everything!** Creates venv, installs Flask, generates starter code.

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

### Option 2: 🎯 Step-by-Step Validation (For Learning)

**Guided checkpoints** that teach Flask concepts progressively with auto-fix.

**Windows:**
```powershell
cd Flask-Workshop-Assistant
.\workshop_check.ps1 1  # Environment setup
# Activate venv, then:
.\workshop_check.ps1 2  # Flask app
.\workshop_check.ps1 3  # Tailwind CSS  
.\workshop_check.ps1 4  # AI integration
```

**Linux/Mac:**
```bash
cd Flask-Workshop-Assistant
./workshop_check.sh 1  # Environment setup
# Activate venv, then:
./workshop_check.sh 2  # Flask app
./workshop_check.sh 3  # Tailwind CSS
./workshop_check.sh 4  # AI integration
```

## ✨ Features

### 🚀 Automated Setup Scripts
- **One-command setup** - `setup.ps1` (Windows) or `setup.sh` (Linux/Mac)
- Creates complete Flask project structure
- Installs all dependencies automatically
- Generates working starter code

### ✅ Progressive Validation Scripts  
- **Checkpoint-based learning** - `workshop_check.ps1` / `workshop_check.sh`
- Real-time environment validation
- Auto-fix common issues
- Step-by-step guidance with colored output

### 🤖 AI Workshop Assistant (Optional)
- Context-aware help system
- Code examples and explanations
- Troubleshooting support
- Integration with student Flask apps

### 🎨 Modern Tech Stack
- Flask 3.x
- Tailwind CSS (via CDN)
- Groq API for AI features
- Clean, beginner-friendly code

## 📚 Workshop Structure

### Checkpoint 1: Environment Setup (15 mins)
- ✅ Python installation verified
- ✅ Virtual environment created & activated  
- ✅ Flask installed correctly
- ✅ Project folders created (templates/, static/)

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

## 📁 Project Structure

```
Flask-Workshop-Assistant/
├── setup.ps1                 # Automated setup (Windows)
├── setup.sh                  # Automated setup (Linux/Mac)
├── workshop_check.ps1        # Validation script (Windows)
├── workshop_check.sh         # Validation script (Linux/Mac)
├── workshop_assistant.py     # AI assistant server (optional)
├── requirements.txt          # Python dependencies
├── student_workspace/        # Where students work
│   ├── venv/                # Virtual environment (auto-created)
│   ├── app.py               # Flask application (auto-created)
│   ├── templates/           # HTML templates (auto-created)
│   │   └── index.html       # Starter template (auto-created)
│   └── static/              # CSS, JS, images (auto-created)
├── solutions/               # Reference solutions
└── docs/                    # Additional documentation
```

## 👨‍🏫 For Students

### First Time Setup

**Windows Users:**
1. Install Python from [python.org](https://www.python.org/downloads/)
   - ✅ Check "Add Python to PATH"
2. Open PowerShell  
3. Run:
   ```powershell
   git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
   cd Flask-Workshop-Assistant
   .\setup.ps1
   ```

**Mac/Linux Users:**
1. Install Python 3 (usually pre-installed)
2. Open Terminal
3. Run:
   ```bash
   git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
   cd Flask-Workshop-Assistant
   chmod +x setup.sh
   ./setup.sh
   ```

### Running Your Flask App

```powershell
# Windows:
cd student_workspace
.\venv\Scripts\Activate.ps1
python app.py
```

```bash
# Linux/Mac:
cd student_workspace
source venv/bin/activate
python app.py
```

Then open: **http://localhost:5000**

### Common Issues

**Windows Execution Policy Error:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Python Not Found:**
- Make sure Python is installed
- Check "Add to PATH" was selected during installation
- Restart PowerShell/Terminal

**Port 5000 Already in Use:**
Change port in `app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Changed from 5000
```

## 🎯 For Instructors

### Workshop Flow Options

**Option A: Fast Start (30 minutes)**
1. Students run `setup.ps1`/`setup.sh` (5 min)
2. Explain Flask basics (10 min)
3. Students customize their app (15 min)

**Option B: Learning Path (90 minutes)**
1. Checkpoint 1: Environment (15 min)
2. Checkpoint 2: First Flask app (20 min)
3. Checkpoint 3: Styling with Tailwind (20 min)
4. Checkpoint 4: AI integration (20 min)
5. Q&A and customization (15 min)

### Running the AI Assistant (Optional)

1. **Setup:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. **Configure:**
   ```bash
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

3. **Start:**
   ```bash
   python workshop_assistant.py
   ```

   The assistant runs on: **http://localhost:5002**

### Best Practices

✅ **Tell students to clone to a LOCAL folder** (not OneDrive/Desktop)
```powershell
# Good:
C:\Workshop\Flask-Workshop-Assistant

# Bad (OneDrive interferes with venv):
C:\Users\Name\OneDrive\Desktop\Flask-Workshop-Assistant
```

✅ **Run scripts from repo root**, not from student_workspace
```powershell
# Correct:
cd Flask-Workshop-Assistant
.\setup.ps1

# Wrong:
cd Flask-Workshop-Assistant\student_workspace  
..\setup.ps1
```

## 📚 Documentation

- [Windows Setup Guide](WINDOWS_SETUP.md) - Detailed Windows instructions
- [Quick Start Guide](QUICKSTART.md) - Fast track for experienced users
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

## ⚙️ Requirements

### For All Students:
- Python 3.8+
- Git (for cloning)
- Internet connection (for package installation)

### For AI Assistant (Optional):
- Groq API key (free at [groq.com](https://groq.com))
- Flask-CORS
- Python-dotenv

## 🛠️ Technologies Used

- **Backend:** Flask 3.x
- **Frontend:** HTML5, Tailwind CSS
- **AI:** Groq API (Llama models)
- **Scripting:** PowerShell, Bash
- **Development:** Python virtual environments

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Test your changes
4. Submit a pull request

## 📜 License

MIT License - free for educational use!

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/DANI-cloud-del/Flask-Workshop-Assistant/issues)
- Discussions: [Ask questions](https://github.com/DANI-cloud-del/Flask-Workshop-Assistant/discussions)

## 🎓 Learning Outcomes

By completing all checkpoints, students will:
- ✅ Understand Python virtual environments
- ✅ Create Flask web applications
- ✅ Use Tailwind CSS for styling
- ✅ Integrate external APIs
- ✅ Debug common errors
- ✅ Follow professional development workflows

---

## 🚀 Quick Commands Reference

```bash
# SETUP
./setup.sh          # Linux/Mac automated setup
.\setup.ps1         # Windows automated setup

# VALIDATION
./workshop_check.sh 1   # Linux/Mac checkpoint 1
.\workshop_check.ps1 1  # Windows checkpoint 1

# RUN FLASK APP
cd student_workspace
python app.py

# RUN AI ASSISTANT (Optional)
python workshop_assistant.py
```

---

**🎉 Ready to start? Choose your setup method above and let's build something awesome!**

Built with ❤️ for Flask learners everywhere.
