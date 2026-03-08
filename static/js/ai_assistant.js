/* ==========================================
   AI ASSISTANT - WITH CHAT HISTORY
   Flask + Groq Integration
   ========================================== */

let isSearchOpen = false;
let isListening = false;
let conversationHistory = []; // Store conversation for context
let chatMessages = []; // Store all messages for display

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
        
        // Show chat history container
        ensureChatHistoryExists();
        
        // Focus input after animation
        setTimeout(() => {
            const input = document.getElementById('aiSearchInput');
            if (input) input.focus();
            scrollChatToBottom();
        }, 300);
    } else {
        // Close search bar
        closeSearchBar();
    }
}

// Ensure chat history container exists
function ensureChatHistoryExists() {
    let chatHistory = document.getElementById('aiChatHistory');
    
    if (!chatHistory) {
        // Create chat history container
        chatHistory = document.createElement('div');
        chatHistory.id = 'aiChatHistory';
        chatHistory.className = 'ai-chat-history';
        
        // Add welcome message if no messages
        if (chatMessages.length === 0) {
            chatHistory.innerHTML = `
                <div class="ai-welcome-message">
                    <div class="ai-welcome-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
                            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
                        </svg>
                    </div>
                    <h3>Hi there! 👋</h3>
                    <p>I'm your AI assistant. Ask me anything!</p>
                </div>
            `;
        } else {
            // Render existing messages
            renderAllMessages();
        }
        
        // Insert before search bar
        const searchBar = document.querySelector('.ai-search-bar');
        searchBar.parentNode.insertBefore(chatHistory, searchBar);
    }
}

// Render all messages in chat history
function renderAllMessages() {
    const chatHistory = document.getElementById('aiChatHistory');
    if (!chatHistory) return;
    
    chatHistory.innerHTML = '';
    
    chatMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message-${msg.type}`;
        messageDiv.innerHTML = `
            <div class="ai-message-content">
                ${formatResponse(msg.content)}
            </div>
        `;
        chatHistory.appendChild(messageDiv);
    });
    
    scrollChatToBottom();
}

// Add message to chat history
function addMessageToChat(content, type) {
    chatMessages.push({ content, type, timestamp: Date.now() });
    
    const chatHistory = document.getElementById('aiChatHistory');
    if (!chatHistory) return;
    
    // Remove welcome message if exists
    const welcomeMsg = chatHistory.querySelector('.ai-welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${type}`;
    messageDiv.innerHTML = `
        <div class="ai-message-content">
            ${formatResponse(content)}
        </div>
    `;
    
    chatHistory.appendChild(messageDiv);
    scrollChatToBottom();
}

// Scroll chat to bottom
function scrollChatToBottom() {
    const chatHistory = document.getElementById('aiChatHistory');
    if (chatHistory) {
        setTimeout(() => {
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }, 100);
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
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
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
    
    // Clear input immediately
    input.value = '';
    updateSendButton();
    
    // Change pill to "thinking" state
    const pill = document.getElementById('aiPill');
    pill.classList.add('thinking');
    
    // Show typing indicator
    showTypingIndicator();
    
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
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add AI response to chat
            addMessageToChat(data.response, 'ai');
            
            console.log('✓ AI Response received');
        } else {
            // Error from backend
            hideTypingIndicator();
            addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        hideTypingIndicator();
        addMessageToChat('Sorry, I could not connect to the server. Please check your connection.', 'ai');
    } finally {
        // Restore button
        sendBtn.innerHTML = originalBtnContent;
        pill.classList.remove('thinking');
    }
}

// Show typing indicator
function showTypingIndicator() {
    const chatHistory = document.getElementById('aiChatHistory');
    if (!chatHistory) return;
    
    // Check if indicator already exists
    if (document.getElementById('typingIndicator')) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'ai-typing-indicator';
    indicator.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    chatHistory.appendChild(indicator);
    scrollChatToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
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
    text = text.replace(/`(.*?)`/g, '<code style="background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>');
    
    return text;
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
    if (e.key === 'Escape' && isSearchOpen) {
        closeSearchBar();
    }
});

// Clear conversation history
function clearConversation() {
    conversationHistory = [];
    chatMessages = [];
    const chatHistory = document.getElementById('aiChatHistory');
    if (chatHistory) {
        chatHistory.innerHTML = `
            <div class="ai-welcome-message">
                <div class="ai-welcome-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219z"/>
                        <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2z"/>
                    </svg>
                </div>
                <h3>Hi there! 👋</h3>
                <p>I'm your AI assistant. Ask me anything!</p>
            </div>
        `;
    }
    console.log('Conversation history cleared');
}

// Export functions for external use
window.aiAssistant = {
    sendMessage,
    toggleAI,
    closeSearchBar,
    clearConversation
};