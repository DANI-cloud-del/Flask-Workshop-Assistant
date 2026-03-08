/* ==========================================
   CHAT FUNCTIONALITY
   Flask AI Workshop Assistant
   ========================================== */

// Chat handler
class ChatHandler {
    constructor() {
        this.settings = {};
        this.messageContainer = null;
        this.inputField = null;
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }
    
    init() {
        // Load settings
        if (window.flaskAISettings && window.flaskAISettings.getSettings) {
            this.settings = window.flaskAISettings.getSettings();
        } else {
            const saved = localStorage.getItem('flaskAISettings');
            this.settings = saved ? JSON.parse(saved) : {};
        }
        
        // Get DOM elements (adjust selectors based on your HTML)
        this.messageContainer = document.getElementById('chatMessages');
        this.inputField = document.getElementById('chatInput');
        
        console.log('Chat handler initialized');
    }
    
    // Display a message in the chat
    displayMessage(text, sender = 'user') {
        if (!this.messageContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;
        
        messageDiv.appendChild(textDiv);
        
        // Add speak button if it's an AI message
        if (sender === 'ai') {
            const speakBtn = this.createSpeakButton(text);
            messageDiv.appendChild(speakBtn);
        }
        
        this.messageContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    // Create speak button for messages
    createSpeakButton(text) {
        const speakBtn = document.createElement('button');
        speakBtn.className = 'speak-btn';
        speakBtn.innerHTML = '<i class="bi bi-volume-up"></i>';
        speakBtn.title = 'Read aloud';
        speakBtn.onclick = () => {
            if (window.speakText) {
                window.speakText(text);
            }
        };
        return speakBtn;
    }
    
    // Handle AI response
    handleAIResponse(responseText) {
        // Display the response
        this.displayMessage(responseText, 'ai');
        
        // Auto-speak if enabled
        if (this.settings.ttsEnabled && this.settings.ttsAutoplay) {
            if (window.speakText) {
                window.speakText(responseText);
            }
        }
        
        // Play sound effect if enabled
        if (this.settings.soundEffects) {
            this.playSoundEffect('message');
        }
    }
    
    // Handle user message
    handleUserMessage(messageText) {
        // Display user message
        this.displayMessage(messageText, 'user');
        
        // Clear input
        if (this.inputField) {
            this.inputField.value = '';
        }
        
        // TODO: Send to backend API
        // this.sendToBackend(messageText);
        
        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            this.handleAIResponse('This is a simulated AI response. Replace this with your actual backend API call.');
        }, 1000);
    }
    
    // Send message to backend
    async sendToBackend(message) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            this.handleAIResponse(data.response);
        } catch (error) {
            console.error('Error sending message:', error);
            this.handleAIResponse('Sorry, there was an error processing your message.');
        }
    }
    
    // Play sound effects
    playSoundEffect(type) {
        // TODO: Add actual sound files
        console.log(`Playing sound: ${type}`);
    }
    
    // Scroll to bottom of chat
    scrollToBottom() {
        if (this.messageContainer) {
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }
    }
}

// Create global chat handler
const chatHandler = new ChatHandler();

// Export for use in other scripts
window.chatHandler = chatHandler;