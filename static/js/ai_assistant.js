/* ==========================================
   AI ASSISTANT - CLEAN SEARCH BAR
   Flask + Groq Integration
   ========================================== */

let isSearchOpen = false;
let isListening = false;
let conversationHistory = []; // Store conversation for context

// Mouse following eyes (pill only)
document.addEventListener('mousemove', (e) => {
    const leftPupil = document.getElementById('leftPupil');
    const rightPupil = document.getElementById('rightPupil');
    
    if (!leftPupil || !rightPupil) return;
    
    const face = leftPupil.closest('.ai-face');
    if (!face) return;
    
    const rect = face.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const distance = Math.min(2, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 100);
    
    const pupilX = Math.cos(angle) * distance;
    const pupilY = Math.sin(angle) * distance;
    
    leftPupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
    rightPupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
});

// Toggle AI (called from keyboard button or pill click)
function toggleAI() {
    const container = document.getElementById('aiContainer');
    const pill = document.getElementById('aiPill');
    
    isSearchOpen = !isSearchOpen;
    
    if (isSearchOpen) {
        // Open search bar
        container.classList.add('search-open');
        pill.classList.add('active');
        
        // Focus input after animation
        setTimeout(() => {
            const input = document.getElementById('aiSearchInput');
            if (input) input.focus();
        }, 300);
    } else {
        // Close search bar
        closeSearchBar();
    }
}

// Close search bar
function closeSearchBar() {
    const container = document.getElementById('aiContainer');
    const pill = document.getElementById('aiPill');
    const input = document.getElementById('aiSearchInput');
    
    container.classList.remove('search-open');
    pill.classList.remove('active');
    isSearchOpen = false;
    
    // Clear input
    if (input) {
        input.value = '';
        updateSendButton();
    }
    
    // Stop listening if active
    if (isListening) {
        stopListening();
    }
}

// Handle Enter key
function handleEnterKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Update send button state
function updateSendButton() {
    const input = document.getElementById('aiSearchInput');
    const sendBtn = document.getElementById('aiSendBtn');
    
    if (!input || !sendBtn) return;
    
    if (input.value.trim()) {
        sendBtn.disabled = false;
        sendBtn.classList.add('active');
    } else {
        sendBtn.disabled = true;
        sendBtn.classList.remove('active');
    }
}

// Listen for input changes
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('aiSearchInput');
    if (input) {
        input.addEventListener('input', updateSendButton);
    }
});

// ==========================================
// SEND MESSAGE TO FLASK BACKEND
// ==========================================

async function sendMessage() {
    const input = document.getElementById('aiSearchInput');
    if (!input) return;
    
    const message = input.value.trim();
    
    if (!message) return;
    
    console.log('Sending message:', message);
    
    // Get send button
    const sendBtn = document.getElementById('aiSendBtn');
    const originalBtnContent = sendBtn.innerHTML;
    
    // Show loading state
    sendBtn.innerHTML = `
        <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    `;
    sendBtn.disabled = true;
    
    // Change pill to "thinking" state
    const pill = document.getElementById('aiPill');
    pill.classList.add('thinking');
    
    try {
        // Send to Flask backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversation_history: conversationHistory
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update conversation history
            conversationHistory.push({
                role: "user",
                content: message
            });
            conversationHistory.push({
                role: "assistant",
                content: data.response
            });
            
            // Keep only last 10 messages for context
            if (conversationHistory.length > 10) {
                conversationHistory = conversationHistory.slice(-10);
            }
            
            // Display response
            displayAIResponse(data.response);
            
            // Auto-speak if TTS is enabled
            if (window.speakText && window.flaskAISettings) {
                const settings = window.flaskAISettings.getSettings();
                if (settings.ttsEnabled && settings.ttsAutoplay) {
                    window.speakText(data.response);
                }
            }
            
            console.log('✓ AI Response received');
        } else {
            // Error from backend
            showError(data.error || 'Unknown error occurred');
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        showError('Failed to connect to AI. Please check your connection and try again.');
    } finally {
        // Restore button
        sendBtn.innerHTML = originalBtnContent;
        sendBtn.disabled = false;
        pill.classList.remove('thinking');
        
        // Clear input
        input.value = '';
        updateSendButton();
    }
}

// ==========================================
// DISPLAY AI RESPONSE
// ==========================================

