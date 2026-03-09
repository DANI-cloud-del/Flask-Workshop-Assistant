"""
Test 3: Compare Different Groq Models
Tests various models available on Groq
"""

from groq import Groq
from dotenv import load_dotenv
import os
import time
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

print("="*50)
print("🧪 TEST 3: Model Comparison")
print("="*50)

api_key = os.getenv('GROQ_API_KEY')

if not api_key:
    print("❌ ERROR: GROQ_API_KEY not found in .env file")
    exit(1)

client = Groq(api_key=api_key)

# Available models
models = [
    "llama-3.3-70b-versatile",     # Best overall (recommended)
    "llama-3.1-70b-versatile",     # Previous version
    "mixtral-8x7b-32768",          # Good for long context
    "gemma2-9b-it",                # Lightweight, fast
]

test_prompt = "Explain Flask in one sentence."

print(f"\n📤 Testing prompt: '{test_prompt}'\n")
print("⏳ Testing models (this may take a minute)...\n")

results = []

for model in models:
    print(f"\n{'='*50}")
    print(f"🤖 Model: {model}")
    print(f"{'='*50}")
    
    try:
        start_time = time.time()
        
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": test_prompt}],
            model=model,
            temperature=0.7,
            max_tokens=100
        )
        
        elapsed = time.time() - start_time
        
        result = {
            'model': model,
            'time': elapsed,
            'response': response.choices[0].message.content,
            'tokens': response.usage.total_tokens
        }
        results.append(result)
        
        print(f"\n⏱️  Response time: {elapsed:.2f}s")
        print(f"📝 Response: {result['response']}")
        print(f"🎫 Tokens: {result['tokens']}")
        
        # Small delay to avoid rate limiting
        time.sleep(1)
        
    except Exception as e:
        print(f"❌ Error: {e}")

# Summary
print("\n" + "="*50)
print("📊 RESULTS SUMMARY")
print("="*50)

if results:
    # Sort by speed
    sorted_results = sorted(results, key=lambda x: x['time'])
    
    print("\n🏆 Fastest to Slowest:\n")
    for i, result in enumerate(sorted_results, 1):
        print(f"{i}. {result['model']}")
        print(f"   Time: {result['time']:.2f}s | Tokens: {result['tokens']}")
    
    print("\n💡 Recommendation: llama-3.3-70b-versatile")
    print("   - Best balance of speed and quality")
    print("   - Most recent Llama version")
    print("   - Great for general use")

print("\n" + "="*50)
print("✅ Model comparison complete!")
print("="*50)