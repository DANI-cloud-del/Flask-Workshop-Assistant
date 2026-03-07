#!/bin/bash

# ============================================================================
# Flask Workshop - Intelligent Checkpoint Validator & Auto-Healer
# ============================================================================
# Usage: ./workshop_check.sh [checkpoint_number]
# Example: ./workshop_check.sh 1
# ============================================================================

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
STUDENT_NAME=""
CHECKPOINT=${1:-1}
AUTO_FIX=${AUTO_FIX:-true}
WORKSPACE="student_workspace"

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

print_header() {
    echo -e "${BLUE}╭────────────────────────────────────────────────────╮${NC}"
    echo -e "${BLUE}│${NC}  Flask Workshop - Checkpoint $CHECKPOINT Validator  ${BLUE}│${NC}"
    echo -e "${BLUE}╰────────────────────────────────────────────────────╯${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

prompt_fix() {
    if [ "$AUTO_FIX" = true ]; then
        print_info "Auto-fix enabled. Fixing..."
        return 0
    else
        read -p "$(echo -e ${YELLOW}Fix this automatically? [y/N]: ${NC})" -n 1 -r
        echo
        [[ $REPLY =~ ^[Yy]$ ]]
    fi
}

show_offline_help() {
    local error="$1"
    
    echo ""
    echo -e "${YELLOW}📚 Offline Help:${NC}"
    echo "─────────────────────────────────────────────"
    
    if [[ "$error" =~ "flask" ]] || [[ "$error" =~ "module" ]]; then
        cat << 'EOF'
Problem: Flask not installed in virtual environment

Windows Fix:
1. venv\Scripts\activate
2. pip install Flask
3. python -c "import flask; print('OK')"

Ubuntu Fix:
1. source venv/bin/activate
2. pip install Flask
3. python3 -c "import flask; print('OK')"
EOF
    elif [[ "$error" =~ "port" ]]; then
        cat << 'EOF'
Problem: Port 5000 already in use

Fix: Change port in app.py:
  app.run(debug=True, port=5001)
EOF
    else
        echo "Raise your hand for instructor help!"
    fi
    
    echo "─────────────────────────────────────────────"
    echo ""
}

# ============================================================================
# CHECKPOINT 1: ENVIRONMENT SETUP
# ============================================================================

check_checkpoint_1() {
    print_header
    print_info "Checking your environment setup..."
    echo ""
    
    local all_passed=true
    
    # Navigate to workspace
    cd "$WORKSPACE" 2>/dev/null || {
        print_error "workspace folder not found"
        mkdir -p "$WORKSPACE"
        cd "$WORKSPACE"
        print_success "Created workspace folder"
    }
    
    # Check 1: Python
    echo "📋 Check 1/6: Python Installation"
    if command -v python3 &> /dev/null; then
        python_version=$(python3 --version)
        print_success "Python found: $python_version"
    elif command -v python &> /dev/null; then
        python_version=$(python --version)
        print_success "Python found: $python_version"
    else
        print_error "Python not found"
        show_offline_help "python not installed"
        all_passed=false
        return 1
    fi
    echo ""
    
    # Check 2: Virtual environment
    echo "📋 Check 2/6: Virtual Environment"
    if [ -d "venv" ]; then
        print_success "Virtual environment found"
    else
        print_error "Virtual environment not found"
        
        if prompt_fix; then
            print_info "Creating virtual environment..."
            python3 -m venv venv || python -m venv venv
            
            if [ -d "venv" ]; then
                print_success "Virtual environment created!"
            else
                print_error "Failed to create venv"
                all_passed=false
            fi
        else
            all_passed=false
        fi
    fi
    echo ""
    
    # Check 3: Activation check
    echo "📋 Check 3/6: Virtual Environment Activation"
    if [[ "$VIRTUAL_ENV" != "" ]]; then
        print_success "Virtual environment is activated"
    else
        print_warning "Virtual environment not activated"
        echo ""
        print_info "To activate:"
        
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            echo -e "  ${YELLOW}venv\\Scripts\\activate${NC}"
        else
            echo -e "  ${YELLOW}source venv/bin/activate${NC}"
        fi
        
        echo ""
        print_info "After activating, run this script again"
        return 1
    fi
    echo ""
    
    # Check 4: Flask installed
    echo "📋 Check 4/6: Flask Installation"
    if python3 -c "import flask" 2>/dev/null || python -c "import flask" 2>/dev/null; then
        flask_version=$(python3 -c "import flask; print(flask.__version__)" 2>/dev/null || python -c "import flask; print(flask.__version__)")
        print_success "Flask installed: v$flask_version"
    else
        print_error "Flask not installed"
        
        if prompt_fix; then
            print_info "Installing Flask..."
            pip install Flask
            
            if python3 -c "import flask" 2>/dev/null; then
                print_success "Flask installed successfully!"
            else
                print_error "Installation failed"
                show_offline_help "flask install failed"
                all_passed=false
            fi
        else
            all_passed=false
        fi
    fi
    echo ""
    
    # Check 5: Project structure
    echo "📋 Check 5/6: Project Structure"
    local missing_dirs=()
    
    [ ! -d "templates" ] && missing_dirs+=("templates")
    [ ! -d "static" ] && missing_dirs+=("static")
    
    if [ ${#missing_dirs[@]} -eq 0 ]; then
        print_success "Project structure correct"
    else
        print_error "Missing: ${missing_dirs[*]}"
        
        if prompt_fix; then
            for dir in "${missing_dirs[@]}"; do
                mkdir -p "$dir"
                print_success "Created: $dir/"
            done
        else
            all_passed=false
        fi
    fi
    echo ""
    
    # Check 6: Git
    echo "📋 Check 6/6: Git Repository"
    if [ -d ".git" ]; then
        print_success "Git repository initialized"
    else
        print_warning "Not a git repo (optional)"
    fi
    echo ""
    
    # Final verdict
    if [ "$all_passed" = true ]; then
        echo -e "${GREEN}╭────────────────────────────────────────────────────╮${NC}"
        echo -e "${GREEN}│  ✅ CHECKPOINT 1 PASSED!                          │${NC}"
        echo -e "${GREEN}│  Ready for Checkpoint 2                            │${NC}"
        echo -e "${GREEN}╰────────────────────────────────────────────────────╯${NC}"
        echo ""
        print_info "Next: ./workshop_check.sh 2"
        return 0
    else
        echo -e "${RED}❌ CHECKPOINT 1 INCOMPLETE${NC}"
        return 1
    fi
}

# ============================================================================
# CHECKPOINT 2: FIRST FLASK APP
# ============================================================================

check_checkpoint_2() {
    print_header
    print_info "Checking your Flask app..."
    echo ""
    
    cd "$WORKSPACE" 2>/dev/null || {
        print_error "Please run checkpoint 1 first"
        return 1
    }
    
    local all_passed=true
    
    # Check 1: app.py exists
    echo "📋 Check 1/5: app.py File"
    if [ -f "app.py" ]; then
        print_success "app.py found"
    else
        print_error "app.py not found"
        
        if prompt_fix; then
            cat > app.py << 'EOF'
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
EOF
            print_success "Created basic app.py"
        else
            all_passed=false
        fi
    fi
    echo ""
    
    # Check 2: Syntax
    echo "📋 Check 2/5: Python Syntax"
    if [ -f "app.py" ]; then
        if python3 -m py_compile app.py 2>/dev/null; then
            print_success "Syntax is valid"
        else
            print_error "Syntax errors found"
            all_passed=false
        fi
    fi
    echo ""
    
    # Check 3: Flask import
    echo "📋 Check 3/5: Flask Import"
    if grep -q "from flask import Flask" app.py || grep -q "import flask" app.py; then
        print_success "Flask import found"
    else
        print_error "Flask not imported"
        all_passed=false
    fi
    echo ""
    
    # Check 4: Route
    echo "📋 Check 4/5: Route Definition"
    if grep -q "@app.route" app.py; then
        print_success "Route found"
    else
        print_error "No routes defined"
        all_passed=false
    fi
    echo ""
    
    # Check 5: Runnable
    echo "📋 Check 5/5: App Runnable"
    print_info "Testing if app starts (5 sec test)..."
    
    timeout 5 python3 app.py &> /tmp/flask_test.log &
    flask_pid=$!
    sleep 2
    
    if ps -p $flask_pid > /dev/null 2>&1; then
        print_success "App starts successfully"
        kill $flask_pid 2>/dev/null
    else
        print_error "App failed to start"
        cat /tmp/flask_test.log
        all_passed=false
    fi
    echo ""
    
    if [ "$all_passed" = true ]; then
        echo -e "${GREEN}✅ CHECKPOINT 2 PASSED!${NC}"
        print_info "Next: ./workshop_check.sh 3"
        return 0
    else
        echo -e "${RED}❌ CHECKPOINT 2 INCOMPLETE${NC}"
        return 1
    fi
}

# ============================================================================
# CHECKPOINT 3: TAILWIND CSS
# ============================================================================

check_checkpoint_3() {
    print_header
    print_info "Checking Tailwind CSS integration..."
    echo ""
    
    cd "$WORKSPACE" 2>/dev/null || return 1
    
    local all_passed=true
    local template_file=""
    
    # Check 1: Template exists
    echo "📋 Check 1/4: HTML Template"
    if [ -f "templates/index.html" ]; then
        template_file="templates/index.html"
        print_success "Template found"
    elif [ -f "templates/base.html" ]; then
        template_file="templates/base.html"
        print_success "Template found"
    else
        print_error "No template found"
        
        if prompt_fix; then
            cat > templates/index.html << 'EOF'
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
EOF
            template_file="templates/index.html"
            print_success "Created template with Tailwind"
        else
            all_passed=false
        fi
    fi
    echo ""
    
    # Check 2: Tailwind CDN
    echo "📋 Check 2/4: Tailwind CDN"
    if [ -n "$template_file" ] && grep -q "cdn.tailwindcss.com" "$template_file"; then
        print_success "Tailwind CDN found"
    else
        print_error "Tailwind CDN not found"
        all_passed=false
    fi
    echo ""
    
    # Check 3: Utility classes
    echo "📋 Check 3/4: Tailwind Classes"
    if [ -n "$template_file" ]; then
        utility_count=$(grep -oE '(bg-|text-|p-|m-|flex|grid)' "$template_file" | wc -l)
        
        if [ "$utility_count" -gt 3 ]; then
            print_success "Using Tailwind utilities ($utility_count classes)"
        else
            print_warning "Few utility classes found"
        fi
    fi
    echo ""
    
    # Check 4: Hover effects
    echo "📋 Check 4/4: Interactive Features"
    if [ -n "$template_file" ] && grep -q "hover:" "$template_file"; then
        print_success "Hover effects found"
    else
        print_warning "No hover effects (optional)"
    fi
    echo ""
    
    if [ "$all_passed" = true ]; then
        echo -e "${GREEN}✅ CHECKPOINT 3 PASSED!${NC}"
        print_info "Next: ./workshop_check.sh 4"
        return 0
    else
        echo -e "${RED}❌ CHECKPOINT 3 INCOMPLETE${NC}"
        return 1
    fi
}

# ============================================================================
# CHECKPOINT 4: AI INTEGRATION
# ============================================================================

check_checkpoint_4() {
    print_header
    print_info "Checking AI integration..."
    echo ""
    
    cd "$WORKSPACE" 2>/dev/null || return 1
    
    # Check .env
    echo "📋 Check 1/3: Environment Variables"
    if [ -f ".env" ]; then
        print_success ".env file found"
        
        if grep -q "GROQ_API_KEY" .env; then
            print_success "GROQ_API_KEY configured"
        else
            print_warning "GROQ_API_KEY not set"
        fi
    else
        print_warning ".env not found (optional)"
    fi
    echo ""
    
    # Check AI route
    echo "📋 Check 2/3: AI Endpoint"
    if [ -f "app.py" ] && grep -q "/api/chat" app.py; then
        print_success "Chat endpoint found"
    else
        print_warning "No chat endpoint"
    fi
    echo ""
    
    echo -e "${GREEN}🎉 ALL CHECKPOINTS COMPLETE!${NC}"
    echo ""
    print_info "Congratulations! Your Flask app is ready."
    return 0
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    if ! [[ "$CHECKPOINT" =~ ^[1-4]$ ]]; then
        echo "Usage: $0 [1-4]"
        echo "Example: $0 1"
        exit 1
    fi
    
    case $CHECKPOINT in
        1) check_checkpoint_1 ;;
        2) check_checkpoint_2 ;;
        3) check_checkpoint_3 ;;
        4) check_checkpoint_4 ;;
    esac
}

main
