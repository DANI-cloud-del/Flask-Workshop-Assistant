/* ==========================================
   TEXT-TO-SPEECH UTILITIES
   Flask AI Workshop Assistant
   ========================================== */

// Text-to-Speech handler
class TTSHandler {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.settings = {};
        
        // Load voices
        this.loadVoices();
        
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    }
    
    loadVoices() {
        this.voices = this.synth.getVoices();
    }
    
    updateSettings() {
        if (window.flaskAISettings && window.flaskAISettings.getSettings) {
            this.settings = window.flaskAISettings.getSettings();
        } else {
            // Fallback if settings not loaded
            const saved = localStorage.getItem('flaskAISettings');
            this.settings = saved ? JSON.parse(saved) : {};
        }
    }
    
    // Main function to speak text
    speak(text) {
        this.updateSettings();
        
        if (!this.settings.ttsEnabled) {
            console.log('TTS is disabled in settings');
            return;
        }
        
        // Stop any ongoing speech
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Apply voice if set
        if (this.settings.ttsVoice !== '' && this.voices[this.settings.ttsVoice]) {
            utterance.voice = this.voices[this.settings.ttsVoice];
        }
        
        // Apply rate and pitch
        utterance.rate = this.settings.ttsRate || 1.0;
        utterance.pitch = this.settings.ttsPitch || 1.0;
        
        // Speak
        this.synth.speak(utterance);
    }
    
    // Stop speaking
    stop() {
        this.synth.cancel();
    }
    
    // Check if speaking
    isSpeaking() {
        return this.synth.speaking;
    }
}

// Create global TTS handler
const ttsHandler = new TTSHandler();

// Export for use in other scripts
window.speakText = (text) => ttsHandler.speak(text);
window.stopSpeaking = () => ttsHandler.stop();
window.isSpeaking = () => ttsHandler.isSpeaking();