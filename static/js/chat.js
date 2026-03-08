// Load settings
const settings = JSON.parse(localStorage.getItem('flaskAISettings')) || {};

// Speak AI response
function handleAIResponse(responseText) {
    // Display the response
    displayMessage(responseText, 'ai');
    
    // Auto-speak if enabled
    if (settings.ttsEnabled && settings.ttsAutoplay) {
        window.speakText(responseText);
    }
}

// Add manual speak button to each message
function addSpeakButton(messageElement, text) {
    const speakBtn = document.createElement('button');
    speakBtn.innerHTML = '<i class="bi bi-volume-up"></i>';
    speakBtn.onclick = () => window.speakText(text);
    messageElement.appendChild(speakBtn);
}
