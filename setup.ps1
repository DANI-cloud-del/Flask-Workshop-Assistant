# ============================================================================
# Flask Workshop - Automated Setup Script (Windows PowerShell)
# ============================================================================
# This script sets up everything you need for the Flask workshop
# Usage: .\setup.ps1
# ============================================================================

$ErrorActionPreference = "Stop"

Write-Host "===================================================" -ForegroundColor Blue
Write-Host "  Flask Workshop - Automated Setup" -ForegroundColor Blue
Write-Host "===================================================" -ForegroundColor Blue
Write-Host ""

# Helper functions
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Error-Custom { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }

# Check Python installation
Write-Info "Checking Python installation..."
try {
    $pythonVersion = python --version 2>&1
    Write-Success "Found: $pythonVersion"
}
catch {
    Write-Error-Custom "Python is not installed!"
    Write-Host ""
    Write-Host "Please install Python from: https://www.python.org/downloads/"
    Write-Host "Make sure to check 'Add Python to PATH' during installation"
    exit 1
}
Write-Host ""

# Navigate to student workspace
Write-Info "Setting up student workspace..."
if (-not (Test-Path "student_workspace")) {
    New-Item -ItemType Directory -Path "student_workspace" -Force | Out-Null
    Write-Success "Created student_workspace folder"
}
else {
    Write-Success "student_workspace folder exists"
}

Set-Location student_workspace
Write-Host ""

# Create virtual environment
Write-Info "Creating virtual environment..."
if (Test-Path "venv") {
    Write-Warn "Virtual environment already exists, skipping..."
}
else {
    python -m venv venv
    if (Test-Path "venv") {
        Write-Success "Virtual environment created!"
    }
    else {
        Write-Error-Custom "Failed to create virtual environment"
        Set-Location ..
        exit 1
    }
}
Write-Host ""

# Check if virtual environment is activated
Write-Info "Checking virtual environment activation..."
if ($env:VIRTUAL_ENV) {
    Write-Success "Virtual environment is activated"
}
else {
    Write-Warn "Virtual environment not activated"
    Write-Host ""
    Write-Info "Activating virtual environment..."
    
    # Try to activate
    try {
        & ".\venv\Scripts\Activate.ps1"
        Write-Success "Virtual environment activated"
    }
    catch {
        Write-Warn "Could not auto-activate. You may need to run:"
        Write-Host "  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
        Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Yellow
        Write-Host ""
        Write-Info "Continuing with setup..."
    }
}
Write-Host ""

# Install Flask
Write-Info "Installing Flask..."
try {
    $null = python -c "import flask" 2>&1
    $flaskVersion = python -c "import flask; print(flask.__version__)" 2>&1
    Write-Success "Flask already installed: v$flaskVersion"
}
catch {
    Write-Info "Installing Flask (this may take a moment)..."
    pip install Flask | Out-Null
    $flaskVersion = python -c "import flask; print(flask.__version__)" 2>&1
    Write-Success "Flask installed: v$flaskVersion"
}
Write-Host ""

# Create project structure
Write-Info "Creating project structure..."

# Create templates folder
if (-not (Test-Path "templates")) {
    New-Item -ItemType Directory -Path "templates" -Force | Out-Null
    Write-Success "Created templates/ folder"
}
else {
    Write-Success "templates/ folder exists"
}

# Create static folder
if (-not (Test-Path "static")) {
    New-Item -ItemType Directory -Path "static" -Force | Out-Null
    Write-Success "Created static/ folder"
}
else {
    Write-Success "static/ folder exists"
}
Write-Host ""

# Create app.py if it doesn't exist
Write-Info "Creating Flask application..."
if (-not (Test-Path "app.py")) {
    $appContent = @'
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
'@
    Set-Content -Path "app.py" -Value $appContent
    Write-Success "Created app.py"
}
else {
    Write-Success "app.py already exists"
}

# Create index.html if it doesn't exist
Write-Info "Creating HTML template..."
if (-not (Test-Path "templates\index.html")) {
    $htmlContent = @'
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
'@
    Set-Content -Path "templates\index.html" -Value $htmlContent
    Write-Success "Created templates/index.html"
}
else {
    Write-Success "templates/index.html already exists"
}
Write-Host ""

# Test Flask import
Write-Info "Testing Flask installation..."
try {
    $null = python -c "import flask" 2>&1
    Write-Success "Flask is working correctly!"
}
catch {
    Write-Error-Custom "Flask test failed"
    Set-Location ..
    exit 1
}
Write-Host ""

# Final summary
Set-Location ..
Write-Host "===================================================" -ForegroundColor Green
Write-Host "  Setup Complete! " -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your Flask project is ready:" -ForegroundColor Cyan
Write-Host "  - Virtual environment: $(Get-Location)\student_workspace\venv"
Write-Host "  - Flask app: $(Get-Location)\student_workspace\app.py"
Write-Host "  - Templates: $(Get-Location)\student_workspace\templates\"
Write-Host "  - Static files: $(Get-Location)\student_workspace\static\"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Navigate to workspace:"
Write-Host "     cd student_workspace" -ForegroundColor Yellow
Write-Host ""
Write-Host "  2. Activate virtual environment (if not already active):"
Write-Host "     .\venv\Scripts\Activate.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "  3. Run your Flask app:"
Write-Host "     python app.py" -ForegroundColor Yellow
Write-Host ""
Write-Host "  4. Open browser:"
Write-Host "     http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
