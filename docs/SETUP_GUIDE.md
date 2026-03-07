# Workshop Setup Guide for Instructors 🏭

## Pre-Workshop Preparation

### 1. Get Your API Key

1. Visit https://console.groq.com
2. Sign up/login
3. Create API key
4. Copy key (you'll need this)

**Note**: Free tier gives 14,400 requests/day (plenty for workshops)

### 2. Test the System

```bash
# Clone the repo
git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
cd Flask-Workshop-Assistant

# Set up environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Configure .env
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Test validation script
chmod +x workshop_check.sh
./workshop_check.sh 1

# Test AI assistant (optional)
python workshop_assistant.py
```

### 3. Prepare Materials

**For students**:
- [ ] GitHub repo URL written on board
- [ ] Workshop WiFi credentials (if using network mode)
- [ ] Printed troubleshooting guide (optional)

**For you**:
- [ ] Laptop charged
- [ ] Backup slides/notes
- [ ] Solution code ready

## Workshop Day Setup

### Simple Mode (Recommended for First Workshop)

**Students work independently**:
1. Clone repo
2. Run validation scripts
3. Build their Flask apps
4. You walk around helping

**No network setup needed!**

### Advanced Mode (With AI Assistant)

**If venue WiFi is reliable**:

1. **Find your IP**:
   ```bash
   # Windows
   ipconfig
   
   # Ubuntu
   ip addr show
   
   # Look for 192.168.x.x address
   ```

2. **Start AI assistant**:
   ```bash
   python workshop_assistant.py
   # Should start on port 5002
   ```

3. **Test from phone**:
   - Connect to same WiFi
   - Open: `http://YOUR-IP:5002/health`
   - Should see: `{"status": "running"}`

4. **Tell students your IP**:
   - Write on board: "AI Assistant: 192.168.1.100:5002"
   - Update in workshop_check.sh if needed

## During Workshop

### Opening (10 mins)

1. **Introduction**
   - What is Flask?
   - What we'll build today
   - How validation works

2. **Setup check**
   ```bash
   # Everyone runs together
   git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
   cd Flask-Workshop-Assistant
   ./workshop_check.sh 1
   ```

3. **Troubleshoot any issues**

### Teaching Flow

**For each checkpoint**:

1. **Explain concept** (5-10 mins)
   - Show slides/demo
   - Explain what they'll build

2. **Students implement** (15-20 mins)
   - Write code
   - Run validation: `./workshop_check.sh [N]`
   - Fix errors

3. **Help struggling students**
   - Check their error messages
   - Point to solutions folder
   - Pair struggling students together

4. **Move to next checkpoint** when ~70% complete

## Common Issues & Solutions

### Students Can't Clone Repo

**Issue**: Git not installed or configured

**Solution**:
```bash
# Download ZIP instead
wget https://github.com/DANI-cloud-del/Flask-Workshop-Assistant/archive/refs/heads/main.zip
unzip main.zip
cd Flask-Workshop-Assistant-main
```

### Virtual Environment Won't Activate

**Windows**:
```bash
# Try:
venv\Scripts\activate

# If fails, use:
python -m venv venv --clear
venv\Scripts\activate
```

**Ubuntu**:
```bash
# Try:
source venv/bin/activate

# If fails:
python3 -m venv venv --clear
source venv/bin/activate
```

### Flask Won't Install

```bash
# Check pip
pip --version

# Upgrade pip
pip install --upgrade pip

# Try again
pip install Flask
```

### Script Permission Denied

```bash
chmod +x workshop_check.sh

# Or run with bash
bash workshop_check.sh 1
```

### Port 5000 Already in Use

**In app.py**:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change port
```

## Troubleshooting Decision Tree

```
Student raises hand
│
├─ Environment issue (venv, Flask)?
│  └─ Check validation script output
│     └─ Follow error message instructions
│
├─ Code not working?
│  ├─ Syntax error? → Check validation output
│  ├─ Logic error? → Show solution code
│  └─ Import error? → Check venv activated
│
└─ Validation passing but confused?
   └─ Explain concept, show example
```

## Backup Plans

### If WiFi Fails
- ✅ Scripts work offline
- ✅ Static error help embedded
- ✅ Solution code in repo
- ✅ You help manually

### If Laptop Crashes
- ✅ Students continue independently
- ✅ Validation still works
- ✅ Switch to backup laptop

### If Running Behind
- ✅ Skip Checkpoint 4 (advanced)
- ✅ Focus on 1-3 (core concepts)
- ✅ Share solution code for homework

## Post-Workshop

### Collect Feedback
- What worked well?
- What was confusing?
- Pace too fast/slow?
- Technical issues?

### Follow-up Resources
- Share solution code
- Provide learning links
- Optional homework challenges

## Time Management

**Total: 90 minutes**

- 00:00 - 00:10: Introduction & Setup (10m)
- 00:10 - 00:25: Checkpoint 1 (15m)
- 00:25 - 00:45: Checkpoint 2 (20m)
- 00:45 - 00:50: Break (5m)
- 00:50 - 01:10: Checkpoint 3 (20m)
- 01:10 - 01:25: Checkpoint 4 (15m)
- 01:25 - 01:30: Q&A & Wrap-up (5m)

**Adjust based on your workshop length!**

## Success Metrics

**Successful workshop if**:
- ✅ 80%+ complete Checkpoint 1-2
- ✅ 60%+ complete Checkpoint 3
- ✅ Students can explain Flask basics
- ✅ Students excited to learn more

**Don't worry about**:
- ❌ Everyone finishing all checkpoints
- ❌ Perfect code from everyone
- ❌ Zero technical issues

## Tips for Success

1. **Start simple**: Don't add complexity early
2. **Live code**: Show mistakes and debugging
3. **Encourage questions**: No question is dumb
4. **Pair programming**: Pair advanced with beginners
5. **Celebrate progress**: Acknowledge completions
6. **Be patient**: First web app is hard!
7. **Have fun**: Energy is contagious 😄

---

Good luck with your workshop! 🚀
