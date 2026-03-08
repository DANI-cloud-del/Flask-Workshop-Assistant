from flask import Flask, jsonify, redirect, session, url_for, request, render_template
from groq import Groq
import google_auth_oauthlib.flow
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ⭐ CRITICAL: Allow HTTP for development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY') or os.urandom(24)

# Initialize Groq client
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# System prompt
SYSTEM_PROMPT = """You are a helpful AI assistant for Flask Workshop Assistant.
You help users with their questions in a friendly and informative way.
Keep responses concise but complete (2-3 sentences for simple questions)."""

# OAuth config from environment variables
oauth_config = {
    "web": {
        "client_id": os.environ.get('GOOGLE_CLIENT_ID'),
        "client_secret": os.environ.get('GOOGLE_CLIENT_SECRET'),
        "redirect_uris": ["http://localhost:5000/oauth2callback"],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
    }
}

# Setup OAuth flow
flow = google_auth_oauthlib.flow.Flow.from_client_config(
    oauth_config,
    scopes=[
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
        "https://www.googleapis.com/auth/userinfo.profile",
    ]
)
flow.redirect_uri = "http://localhost:5000/oauth2callback"

# ==========================================
# MAIN ROUTES
# ==========================================

@app.route('/')
def home():
    """Home page - shows chat if logged in, otherwise login page"""
    if "user" in session:
        return render_template('chat.html', user=session.get('user'))
    else:
        return render_template('login.html')

@app.route('/settings')
def settings():
    """Settings page"""
    return render_template('settings.html', user=session.get('user'))

@app.route('/test')
def test():
    """Test page"""
    return render_template('test.html', user=session.get('user'))

# ==========================================
# AI CHAT API ENDPOINTS
# ==========================================

@app.route('/api/chat', methods=['POST'])
def api_chat():
    """
    Handle chat messages from the AI search bar
    Expects JSON: { "message": "user message", "conversation_history": [...] }
    Returns JSON: { "success": true, "response": "AI response" }
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': 'No message provided'
            }), 400
        
        user_message = data['message']
        conversation_history = data.get('conversation_history', [])
        
        # Build messages for Groq
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        
        # Add conversation history (last 10 messages for context)
        messages.extend(conversation_history[-10:])
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        # Call Groq API
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
            stream=False
        )
        
        # Extract AI response
        ai_response = chat_completion.choices[0].message.content
        
        return jsonify({
            'success': True,
            'response': ai_response,
            'model': 'llama-3.3-70b-versatile'
        })
    
    except Exception as e:
        print(f"Error in chat API: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred processing your request. Please try again.'
        }), 500

@app.route('/api/chat/clear', methods=['POST'])
def clear_chat():
    """Clear conversation history from session"""
    if 'conversation' in session:
        session['conversation'] = []
    return jsonify({'success': True})

# ==========================================
# OAUTH ROUTES
# ==========================================

@app.route('/authorize')
def authorize():
    """Start Google OAuth flow"""
    print("\n=== Starting OAuth flow ===")
    
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    
    session['state'] = state
    
    print(f"State: {state}")
    print(f"Redirecting to Google...")
    
    return redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
    """Handle OAuth callback from Google"""
    print("\n=== OAuth callback received ===")
    
    if 'state' not in session:
        print("ERROR: No state in session")
        return 'Invalid session state', 400
    
    if session['state'] != request.args.get('state'):
        print("ERROR: State mismatch")
        return 'Invalid state parameter', 400
    
    print("✓ State verified")
    
    try:
        print("Fetching token...")
        flow.fetch_token(authorization_response=request.url)
        print("✓ Token received")
    except Exception as e:
        print(f"ERROR fetching token: {e}")
        return f'Error fetching token: {str(e)}', 400
    
    credentials = flow.credentials
    session['access_token'] = credentials.token
    
    print("Getting user info...")
    user_info = get_user_info(credentials.token)
    
    if user_info:
        session['user'] = {
            'name': user_info.get('name'),
            'email': user_info.get('email'),
            'picture': user_info.get('picture')
        }
        print(f"✓ User logged in: {user_info.get('email')}")
        return redirect(url_for('home'))
    else:
        print("ERROR: Could not get user info")
        return 'Error getting user info', 400

def get_user_info(access_token):
    """Get user info from Google"""
    response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error getting user info: {response.status_code}")
        print(f"Response: {response.text}")
        return None

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login page (for development/testing)"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == 'admin' and password == 'password':
            return "Login successful!"
        else:
            return "Invalid credentials. Please try again."
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Logout user and clear session"""
    print("\n=== User logging out ===")
    session.clear()
    print("✓ Session cleared")
    return redirect(url_for('home'))

# ==========================================
# ERROR HANDLERS
# ==========================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ==========================================
# RUN APP
# ==========================================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Flask App Starting")
    print("="*50)
    
    # Check Groq API key
    if os.getenv('GROQ_API_KEY'):
        groq_key = os.getenv('GROQ_API_KEY')
        print(f"✓ Groq API Key loaded: {groq_key[:15]}...")
    else:
        print("✗ WARNING: GROQ_API_KEY not found in .env file!")
    
    # Check OAuth credentials
    if oauth_config.get('web', {}).get('client_id'):
        client_id = oauth_config['web']['client_id']
        print(f"✓ Google Client ID loaded: {client_id[:20]}...")
    else:
        print("✗ WARNING: GOOGLE_CLIENT_ID not found!")
    
    if oauth_config.get('web', {}).get('client_secret'):
        secret = oauth_config['web']['client_secret']
        print(f"✓ Google Client Secret loaded: {secret[:15]}...")
    else:
        print("✗ WARNING: GOOGLE_CLIENT_SECRET not found!")
    
    print("="*50)
    print("\n🌐 Visit: http://localhost:5000")
    print("\n")
    
    app.run(debug=True, port=5000)