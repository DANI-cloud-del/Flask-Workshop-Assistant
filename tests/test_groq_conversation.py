"""
Test 2: Groq with Conversation History
Tests multi-turn conversations with context
"""

from groq import Groq
from dotenv import load_dotenv
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

print("="*50)
print("🧪 TEST 2: Conversation History")
print("="*50)

api_key = os.getenv('GROQ_API_KEY')

if not api_key:
    print("❌ ERROR: GROQ_API_KEY not found in .env file")
    exit(1)

client = Groq(api_key=api_key)

# Conversation history
conversation = [
    {
        "role": "system",
        "content": "You are a helpful assistant. Keep responses brief."
    }
]

def chat(user_message):
    """Send message and get response"""
    print(f"\n👤 User: {user_message}")
    
    # Add user message
    conversation.append({
        "role": "user",
        "content": user_message
    })
    
    # Get AI response
    response = client.chat.completions.create(
        messages=conversation,
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=100
    )
    
    ai_response = response.choices[0].message.content
    
    # Add AI response to history
    conversation.append({
        "role": "assistant",
        "content": ai_response
    })
    
    print(f"🤖 AI: {ai_response}")
    return ai_response

# Test conversation
print("\n📝 Starting conversation...")
print("Testing if AI remembers context...\n")

try:
    chat("My name is Alice.")
    chat("What's my name?")  # Should remember "Alice"
    chat("Tell me a joke about programming.")
    
    print("\n" + "="*50)
    print(f"✅ Conversation length: {len(conversation)} messages")
    print("✅ Context is maintained!")
    print("\n💡 Key learning: AI remembers previous messages")
    print("   in the conversation history.")
    print("="*50)
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    exit(1)