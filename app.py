from flask import Flask, jsonify, redirect, session, url_for, request, render_template
from groq import Groq
import google_auth_oauthlib.flow
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SYSTEM_PROMPT = """You are a helpful AI assistant for Flask Workshop Assistant.
You help users with their questions in a friendly and informative way.
Keep responses concise but complete."""



# ⭐ CRITICAL: Allow HTTP for development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY') or os.urandom(24)

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



@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')
    
    # Get or create conversation history
    if 'conversation' not in session:
        session['conversation'] = []
    
    # Add user message
    session['conversation'].append({
        "role": "user",
        "content": user_message
    })
    
    # Build messages with history
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(session['conversation'][-10:])  # Last 10 messages
    
    # Get AI response
    response = client.chat.completions.create(
        messages=messages,
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=1024
    )
    
    ai_response = response.choices[0].message.content
    
    # Add AI response to history
    session['conversation'].append({
        "role": "assistant",
        "content": ai_response
    })
    
    session.modified = True
    
    return jsonify({
        'success': True,
        'response': ai_response
    })


@app.route('/api/chat/clear', methods=['POST'])
def clear_chat():
    """Clear conversation history"""
    session['conversation'] = []
    return jsonify({'success': True})


@app.route('/')
def home():
    if "user" in session:
        return render_template('chat.html', user=session.get('user'))
    else:
        return render_template('login.html')

@app.route('/settings')
def settings():
    return render_template('settings.html', user=session.get('user'))

@app.route('/authorize')
def authorize():
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

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':

        username = request.form.get('username')
        password = request.form.get('password')

    if username == 'admin' and password == 'password':
        return "Login successful!"
    else:
        return "Invalid credentials. Please try again."

@app.route('/logout')
def logout():
    print("\n=== User logging out ===")
    session.clear()
    print("✓ Session cleared")
    return redirect(url_for('home'))

@app.route('/chat')
def chat():
    if "user" not in session:
        print("Unauthorized access to /chat")
        return redirect(url_for('home'))
    
    user = session['user']
    return render_template('chat.html', user=user)

@app.route('/test')
def test():
    return render_template('test.html', user=session.get('user'))

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Flask App Starting")
    print("="*50)
    
    if oauth_config.get('web', {}).get('client_id'):
        client_id = oauth_config['web']['client_id']
        print(f"✓ Client ID loaded: {client_id[:20]}...")
    else:
        print("✗ WARNING: Client ID not found!")
    
    if oauth_config.get('web', {}).get('client_secret'):
        secret = oauth_config['web']['client_secret']
        print(f"✓ Client Secret loaded: {secret[:15]}...")
    else:
        print("✗ WARNING: Client Secret not found!")
    
    print("="*50)
    print("\n🌐 Visit: http://localhost:5000")
    print("\n")
    
    app.run(debug=True)