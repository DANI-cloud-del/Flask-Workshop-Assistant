"""
Test 1: Basic Groq API Connection
Verifies API key and basic functionality
"""

from groq import Groq
from dotenv import load_dotenv
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

print("="*50)
print("🧪 TEST 1: Basic Groq Connection")
print("="*50)

# Check if API key exists
api_key = os.getenv('GROQ_API_KEY')

if not api_key:
    print("❌ ERROR: GROQ_API_KEY not found in .env file")
    print("\n📝 Create a .env file with:")
    print("   GROQ_API_KEY=gsk_your_key_here")
    exit(1)

print(f"✅ API Key found: {api_key[:15]}...")

# Initialize Groq client
try:
    client = Groq(api_key=api_key)
    print("✅ Groq client initialized")
except Exception as e:
    print(f"❌ ERROR: {e}")
    exit(1)

# Test simple completion
print("\n📤 Sending test message...")

try:
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Say 'Hello from Groq!' in one sentence."
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=50
    )
    
    ai_response = response.choices[0].message.content
    
    print("\n✅ SUCCESS! Groq API is working!")
    print(f"\n🤖 AI Response: {ai_response}")
    print(f"\n📊 Model: {response.model}")
    print(f"📊 Tokens used: {response.usage.total_tokens}")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\n💡 Common issues:")
    print("   - Invalid API key")
    print("   - Network connection problems")
    print("   - Rate limit exceeded")
    exit(1)

print("\n" + "="*50)
print("✅ Test completed successfully!")
print("="*50)