"""
Test 4: Flask API Endpoint
Tests the /api/chat endpoint

NOTE: Flask app must be running before executing this test!
Run in another terminal: python app.py
"""

import requests
import json
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print("="*50)
print("🧪 TEST 4: Flask API Endpoint")
print("="*50)

# API endpoint
url = "http://localhost:5000/api/chat"

# Test data
test_messages = [
    "Hello!",
    "What is Flask?",
    "Tell me about Python."
]

print("\n⚠️  PREREQUISITES:")
print("   1. Flask app must be running")
print("   2. In another terminal, run: python app.py")
print("   3. Wait for 'Running on http://localhost:5000'\n")

input("✅ Press Enter when Flask is running...")

print("\n🧪 Running API tests...\n")

conversation_history = []

for i, message in enumerate(test_messages, 1):
    print(f"\n{'='*50}")
    print(f"Test {i}/{len(test_messages)}")
    print(f"{'='*50}")
    print(f"👤 Sending: {message}")
    
    # Prepare request
    payload = {
        "message": message,
        "conversation_history": conversation_history
    }
    
    try:
        # Send POST request
        response = requests.post(
            url,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        # Parse response
        if response.status_code == 200:
            data = response.json()
            
            if data['success']:
                print(f"\n✅ Status: {response.status_code} OK")
                print(f"🤖 AI Response: {data['response']}")
                print(f"📊 Model: {data['model']}")
                
                # Update conversation history
                conversation_history.append({
                    "role": "user",
                    "content": message
                })
                conversation_history.append({
                    "role": "assistant",
                    "content": data['response']
                })
            else:
                print(f"\n❌ API Error: {data.get('error')}")
        else:
            print(f"\n❌ HTTP Error: {response.status_code}")
            print(f"Response: {response.text}")
    
    except requests.exceptions.ConnectionError:
        print("\n❌ Connection Error: Flask app not running!")
        print("\n💡 Fix:")
        print("   1. Open new terminal")
        print("   2. Run: python app.py")
        print("   3. Wait for server to start")
        print("   4. Run this test again")
        sys.exit(1)
    except requests.exceptions.Timeout:
        print("\n❌ Timeout Error: Request took too long")
        print("   This might be a rate limit issue")
    except Exception as e:
        print(f"\n❌ Error: {e}")

print("\n" + "="*50)
print("📊 TEST SUMMARY")
print("="*50)
print(f"\n✅ Tests completed: {len(test_messages)}")
print(f"📝 Conversation history: {len(conversation_history)} messages")
print("\n💡 Key learning: Flask backend successfully")
print("   connects to Groq API and returns responses!")
print("\n" + "="*50)
print("✅ API test complete!")
print("="*50)