/* ==========================================
   AI CHAT PANEL - JAVASCRIPT
   ========================================== */

let chatMessages = [];
let isTyping = false;

// Initialize welcome message
function initChatPanel(username) {
    const messagesContainer = document.getElementById('aiChatMessages');
    
    // Clear existing messages
    messagesContainer.innerHTML = '';
    chatMessages = [];
    
    // Add welcome message
    addMessage('bot', `Welcome ${username}! 👋 I'm your AI assistant. How can I help you today?`);
}

// Open chat panel
function openChatPanel() {
    const overlay = document.getElementById('aiChatOverlay');
    const panel = document.getElementById('aiChatPanel');
    
    overlay.classList.add('show');
    panel.classList.add('show');
    
    // Focus input
    setTimeout(() => {
        document.getElementById('aiChatInput').focus();
    }, 300);
    
    // Hide the pill button
    document.getElementById('aiPill').style.opacity = '0';
    document.getElementById('aiPill').style.pointerEvents = 'none';
}

// Close chat panel
function closeChatPanel() {
    const overlay = document.getElementById('aiChatOverlay');
    const panel = document.getElementById('aiChatPanel');
    
    overlay.classList.remove('show');
    panel.classList.remove('show');
    
    // Show the pill button again
    setTimeout(() => {
        document.getElementById('aiPill').style.opacity = '1';
        document.getElementById('aiPill').style.pointerEvents = 'all';
    }, 300);
}

// Add message to chat
function addMessage(sender, text) {
    const messagesContainer = document.getElementById('aiChatMessages');
    const message = {
        sender: sender,
        text: text,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    chatMessages.push(message);
    
    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'ai-message-avatar';
    avatar.innerHTML = sender === 'bot' ? '🤖' : '👤';
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    bubble.innerHTML = `
        ${text}
        <div class="ai-message-time">${message.time}</div>
    `;
    
    messageEl.appendChild(avatar);
    messageEl.appendChild(bubble);
    messagesContainer.appendChild(messageEl);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTyping() {
    const messagesContainer = document.getElementById('aiChatMessages');
    const typingEl = document.createElement('div');
    typingEl.id = 'aiTypingIndicator';
    typingEl.className = 'ai-message bot';
    typingEl.innerHTML = `
        <div class="ai-message-avatar">🤖</div>
        <div class="ai-message-bubble">
            <div class="ai-typing">
                <div class="ai-typing-dot"></div>
                <div class="ai-typing-dot"></div>
                <div class="ai-typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    isTyping = true;
}

// Hide typing indicator
function hideTyping() {
    const typingEl = document.getElementById('aiTypingIndicator');
    if (typingEl) {
        typingEl.remove();
    }
    isTyping = false;
}

// Send message
function sendChatMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    
    if (!message || isTyping) return;
    
    // Add user message
    addMessage('user', message);
    input.value = '';
    
    // Show typing indicator
    showTyping();
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
        hideTyping();
        
        // Generate response based on message
        const response = generateResponse(message);
        addMessage('bot', response);
    }, 1500 + Math.random() * 1000);
}

// Generate AI response (placeholder - replace with actual API)
function generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! How can I assist you today? 😊";
    } else if (lowerMessage.includes('help')) {
        return "I'm here to help! You can ask me anything about our services, features, or general questions.";
    } else if (lowerMessage.includes('thank')) {
        return "You're welcome! Is there anything else I can help you with?";
    } else if (lowerMessage.includes('bye')) {
        return "Goodbye! Have a great day! Feel free to come back anytime. 👋";
    } else {
        const responses = [
            "That's an interesting question! Let me help you with that.",
            "I understand. Here's what I can tell you...",
            "Great question! Based on what you're asking...",
            "I'd be happy to help you with that!",
            "Let me provide you with some information about that."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// AI Watcher - Eyes follow mouse
document.addEventListener('mousemove', (e) => {
    const leftPupil = document.getElementById('watcherLeftPupil');
    const rightPupil = document.getElementById('watcherRightPupil');
    const watcher = document.getElementById('aiWatcher');
    
    if (!leftPupil || !rightPupil || !watcher) return;
    
    const watcherRect = watcher.getBoundingClientRect();
    const watcherX = watcherRect.left + watcherRect.width / 2;
    const watcherY = watcherRect.top + watcherRect.height / 2;
    
    const angle = Math.atan2(e.clientY - watcherY, e.clientX - watcherX);
    const distance = Math.min(3, Math.hypot(e.clientX - watcherX, e.clientY - watcherY) / 100);
    
    const pupilX = Math.cos(angle) * distance;
    const pupilY = Math.sin(angle) * distance;
    
    leftPupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
    rightPupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
});

// Enter key to send
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('aiChatInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
});
