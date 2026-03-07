# Checkpoint 2 Solution: First Flask App

## Minimum Requirements

Your `app.py` should have:

1. **Flask import**:
   ```python
   from flask import Flask
   ```

2. **App instance**:
   ```python
   app = Flask(__name__)
   ```

3. **At least one route**:
   ```python
   @app.route('/')
   def home():
       return "Hello, Flask!"
   ```

4. **Main guard**:
   ```python
   if __name__ == '__main__':
       app.run(debug=True)
   ```

## Running Your App

```bash
# Make sure venv is activated
python app.py
```

Visit: http://localhost:5000

## Common Issues

### Import Error: No module named 'flask'

**Solution**: Activate venv and install Flask
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install Flask
```

### Address Already in Use (Port 5000)

**Solution**: Change the port
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)
```

### Template Not Found

**Solution**: Create `templates/` folder and put your HTML files there
```bash
mkdir templates
# Then create index.html inside templates/
```

## Testing

Validate with:
```bash
../workshop_check.sh 2
```

## What's Next?

Checkpoint 3: Add Tailwind CSS for beautiful styling!
