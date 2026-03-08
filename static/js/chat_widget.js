/* ==========================================
   FLOATING AI CHAT WIDGET
   ChatGPT/Perplexity Style Interface
   ========================================== */

let conversationHistory = [];
let isChatOpen = false;

// Create chat widget HTML
function createChatWidget() {
    const widgetHTML = `
        <!-- Floating AI Pill Button -->
        <div id="aiPillButton" class="ai-pill-button" onclick="toggleChat()">
            <div class="ai-pill-face">
                <div class="ai-eye left"></div>
                <div class="ai-eye right"></div>
            </div>
            <span class="ai-pill-text">Ask AI</span>
        </div>

        <!-- Chat Widget Container (Hidden by default) -->
        <div id="chatWidget" class="chat-widget" style="display: none;">
            <!-- Header -->
            <div class="chat-widget-header">
                <div class="flex items-center gap-2">
                    <div class="ai-avatar-small">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219z"/>
                            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2z"/>
                        </svg>
                    </div>
                    <div>
                        <div class="font-semibold text-white">AI Assistant</div>
                        <div class="text-xs text-white/80">Always here to help</div>
                    </div>
                </div>
                <button onclick="toggleChat()" class="close-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
            </div>

            <!-- Messages Area -->
            <div id="chatMessages" class="chat-widget-messages">
                <!-- Welcome Message -->
                <div class="welcome-message" id="welcomeMessage">
                    <div class="welcome-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219z"/>
                            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2z"/>
                        </svg>
                    </div>
                    <h3>Hi! I'm your AI Assistant 👋</h3>
                    <p>Ask me anything about Flask, Python, web development, or general questions!</p>
                    <div class="suggestion-chips">
                        <div class="chip" onclick="sendSuggestion('What is Flask?')">💡 What is Flask?</div>
                        <div class="chip" onclick="sendSuggestion('How do I create a REST API?')">🚀 Create REST API</div>
                        <div class="chip" onclick="sendSuggestion('Explain OAuth')">🔐 Explain OAuth</div>
                    </div>
                </div>

                <!-- Typing Indicator -->
                <div class="typing-indicator" id="typingIndicator" style="display: none;">
                    <div class="message-bubble ai">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="chat-widget-input">
                <textarea 
                    id="chatWidgetInput" 
                    placeholder="Ask me anything..."
                    rows="1"
                    onkeydown="handleChatKeyPress(event)"
                    oninput="autoResizeInput(this)"
                ></textarea>
                <button id="sendButton" onclick="sendChatMessage()" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11Z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Insert into body
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Add input event listener
    document.getElementById('chatWidgetInput').addEventListener('input', updateSendButton);
}

// Toggle chat widget
function toggleChat() {
    isChatOpen = !isChatOpen;
    const widget = document.getElementById('chatWidget');
    const pill = document.getElementById('aiPillButton');

    if (isChatOpen) {
        widget.style.display = 'flex';
        pill.style.display = 'none';
        setTimeout(() => {
            document.getElementById('chatWidgetInput').focus();
        }, 300);
    } else {
        widget.style.display = 'none';
        pill.style.display = 'flex';
    }
}

// Add message to chat
function addChatMessage(content, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const welcomeMessage = document.getElementById('welcomeMessage');

    // Hide welcome message on first user message
    if (welcomeMessage && type === 'user') {
        welcomeMessage.style.display = 'none';
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message-bubble ${type}`;
    messageDiv.innerHTML = formatChatMessage(content);

    // Insert before typing indicator
    const typingIndicator = document.getElementById('typingIndicator');
    messagesContainer.insertBefore(messageDiv, typingIndicator);

    // Scroll to bottom
    scrollChatToBottom();
}

// Format message
function formatChatMessage(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

// Show/hide typing indicator
function setTypingIndicator(show) {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = show ? 'block' : 'none';
    if (show) scrollChatToBottom();
}

// Scroll to bottom
function scrollChatToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Auto-resize textarea
function autoResizeInput(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Update send button state
function updateSendButton() {
    const input = document.getElementById('chatWidgetInput');
    const sendBtn = document.getElementById('sendButton');
    sendBtn.disabled = !input.value.trim();
}

// Handle key press
function handleChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

// Send suggestion
function sendSuggestion(text) {
    document.getElementById('chatWidgetInput').value = text;
    updateSendButton();
    sendChatMessage();
}

// Send message
async function sendChatMessage() {
    const input = document.getElementById('chatWidgetInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');

    // Update conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    // Clear input
    input.value = '';
    autoResizeInput(input);
    updateSendButton();

    // Show typing indicator
    setTypingIndicator(true);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                conversation_history: conversationHistory
            })
        });

        const data = await response.json();

        if (data.success) {
            conversationHistory.push({
                role: 'assistant',
                content: data.response
            });

            // Keep only last 10 messages
            if (conversationHistory.length > 10) {
                conversationHistory = conversationHistory.slice(-10);
            }

            setTypingIndicator(false);
            addChatMessage(data.response, 'ai');
        } else {
            setTypingIndicator(false);
            addChatMessage('Sorry, I encountered an error. Please try again.', 'ai');
        }
    } catch (error) {
        console.error('Error:', error);
        setTypingIndicator(false);
        addChatMessage('Sorry, I could not connect to the server.', 'ai');
    }
}

// Initialize widget on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
} else {
    createChatWidget();
}