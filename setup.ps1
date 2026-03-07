# ============================================================================
# Flask Workshop - Simple Setup Script (Windows)
# ============================================================================
# Usage: .\setup.ps1
# ============================================================================

$ErrorActionPreference = "Continue"

Write-Host "===================================================" -ForegroundColor Blue
Write-Host "  Flask Workshop - Quick Setup" -ForegroundColor Blue
Write-Host "===================================================" -ForegroundColor Blue
Write-Host ""

# Step 1: Check Python
Write-Host "[1/5] Checking Python..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[OK] Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Create virtual environment
Write-Host "[2/5] Creating virtual environment..." -ForegroundColor Cyan
if (Test-Path "venv") {
    Write-Host "Virtual environment already exists"
}
else {
    python -m venv venv
    Write-Host "[OK] Virtual environment created" -ForegroundColor Green
}
Write-Host ""

# Step 3: Install Flask
Write-Host "[3/5] Installing Flask..." -ForegroundColor Cyan
if (Test-Path "venv\Scripts\Activate.ps1") {
    & ".\venv\Scripts\Activate.ps1"
    pip install --quiet Flask
    Write-Host "[OK] Flask installed" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] Virtual environment activation failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Create project structure
Write-Host "[4/5] Creating project folders..." -ForegroundColor Cyan
if (-not (Test-Path "templates")) { 
    New-Item -ItemType Directory -Path "templates" | Out-Null 
}
if (-not (Test-Path "static")) { 
    New-Item -ItemType Directory -Path "static" | Out-Null 
}
Write-Host "[OK] Folders created (templates/, static/)" -ForegroundColor Green
Write-Host ""

# Step 5: Create starter files
Write-Host "[5/5] Creating starter files..." -ForegroundColor Cyan

# Create app.py
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
    Set-Content -Path "app.py" -Value $appContent -Encoding UTF8
    Write-Host "[OK] Created app.py" -ForegroundColor Green
}
else {
    Write-Host "app.py already exists"
}

# Create index.html
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
                    <span class="text-2xl">OK</span>
                    <span class="text-gray-700">Flask installed</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-2xl">OK</span>
                    <span class="text-gray-700">Project structure created</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-2xl">OK</span>
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
'@
    Set-Content -Path "templates\index.html" -Value $htmlContent -Encoding UTF8
    Write-Host "[OK] Created templates/index.html" -ForegroundColor Green
}
else {
    Write-Host "templates/index.html already exists"
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your Flask project is ready!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run your app:"
Write-Host "  1. Activate virtual environment:" -ForegroundColor Yellow
Write-Host "     .\venv\Scripts\Activate.ps1"
Write-Host ""
Write-Host "  2. Run Flask:" -ForegroundColor Yellow  
Write-Host "     python app.py"
Write-Host ""
Write-Host "  3. Open browser:" -ForegroundColor Yellow
Write-Host "     http://localhost:5000"
Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
