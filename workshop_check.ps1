# ============================================================================
# Flask Workshop - Checkpoint Validator for Windows PowerShell
# ============================================================================
# Usage: .\workshop_check.ps1 1
# ============================================================================

param(
    [int]$Checkpoint = 1,
    [switch]$ManualMode = $false
)

$ErrorActionPreference = "Stop"

# Configuration
$WORKSPACE = "student_workspace"
$AUTO_FIX = -not $ManualMode

# Color functions
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error-Custom { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Warning-Custom { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }

function Print-Header {
    Write-Host "╭────────────────────────────────────────────────────╮" -ForegroundColor Blue
    Write-Host "│  Flask Workshop - Checkpoint $Checkpoint Validator          │" -ForegroundColor Blue
    Write-Host "╰────────────────────────────────────────────────────╯" -ForegroundColor Blue
    Write-Host ""
}

function Prompt-Fix {
    param($message)
    
    if ($AUTO_FIX) {
        Write-Info "Auto-fix enabled. Fixing..."
        return $true
    }
    
    $response = Read-Host "Fix this automatically? (y/N)"
    return $response -eq 'y' -or $response -eq 'Y'
}

function Show-OfflineHelp {
    param($error)
    
    Write-Host ""
    Write-Host "📚 Offline Help:" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────────────"
    
    if ($error -match "flask|module") {
        Write-Host @"
Problem: Flask not installed in virtual environment

Windows Fix:
1. .\venv\Scripts\Activate.ps1
2. pip install Flask
3. python -c "import flask; print('OK')"

If activation fails (execution policy):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
"@
    }
    elseif ($error -match "port") {
        Write-Host @"
Problem: Port 5000 already in use

Fix: Change port in app.py:
  app.run(debug=True, port=5001)
"@
    }
    else {
        Write-Host "Raise your hand for instructor help!"
    }
    
    Write-Host "─────────────────────────────────────────────────────"
    Write-Host ""
}

# ============================================================================
# CHECKPOINT 1: ENVIRONMENT SETUP
# ============================================================================

function Check-Checkpoint1 {
    Print-Header
    Write-Info "Checking your environment setup..."
    Write-Host ""
    
    $allPassed = $true
    
    # Navigate to workspace
    if (-not (Test-Path $WORKSPACE)) {
        Write-Error-Custom "workspace folder not found"
        New-Item -ItemType Directory -Path $WORKSPACE -Force | Out-Null
        Write-Success "Created workspace folder"
    }
    
    Set-Location $WORKSPACE
    
    # Check 1: Python
    Write-Host "📋 Check 1/6: Python Installation"
    try {
        $pythonVersion = python --version 2>&1
        Write-Success "Python found: $pythonVersion"
    }
    catch {
        Write-Error-Custom "Python not found"
        Write-Host ""
        Write-Info "Download Python from: https://www.python.org/downloads/"
        Write-Info "Make sure to check 'Add Python to PATH' during installation"
        $allPassed = $false
        Set-Location ..
        return $false
    }
    Write-Host ""
    
    # Check 2: Virtual environment
    Write-Host "📋 Check 2/6: Virtual Environment"
    if (Test-Path "venv") {
        Write-Success "Virtual environment found"
    }
    else {
        Write-Error-Custom "Virtual environment not found"
        
        if (Prompt-Fix) {
            Write-Info "Creating virtual environment..."
            try {
                python -m venv venv
                if (Test-Path "venv") {
                    Write-Success "Virtual environment created!"
                }
                else {
                    Write-Error-Custom "Failed to create venv"
                    $allPassed = $false
                }
            }
            catch {
                Write-Error-Custom "Failed to create venv: $_"
                $allPassed = $false
            }
        }
        else {
            $allPassed = $false
        }
    }
    Write-Host ""
    
    # Check 3: Virtual environment activation
    Write-Host "📋 Check 3/6: Virtual Environment Activation"
    if ($env:VIRTUAL_ENV) {
        Write-Success "Virtual environment is activated"
    }
    else {
        Write-Warning-Custom "Virtual environment not activated"
        Write-Host ""
        Write-Info "To activate:"
        Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Yellow
        Write-Host ""
        Write-Info "If you get an error about execution policy:"
        Write-Host "  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
        Write-Host ""
        Write-Info "After activating, run this script again"
        Set-Location ..
        return $false
    }
    Write-Host ""
    
    # Check 4: Flask installed
    Write-Host "📋 Check 4/6: Flask Installation"
    try {
        $null = python -c "import flask" 2>&1
        $flaskVersion = python -c "import flask; print(flask.__version__)" 2>&1
        Write-Success "Flask installed: v$flaskVersion"
    }
    catch {
        Write-Error-Custom "Flask not installed"
        
        if (Prompt-Fix) {
            Write-Info "Installing Flask..."
            try {
                pip install Flask
                $null = python -c "import flask" 2>&1
                Write-Success "Flask installed successfully!"
            }
            catch {
                Write-Error-Custom "Installation failed"
                Show-OfflineHelp "flask install failed"
                $allPassed = $false
            }
        }
        else {
            $allPassed = $false
        }
    }
    Write-Host ""
    
    # Check 5: Project structure
    Write-Host "📋 Check 5/6: Project Structure"
    $missingDirs = @()
    
    if (-not (Test-Path "templates")) { $missingDirs += "templates" }
    if (-not (Test-Path "static")) { $missingDirs += "static" }
    
    if ($missingDirs.Count -eq 0) {
        Write-Success "Project structure correct"
    }
    else {
        Write-Error-Custom "Missing: $($missingDirs -join ', ')"
        
        if (Prompt-Fix) {
            foreach ($dir in $missingDirs) {
                New-Item -ItemType Directory -Path $dir -Force | Out-Null
                Write-Success "Created: $dir/"
            }
        }
        else {
            $allPassed = $false
        }
    }
    Write-Host ""
    
    # Check 6: Git
    Write-Host "📋 Check 6/6: Git Repository"
    if (Test-Path ".git") {
        Write-Success "Git repository initialized"
    }
    else {
        Write-Warning-Custom "Not a git repo (optional)"
    }
    Write-Host ""
    
    # Final verdict
    if ($allPassed) {
        Write-Host "╭────────────────────────────────────────────────────╮" -ForegroundColor Green
        Write-Host "│  ✅ CHECKPOINT 1 PASSED!                          │" -ForegroundColor Green
        Write-Host "│  Ready for Checkpoint 2                            │" -ForegroundColor Green
        Write-Host "╰────────────────────────────────────────────────────╯" -ForegroundColor Green
        Write-Host ""
        Write-Info "Next: .\workshop_check.ps1 2"
        Set-Location ..
        return $true
    }
    else {
        Write-Host "❌ CHECKPOINT 1 INCOMPLETE" -ForegroundColor Red
        Set-Location ..
        return $false
    }
}

# ============================================================================
# CHECKPOINT 2: FIRST FLASK APP
# ============================================================================

function Check-Checkpoint2 {
    Print-Header
    Write-Info "Checking your Flask app..."
    Write-Host ""
    
    if (-not (Test-Path $WORKSPACE)) {
        Write-Error-Custom "Please run checkpoint 1 first"
        return $false
    }
    
    Set-Location $WORKSPACE
    $allPassed = $true
    
    # Check 1: app.py exists
    Write-Host "📋 Check 1/5: app.py File"
    if (Test-Path "app.py") {
        Write-Success "app.py found"
    }
    else {
        Write-Error-Custom "app.py not found"
        
        if (Prompt-Fix) {
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
            Write-Success "Created basic app.py"
        }
        else {
            $allPassed = $false
        }
    }
    Write-Host ""
    
    # Check 2: Syntax
    Write-Host "📋 Check 2/5: Python Syntax"
    if (Test-Path "app.py") {
        try {
            python -m py_compile app.py 2>&1 | Out-Null
            Write-Success "Syntax is valid"
        }
        catch {
            Write-Error-Custom "Syntax errors found"
            $allPassed = $false
        }
    }
    Write-Host ""
    
    # Check 3: Flask import
    Write-Host "📋 Check 3/5: Flask Import"
    $appContent = Get-Content "app.py" -Raw
    if ($appContent -match "from flask import Flask" -or $appContent -match "import flask") {
        Write-Success "Flask import found"
    }
    else {
        Write-Error-Custom "Flask not imported"
        $allPassed = $false
    }
    Write-Host ""
    
    # Check 4: Route
    Write-Host "📋 Check 4/5: Route Definition"
    if ($appContent -match "@app\.route") {
        Write-Success "Route found"
    }
    else {
        Write-Error-Custom "No routes defined"
        $allPassed = $false
    }
    Write-Host ""
    
    # Check 5: Can run
    Write-Host "📋 Check 5/5: App Runnable"
    Write-Info "Testing if app starts (5 sec test)..."
    
    $job = Start-Job -ScriptBlock {
        param($workspace)
        Set-Location $workspace
        python app.py 2>&1
    } -ArgumentList (Get-Location).Path
    
    Start-Sleep -Seconds 3
    
    if ($job.State -eq "Running") {
        Write-Success "App starts successfully"
        Stop-Job $job
        Remove-Job $job
    }
    else {
        Write-Error-Custom "App failed to start"
        $allPassed = $false
    }
    Write-Host ""
    
    if ($allPassed) {
        Write-Host "✅ CHECKPOINT 2 PASSED!" -ForegroundColor Green
        Write-Info "Next: .\workshop_check.ps1 3"
        Set-Location ..
        return $true
    }
    else {
        Write-Host "❌ CHECKPOINT 2 INCOMPLETE" -ForegroundColor Red
        Set-Location ..
        return $false
    }
}

# ============================================================================
# CHECKPOINT 3: TAILWIND CSS
# ============================================================================

function Check-Checkpoint3 {
    Print-Header
    Write-Info "Checking Tailwind CSS integration..."
    Write-Host ""
    
    if (-not (Test-Path $WORKSPACE)) {
        Set-Location ..
        return $false
    }
    
    Set-Location $WORKSPACE
    $allPassed = $true
    $templateFile = ""
    
    # Check 1: Template exists
    Write-Host "📋 Check 1/4: HTML Template"
    if (Test-Path "templates\index.html") {
        $templateFile = "templates\index.html"
        Write-Success "Template found"
    }
    elseif (Test-Path "templates\base.html") {
        $templateFile = "templates\base.html"
        Write-Success "Template found"
    }
    else {
        Write-Error-Custom "No template found"
        
        if (Prompt-Fix) {
            $htmlContent = @'
<!DOCTYPE html>
<html>
<head>
    <title>Flask Workshop</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-8">
        <h1 class="text-4xl font-bold text-blue-600">Hello Flask!</h1>
        <p class="mt-4 text-gray-700">Welcome to the workshop</p>
    </div>
</body>
</html>
'@
            Set-Content -Path "templates\index.html" -Value $htmlContent
            $templateFile = "templates\index.html"
            Write-Success "Created template with Tailwind"
        }
        else {
            $allPassed = $false
        }
    }
    Write-Host ""
    
    # Check 2: Tailwind CDN
    Write-Host "📋 Check 2/4: Tailwind CDN"
    if ($templateFile -and (Test-Path $templateFile)) {
        $htmlContent = Get-Content $templateFile -Raw
        if ($htmlContent -match "cdn\.tailwindcss\.com") {
            Write-Success "Tailwind CDN found"
        }
        else {
            Write-Error-Custom "Tailwind CDN not found"
            $allPassed = $false
        }
    }
    Write-Host ""
    
    # Check 3: Utility classes
    Write-Host "📋 Check 3/4: Tailwind Classes"
    if ($templateFile -and (Test-Path $templateFile)) {
        $htmlContent = Get-Content $templateFile -Raw
        $utilityMatches = ([regex]::Matches($htmlContent, "(bg-|text-|p-|m-|flex|grid)")).Count
        
        if ($utilityMatches -gt 3) {
            $classCount = $utilityMatches
            Write-Success "Using Tailwind utilities: $classCount classes"
        }
        else {
            Write-Warning-Custom "Few utility classes found"
        }
    }
    Write-Host ""
    
    # Check 4: Hover effects
    Write-Host "📋 Check 4/4: Interactive Features"
    if ($templateFile -and (Test-Path $templateFile)) {
        $htmlContent = Get-Content $templateFile -Raw
        if ($htmlContent -match "hover:") {
            Write-Success "Hover effects found"
        }
        else {
            Write-Warning-Custom "No hover effects (optional)"
        }
    }
    Write-Host ""
    
    if ($allPassed) {
        Write-Host "✅ CHECKPOINT 3 PASSED!" -ForegroundColor Green
        Write-Info "Next: .\workshop_check.ps1 4"
        Set-Location ..
        return $true
    }
    else {
        Write-Host "❌ CHECKPOINT 3 INCOMPLETE" -ForegroundColor Red
        Set-Location ..
        return $false
    }
}

# ============================================================================
# CHECKPOINT 4: AI INTEGRATION
# ============================================================================

function Check-Checkpoint4 {
    Print-Header
    Write-Info "Checking AI integration..."
    Write-Host ""
    
    if (-not (Test-Path $WORKSPACE)) {
        return $false
    }
    
    Set-Location $WORKSPACE
    
    # Check .env
    Write-Host "📋 Check 1/3: Environment Variables"
    if (Test-Path ".env") {
        Write-Success ".env file found"
        
        $envContent = Get-Content ".env" -Raw
        if ($envContent -match "GROQ_API_KEY") {
            Write-Success "GROQ_API_KEY configured"
        }
        else {
            Write-Warning-Custom "GROQ_API_KEY not set"
        }
    }
    else {
        Write-Warning-Custom ".env not found (optional)"
    }
    Write-Host ""
    
    # Check AI route
    Write-Host "📋 Check 2/3: AI Endpoint"
    if (Test-Path "app.py") {
        $appContent = Get-Content "app.py" -Raw
        if ($appContent -match "/api/chat") {
            Write-Success "Chat endpoint found"
        }
        else {
            Write-Warning-Custom "No chat endpoint"
        }
    }
    Write-Host ""
    
    Write-Host "🎉 ALL CHECKPOINTS COMPLETE!" -ForegroundColor Green
    Write-Host ""
    Write-Info "Congratulations! Your Flask app is ready."
    Set-Location ..
    return $true
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

if ($Checkpoint -lt 1 -or $Checkpoint -gt 4) {
    Write-Host "Usage: .\workshop_check.ps1 [1-4]" -ForegroundColor Red
    Write-Host "Example: .\workshop_check.ps1 1"
    exit 1
}

switch ($Checkpoint) {
    1 { Check-Checkpoint1 }
    2 { Check-Checkpoint2 }
    3 { Check-Checkpoint3 }
    4 { Check-Checkpoint4 }
}