function displayAIResponse(response) {
    // Create modal/notification to show response
    const modal = document.createElement('div');
    modal.className = 'ai-response-modal';
    modal.innerHTML = `
        <div class="ai-response-content">
            <div class="ai-response-header">
                <div class="flex items-center gap-2">
                    <div class="ai-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
                            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
                        </svg>
                    </div>
                    <span class="font-semibold text-gray-900">AI Assistant</span>
                </div>
                <button onclick="closeAIResponse()" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
            </div>
            <div class="ai-response-body">
                ${formatResponse(response)}
            </div>
            <div class="ai-response-actions">
                <button onclick="copyResponse()" class="ai-action-btn" title="Copy response">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                    </svg>
                    Copy
                </button>
                <button onclick="speakResponse()" class="ai-action-btn" title="Read aloud">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
                        <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
                        <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
                    </svg>
                    Speak
                </button>
            </div>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('ai-response-styles')) {
        const styles = document.createElement('style');
        styles.id = 'ai-response-styles';
        styles.textContent = `
            .ai-response-modal {
                position: fixed;
                top: 80px;
                right: 20px;
                max-width: 500px;
                width: calc(100% - 40px);
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                animation: slideInRight 0.3s ease-out;
            }
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .ai-response-content {
                padding: 20px;
            }
            .ai-response-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid #e5e7eb;
            }
            .ai-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00b4d8, #48cae4);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            .ai-response-body {
                color: #374151;
                line-height: 1.6;
                margin-bottom: 16px;
                max-height: 400px;
                overflow-y: auto;
            }
            .ai-response-actions {
                display: flex;
                gap: 8px;
                padding-top: 12px;
                border-top: 1px solid #e5e7eb;
            }
            .ai-action-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 14px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                background: white;
                color: #6b7280;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .ai-action-btn:hover {
                background: #f9fafb;
                border-color: #00b4d8;
                color: #00b4d8;
            }
            .ai-thinking {
                animation: pulse 2s ease-in-out infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Remove any existing modal
    const existingModal = document.querySelector('.ai-response-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add to page
    document.body.appendChild(modal);
    
    // Store response for actions
    window.currentAIResponse = response;
    
    // Auto-close after 15 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 15000);
}

// Format response with basic markdown support
function formatResponse(text) {
    // Convert newlines to <br>
    text = text.replace(/\n/g, '<br>');
    
    // Bold **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic *text*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code `text`
    text = text.replace(/`(.*?)`/g, '<code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>');
    
    return text;
}

// Close AI response modal
function closeAIResponse() {
    const modal = document.querySelector('.ai-response-modal');
    if (modal) {
        modal.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => modal.remove(), 300);
    }
}

// Copy response to clipboard
function copyResponse() {
    if (window.currentAIResponse) {
        navigator.clipboard.writeText(window.currentAIResponse)
            .then(() => {
                const btn = event.target.closest('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = '✓ Copied!';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy to clipboard');
            });
    }
}

// Speak response using TTS
function speakResponse() {
    if (window.currentAIResponse && window.speakText) {
        window.speakText(window.currentAIResponse);
    }
}

// Show error message
function showError(message) {
    alert(`❌ Error: ${message}`);
}

// ==========================================
// VOICE INPUT (MICROPHONE)
// ==========================================

function toggleMic() {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
}

function startListening() {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    isListening = true;
    const micBtn = document.getElementById('aiMicBtn');
    const micStatus = document.getElementById('aiMicStatus');
    
    micBtn.classList.add('listening');
    micStatus.classList.add('show');
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('aiSearchInput');
        if (input) {
            input.value = transcript;
            updateSendButton();
        }
        stopListening();
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
        if (event.error !== 'no-speech') {
            alert(`Speech recognition error: ${event.error}`);
        }
    };
    
    recognition.onend = () => {
        stopListening();
    };
    
    try {
        recognition.start();
    } catch (error) {
        console.error('Failed to start recognition:', error);
        stopListening();
    }
}

function stopListening() {
    isListening = false;
    const micBtn = document.getElementById('aiMicBtn');
    const micStatus = document.getElementById('aiMicStatus');
    
    if (micBtn) micBtn.classList.remove('listening');
    if (micStatus) micStatus.classList.remove('show');
}

// ==========================================
// FILE UPLOAD
// ==========================================

function openFileUpload() {
    const fileInput = document.getElementById('aiFileInput');
    fileInput.click();
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('aiFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                console.log('Files selected:', files);
                
                const fileNames = Array.from(files).map(f => f.name).join(', ');
                alert(`${files.length} file(s) selected:\n${fileNames}\n\nFile upload feature coming soon!`);
            }
        });
    }
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Click outside to close
document.addEventListener('click', (e) => {
    const container = document.getElementById('aiContainer');
    
    if (!container) return;
    
    if (isSearchOpen && !container.contains(e.target)) {
        closeSearchBar();
    }
});

// Escape key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isSearchOpen) {
            closeSearchBar();
        }
        closeAIResponse();
    }
});

// Clear conversation history (optional utility)
function clearConversation() {
    conversationHistory = [];
    console.log('Conversation history cleared');
}

// Export functions for external use
window.aiAssistant = {
    sendMessage,
    toggleAI,
    closeSearchBar,
    clearConversation
};