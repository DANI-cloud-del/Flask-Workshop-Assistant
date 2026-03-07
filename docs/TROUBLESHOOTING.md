# Troubleshooting Guide 🔧

## Quick Reference

| Problem | Quick Fix |
|---------|----------|
| Script won't run | `chmod +x workshop_check.sh` |
| Flask not found | Activate venv, `pip install Flask` |
| Port in use | Change port in app.py to 5001 |
| Template not found | Create `templates/` folder |
| venv won't activate | Check command for your OS |

## Detailed Solutions

### Environment Issues

#### Problem: "python: command not found"

**Diagnosis**: Python not installed

**Solution**:
```bash
# Ubuntu
sudo apt update
sudo apt install python3 python3-pip

# Windows
# Download from python.org
```

#### Problem: "No module named 'flask'"

**Diagnosis**: Flask not installed OR venv not activated

**Solution**:
```bash
# Check if venv is activated (should see (venv) in prompt)
# If not activated:

# Windows:
venv\Scripts\activate

# Ubuntu:
source venv/bin/activate

# Then install:
pip install Flask
```

#### Problem: "venv activation does nothing"

**Diagnosis**: Wrong command for your OS

**Solution**:
```bash
# Try these in order:

# Unix/Mac/Git Bash:
source venv/bin/activate

# Windows CMD:
venv\Scripts\activate.bat

# Windows PowerShell:
venv\Scripts\Activate.ps1

# If PowerShell fails (execution policy):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Script Issues

#### Problem: "Permission denied: ./workshop_check.sh"

**Diagnosis**: Script not executable

**Solution**:
```bash
chmod +x workshop_check.sh

# Or run with bash:
bash workshop_check.sh 1
```

#### Problem: "bash: ./workshop_check.sh: No such file"

**Diagnosis**: Wrong directory

**Solution**:
```bash
# Make sure you're in Flask-Workshop-Assistant folder
pwd  # Should show .../Flask-Workshop-Assistant

# If in student_workspace:
cd ..
./workshop_check.sh 1
```

#### Problem: "Line endings" or "\r command not found"

**Diagnosis**: Windows line endings on Unix system

**Solution**:
```bash
# Convert line endings:
sed -i 's/\r$//' workshop_check.sh

# Or use dos2unix:
sudo apt install dos2unix
dos2unix workshop_check.sh
```

### Flask App Issues

#### Problem: "Address already in use" (Port 5000)

**Diagnosis**: Another Flask app or process using port 5000

**Solution**:
```python
# In app.py, change:
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Use different port
```

**Or kill the other process**:
```bash
# Ubuntu:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### Problem: "TemplateNotFound: index.html"

**Diagnosis**: HTML file not in `templates/` folder

**Solution**:
```bash
# Check structure:
ls templates/
# Should show: index.html

# If missing:
mkdir templates
# Create index.html inside templates/
```

#### Problem: "Static file not loading (CSS/JS)"

**Diagnosis**: File not in `static/` folder or wrong path

**Solution**:
```html
<!-- Use Flask url_for: -->
<link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
```

```bash
# Check structure:
ls static/
# File should be: static/style.css
```

#### Problem: "werkzeug.routing.BuildError"

**Diagnosis**: Route doesn't exist

**Solution**:
```python
# Make sure route is defined:
@app.route('/about')  # Must match URL
def about():
    return "About page"
```

### Syntax Issues

#### Problem: "IndentationError"

**Diagnosis**: Mixed tabs/spaces or wrong indentation

**Solution**:
```python
# Use consistent indentation (4 spaces recommended)
from flask import Flask

app = Flask(__name__)

@app.route('/')  # No indentation
def home():      # No indentation
    return "Hi"  # 4 spaces
```

#### Problem: "SyntaxError: invalid syntax"

**Diagnosis**: Typo or missing character

**Solution**:
```bash
# Run validation to see exact error:
python -m py_compile app.py

# Common issues:
# - Missing colon: def home() <- add :
# - Unclosed quote: return "hello <- add closing "
# - Missing parenthesis: print("hi" <- add )
```

### Import Issues

#### Problem: "ImportError: cannot import name 'Flask'"

**Diagnosis**: Typo in import

**Solution**:
```python
# Correct:
from flask import Flask

# NOT:
from Flask import Flask  # Capital F wrong
import Flask  # This is different
```

#### Problem: "circular import"

**Diagnosis**: Files importing each other

**Solution**:
Restructure code to avoid circular dependencies. For beginners, keep everything in one `app.py` file.

### Tailwind Issues

#### Problem: "Tailwind classes not working"

**Diagnosis**: CDN not loaded or typo in class name

**Solution**:
```html
<!-- Make sure CDN is in <head>: -->
<head>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<!-- Check class names (no typos): -->
<div class="bg-blue-500">  <!-- Correct -->
<div class="background-blue-500">  <!-- Wrong -->
```

#### Problem: "Hover effects not working"

**Diagnosis**: Missing hover: prefix

**Solution**:
```html
<!-- Correct: -->
<button class="bg-blue-600 hover:bg-blue-700">

<!-- Wrong: -->
<button class="bg-blue-600 bg-blue-700">  <!-- No hover: -->
```

### Git Issues

#### Problem: "fatal: not a git repository"

**Diagnosis**: Not in git repo or git not initialized

**Solution**:
```bash
# Initialize git:
git init

# Or clone the repo:
git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
```

#### Problem: "Permission denied (publickey)"

**Diagnosis**: SSH key not set up

**Solution**:
```bash
# Use HTTPS instead:
git clone https://github.com/DANI-cloud-del/Flask-Workshop-Assistant.git
```

### Validation Script Issues

#### Problem: "Checkpoint passes but app doesn't work"

**Diagnosis**: Basic structure is correct but logic has issues

**Solution**:
- Check browser console for errors
- Check terminal for Flask errors
- Compare with solution code in `solutions/`

#### Problem: "Script says venv activated but it's not"

**Diagnosis**: Script detects $VIRTUAL_ENV variable

**Solution**:
```bash
# Deactivate and reactivate:
deactivate
source venv/bin/activate  # or venv\Scripts\activate

# Verify:
which python  # Should point to venv/bin/python
```

## Still Stuck?

### Debug Checklist

- [ ] Activated virtual environment?
- [ ] Installed Flask? (`pip list | grep Flask`)
- [ ] Correct folder? (`pwd` shows right location)
- [ ] No typos in code?
- [ ] Saved file before running?
- [ ] Read error message carefully?

### Get Help

1. **Read the error message** - It usually tells you what's wrong
2. **Check solutions folder** - See reference implementations
3. **Run validation again** - `./workshop_check.sh [N]`
4. **Ask instructor** - Raise your hand
5. **Pair with neighbor** - Two heads better than one

## Error Message Decoder

### "ModuleNotFoundError"
= Package not installed → `pip install <package>`

### "NameError: name 'X' is not defined"
= Variable doesn't exist → Check spelling or define it

### "AttributeError"
= Object doesn't have that property → Check documentation

### "TypeError"
= Wrong type of data → Check if you're passing string vs number

### "FileNotFoundError"
= File doesn't exist → Check path and file name

### "KeyError"
= Dictionary key doesn't exist → Check key spelling

---

**Remember**: Errors are normal! They're how we learn. 🙌
