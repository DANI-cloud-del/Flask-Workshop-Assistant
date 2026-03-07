# Checkpoint 1 Solution: Environment Setup

## What You Should Have

After passing Checkpoint 1:

```
student_workspace/
├── venv/              # Virtual environment
├── templates/         # Empty folder for HTML
└── static/            # Empty folder for assets
```

## Verification Commands

### Check Python
```bash
python3 --version
# or
python --version
```

### Check Virtual Environment
```bash
# Should see (venv) in your prompt
which python  # Unix/Mac
where python  # Windows
```

### Check Flask
```bash
python -c "import flask; print(flask.__version__)"
```

## Common Issues

### Issue: Virtual Environment Not Activating

**Windows**:
```bash
venv\Scripts\activate
```

**Ubuntu/Mac**:
```bash
source venv/bin/activate
```

### Issue: Flask Not Found

Make sure venv is activated, then:
```bash
pip install Flask
```

### Issue: Permission Denied on Script

```bash
chmod +x ../workshop_check.sh
```

## What's Next?

Once Checkpoint 1 passes, you're ready to create your Flask app in Checkpoint 2!
