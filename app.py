from flask import Flask, redirect, session, url_for, request, render_template
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


@app.route('/')
def home():
    if "user" in session:
        user = session["user"]
        return f'''
            <!DOCTYPE html>
            <html>
            <head>
                <title>Welcome</title>
                <style>
                    body {{ font-family: Arial; text-align: center; padding: 50px; }}
                    img {{ border-radius: 50%; margin: 20px; }}
                    a {{ color: #4285f4; text-decoration: none; }}
                </style>
            </head>
            <body>
                <h1>Welcome {user["name"]}! 🎉</h1>
                <img src="{user["picture"]}" width="100">
                <p><strong>Email:</strong> {user["email"]}</p>
                <p><a href="/logout">Logout</a></p>
            </body>
            </html>
        '''
    return render_template('login.html')


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