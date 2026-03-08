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
        this.initialized = false;
        
        // Load voices
        this.loadVoices();
        
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
        
        // Try multiple times to load voices (browser quirk)
        setTimeout(() => this.loadVoices(), 100);
        setTimeout(() => this.loadVoices(), 500);
        setTimeout(() => this.loadVoices(), 1000);
        
        // Listen for settings changes
        window.addEventListener('settingsChanged', () => {
            this.updateSettings();
        });
    }
    
    loadVoices() {
        this.voices = this.synth.getVoices();
        if (this.voices.length > 0 && !this.initialized) {
            this.initialized = true;
            console.log(`TTS: Loaded ${this.voices.length} voices`);
            this.updateSettings();
        }
    }
    
    updateSettings() {
        if (window.flaskAISettings && window.flaskAISettings.getSettings) {
            this.settings = window.flaskAISettings.getSettings();
        } else {
            // Fallback if settings not loaded
            const saved = localStorage.getItem('flaskAISettings');
            this.settings = saved ? JSON.parse(saved) : { ttsEnabled: false };
        }
        console.log('TTS settings updated:', {
            enabled: this.settings.ttsEnabled,
            autoplay: this.settings.ttsAutoplay,
            voice: this.voices[this.settings.ttsVoice]?.name || 'default'
        });
    }
    
    // Find best female voice (same logic as settings.js)
    findBestVoice() {
        const preferredVoices = [
            'Microsoft Ava',
            'Microsoft Jenny',
            'Microsoft Aria',
            'Google Australian English Female',
            'Google UK English Female',
            'Google US English Female',
            'Samantha',
            'Karen',
            'Female',
        ];
        
        for (const preferred of preferredVoices) {
            const voice = this.voices.find(v => 
                v.name.includes(preferred) || 
                v.name.toLowerCase().includes(preferred.toLowerCase())
            );
            if (voice) return voice;
        }
        
        // Fallback
        const femaleVoice = this.voices.find(v => 
            v.lang.startsWith('en') && 
            v.name.toLowerCase().includes('female')
        );
        
        return femaleVoice || this.voices.find(v => v.default) || this.voices[0];
    }
    
    // Main function to speak text
    speak(text) {
        // Update settings first
        this.updateSettings();
        
        // Check if TTS is enabled
        if (!this.settings.ttsEnabled) {
            console.log('TTS is disabled in settings');
            return;
        }
        
        // Make sure voices are loaded
        if (this.voices.length === 0) {
            this.voices = this.synth.getVoices();
            if (this.voices.length === 0) {
                console.warn('No voices available yet');
                return;
            }
        }
        
        // Stop any ongoing speech
        this.synth.cancel();
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Apply voice
        let selectedVoice = null;
        
        if (this.settings.ttsVoice !== '' && this.voices[this.settings.ttsVoice]) {
            // Use saved voice
            selectedVoice = this.voices[this.settings.ttsVoice];
        } else {
            // Auto-select best voice
            selectedVoice = this.findBestVoice();
        }
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log('Speaking with voice:', selectedVoice.name);
        }
        
        // Apply rate and pitch
        utterance.rate = this.settings.ttsRate || 1.0;
        utterance.pitch = this.settings.ttsPitch || 1.0;
        
        // Add event listeners
        utterance.onstart = () => {
            console.log('TTS started');
        };
        
        utterance.onend = () => {
            console.log('TTS ended');
        };
        
        utterance.onerror = (event) => {
            console.error('TTS error:', event.error);
        };
        
        // Speak
        try {
            this.synth.speak(utterance);
        } catch (error) {
            console.error('TTS speak error:', error);
        }
    }
    
    // Stop speaking
    stop() {
        this.synth.cancel();
    }
    
    // Check if speaking
    isSpeaking() {
        return this.synth.speaking;
    }
    
    // Check if TTS is enabled
    isEnabled() {
        this.updateSettings();
        return this.settings.ttsEnabled === true;
    }
    
    // Check if autoplay is enabled
    isAutoplayEnabled() {
        this.updateSettings();
        return this.settings.ttsAutoplay === true;
    }
}

// Create global TTS handler
const ttsHandler = new TTSHandler();

// Export for use in other scripts
window.speakText = (text) => ttsHandler.speak(text);
window.stopSpeaking = () => ttsHandler.stop();
window.isSpeaking = () => ttsHandler.isSpeaking();
window.ttsHandler = ttsHandler; // For debugging