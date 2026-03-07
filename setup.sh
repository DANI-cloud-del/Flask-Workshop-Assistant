#!/bin/bash

# ============================================================================
# Flask Workshop - Automated Setup Script (Linux/Mac)
# ============================================================================
# This script sets up everything you need for the Flask workshop
# Usage: ./setup.sh
# ============================================================================

set -e  # Exit on any error

echo "==================================================="
echo "  Flask Workshop - Automated Setup"
echo "==================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_success() { echo -e "${GREEN}[OK]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_info() { echo -e "${CYAN}[INFO]${NC} $1"; }
print_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# Check Python installation
print_info "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed!"
    echo "Please install Python 3 from: https://www.python.org/downloads/"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
print_success "Found: $PYTHON_VERSION"
echo ""

# Navigate to student workspace
print_info "Setting up student workspace..."
if [ ! -d "student_workspace" ]; then
    mkdir -p student_workspace
    print_success "Created student_workspace folder"
else
    print_success "student_workspace folder exists"
fi

cd student_workspace
echo ""

# Create virtual environment
print_info "Creating virtual environment..."
if [ -d "venv" ]; then
    print_warn "Virtual environment already exists, skipping..."
else
    python3 -m venv venv
    if [ -d "venv" ]; then
        print_success "Virtual environment created!"
    else
        print_error "Failed to create virtual environment"
        exit 1
    fi
fi
echo ""

# Activate virtual environment
print_info "Activating virtual environment..."
source venv/bin/activate
print_success "Virtual environment activated"
echo ""

# Install Flask
print_info "Installing Flask..."
if python -c "import flask" 2>/dev/null; then
    FLASK_VERSION=$(python -c "import flask; print(flask.__version__)")
    print_success "Flask already installed: v$FLASK_VERSION"
else
    pip install --quiet Flask
    FLASK_VERSION=$(python -c "import flask; print(flask.__version__)")
    print_success "Flask installed: v$FLASK_VERSION"
fi
echo ""

# Create project structure
print_info "Creating project structure..."

# Create templates folder
if [ ! -d "templates" ]; then
    mkdir templates
    print_success "Created templates/ folder"
else
    print_success "templates/ folder exists"
fi

# Create static folder
if [ ! -d "static" ]; then
    mkdir static
    print_success "Created static/ folder"
else
    print_success "static/ folder exists"
fi
echo ""

# Create app.py if it doesn't exist
print_info "Creating Flask application..."
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
    print_success "Created app.py"
else
    print_success "app.py already exists"
fi

# Create index.html if it doesn't exist
print_info "Creating HTML template..."
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
<body class="bg-gray-100">
    <div class="container mx-auto p-8">
        <h1 class="text-4xl font-bold text-blue-600 mb-4">Hello Flask!</h1>
        <p class="text-gray-700 text-lg">Welcome to the Flask Workshop</p>
        
        <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-2">You're all set!</h2>
            <p class="text-gray-600">Your Flask app is running successfully.</p>
        </div>
    </div>
</body>
</html>
EOF
    print_success "Created templates/index.html"
else
    print_success "templates/index.html already exists"
fi
echo ""

# Test Flask import
print_info "Testing Flask installation..."
if python -c "import flask; print('Flask OK')" &>/dev/null; then
    print_success "Flask is working correctly!"
else
    print_error "Flask test failed"
    exit 1
fi
echo ""

# Final summary
echo "==================================================="
echo -e "${GREEN}  Setup Complete! ${NC}"
echo "==================================================="
echo ""
echo "Your Flask project is ready:"
echo "  - Virtual environment: $(pwd)/venv"
echo "  - Flask app: $(pwd)/app.py"
echo "  - Templates: $(pwd)/templates/"
echo "  - Static files: $(pwd)/static/"
echo ""
echo "Next steps:"
echo "  1. Make sure virtual environment is activated:"
echo "     source venv/bin/activate"
echo ""
echo "  2. Run your Flask app:"
echo "     python app.py"
echo ""
echo "  3. Open browser:"
echo "     http://localhost:5000"
echo ""
echo "==================================================="
echo ""
