#!/bin/bash

# ============================================================================
# Flask Workshop - Simple Setup Script
# ============================================================================
# Usage: ./setup.sh
# ============================================================================

set -e

echo "==================================================="
echo "  Flask Workshop - Quick Setup"
echo "==================================================="
echo ""

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

# Step 1: Check Python
echo -e "${CYAN}[1/5]${NC} Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 not found. Please install Python 3.8+"
    exit 1
fi
echo -e "${GREEN}✓${NC} Python found: $(python3 --version)"
echo ""

# Step 2: Create virtual environment
echo -e "${CYAN}[2/5]${NC} Creating virtual environment..."
if [ -d "venv" ]; then
    echo "Virtual environment already exists"
else
    python3 -m venv venv
    echo -e "${GREEN}✓${NC} Virtual environment created"
fi
echo ""

# Step 3: Activate and install Flask
echo -e "${CYAN}[3/5]${NC} Installing Flask..."
source venv/bin/activate
pip install --quiet Flask
echo -e "${GREEN}✓${NC} Flask installed"
echo ""

# Step 4: Create project structure
echo -e "${CYAN}[4/5]${NC} Creating project folders..."
mkdir -p templates
mkdir -p static
echo -e "${GREEN}✓${NC} Folders created (templates/, static/)"
echo ""

# Step 5: Create starter files
echo -e "${CYAN}[5/5]${NC} Creating starter files..."

# Create app.py
if [ ! -f "app.py" ]; then
cat > app.py << 'EOF'
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
EOF
echo -e "${GREEN}✓${NC} Created app.py"
else
echo "app.py already exists"
fi

# Create index.html
if [ ! -f "templates/index.html" ]; then
cat > templates/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flask Workshop</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="container mx-auto p-8">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h1 class="text-5xl font-bold text-blue-600 mb-4">Hello Flask!</h1>
            <p class="text-gray-700 text-lg mb-6">Welcome to your first Flask web application</p>
            
            <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p class="font-semibold text-green-700">Setup Complete!</p>
                <p class="text-green-600">Your development environment is ready</p>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center space-x-2">
                    <span class="text-2xl">✓</span>
                    <span class="text-gray-700">Flask installed</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-2xl">✓</span>
                    <span class="text-gray-700">Project structure created</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-2xl">✓</span>
                    <span class="text-gray-700">Tailwind CSS configured</span>
                </div>
            </div>
            
            <div class="mt-8 p-4 bg-blue-50 rounded-lg">
                <p class="font-semibold text-blue-700 mb-2">Next Steps:</p>
                <ol class="list-decimal list-inside space-y-1 text-blue-600">
                    <li>Edit app.py to add more routes</li>
                    <li>Customize this template in templates/index.html</li>
                    <li>Add CSS/JS files to static/ folder</li>
                    <li>Build something awesome!</li>
                </ol>
            </div>
        </div>
    </div>
</body>
</html>
EOF
echo -e "${GREEN}✓${NC} Created templates/index.html"
else
echo "templates/index.html already exists"
fi

echo ""
echo "==================================================="
echo -e "${GREEN}  Setup Complete!${NC}"
echo "==================================================="
echo ""
echo "Your Flask project is ready!"
echo ""
echo "To run your app:"
echo "  1. Activate virtual environment:"
echo "     source venv/bin/activate"
echo ""
echo "  2. Run Flask:"
echo "     python app.py"
echo ""
echo "  3. Open browser:"
echo "     http://localhost:5000"
echo ""
echo "==================================================="
