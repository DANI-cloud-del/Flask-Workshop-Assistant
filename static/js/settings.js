/* ==========================================
   SETTINGS MANAGEMENT
   Flask AI Workshop Assistant
   ========================================== */

// Default settings
const defaultSettings = {
    ttsEnabled: false,
    ttsVoice: '',
    ttsRate: 1.0,
    ttsPitch: 1.0,
    ttsAutoplay: false,
    micEnabled: true,
    micLanguage: 'en-US',
    darkMode: false,
    fontSize: 16,
    enterToSend: true,
    soundEffects: true
};

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('flaskAISettings');
    return saved ? {...defaultSettings, ...JSON.parse(saved)} : defaultSettings;
}

// Save settings to localStorage
function saveSettingsToStorage(settings) {
    localStorage.setItem('flaskAISettings', JSON.stringify(settings));
}

// Get current settings (use this in other files)
function getSettings() {
    return loadSettings();
}

// Initialize settings
let settings = loadSettings();

// ==========================================
// TEXT-TO-SPEECH FUNCTIONS
// ==========================================

let voices = [];
let synth = window.speechSynthesis;

// Load available voices
function loadVoices() {
    voices = synth.getVoices();
    const voiceSelect = document.getElementById('ttsVoice');
    
    if (!voiceSelect) return; // Not on settings page
    
    voiceSelect.innerHTML = '';
    
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        if (voice.default) {
            option.textContent += ' - DEFAULT';
        }
        voiceSelect.appendChild(option);
    });
    
    // Set saved voice
    if (settings.ttsVoice !== '') {
        voiceSelect.value = settings.ttsVoice;
    }
}

// Load voices when available
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}
loadVoices();

function toggleTTS() {
    settings.ttsEnabled = document.getElementById('ttsEnabled').checked;
    saveSettingsToStorage(settings);
}

function saveVoice() {
    settings.ttsVoice = document.getElementById('ttsVoice').value;
    saveSettingsToStorage(settings);
}

function updateRate(value) {
    settings.ttsRate = parseFloat(value);
    document.getElementById('rateValue').textContent = value;
    saveSettingsToStorage(settings);
}

function updatePitch(value) {
    settings.ttsPitch = parseFloat(value);
    document.getElementById('pitchValue').textContent = value;
    saveSettingsToStorage(settings);
}

function toggleAutoplay() {
    settings.ttsAutoplay = document.getElementById('ttsAutoplay').checked;
    saveSettingsToStorage(settings);
}

function testVoice() {
    const utterance = new SpeechSynthesisUtterance('Hello! This is how I sound. I can read your AI responses with this voice, rate, and pitch.');
    utterance.voice = voices[document.getElementById('ttsVoice').value];
    utterance.rate = settings.ttsRate;
    utterance.pitch = settings.ttsPitch;
    synth.speak(utterance);
}

// ==========================================
// OTHER SETTINGS FUNCTIONS
// ==========================================

function toggleMic() {
    settings.micEnabled = document.getElementById('micEnabled').checked;
    saveSettingsToStorage(settings);
}

function toggleDarkMode() {
    settings.darkMode = document.getElementById('darkMode').checked;
    document.body.classList.toggle('dark', settings.darkMode);
    saveSettingsToStorage(settings);
}

function updateFontSize(value) {
    settings.fontSize = parseInt(value);
    document.getElementById('fontSizeValue').textContent = value;
    document.body.style.fontSize = value + 'px';
    saveSettingsToStorage(settings);
}

function toggleEnterToSend() {
    settings.enterToSend = document.getElementById('enterToSend').checked;
    saveSettingsToStorage(settings);
}

function toggleSoundEffects() {
    settings.soundEffects = document.getElementById('soundEffects').checked;
    saveSettingsToStorage(settings);
}

function saveSettings() {
    saveSettingsToStorage(settings);
    
    // Show success message
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Saved!';
    btn.classList.add('bg-green-500');
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-500');
    }, 2000);
}

function resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
        settings = {...defaultSettings};
        saveSettingsToStorage(settings);
        location.reload();
    }
}

// ==========================================
// INITIALIZE UI
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Only run on settings page
    if (!document.getElementById('ttsEnabled')) return;
    
    // Apply saved settings to UI
    document.getElementById('ttsEnabled').checked = settings.ttsEnabled;
    document.getElementById('ttsRate').value = settings.ttsRate;
    document.getElementById('ttsPitch').value = settings.ttsPitch;
    document.getElementById('ttsAutoplay').checked = settings.ttsAutoplay;
    document.getElementById('micEnabled').checked = settings.micEnabled;
    document.getElementById('micLanguage').value = settings.micLanguage;
    document.getElementById('darkMode').checked = settings.darkMode;
    document.getElementById('fontSize').value = settings.fontSize;
    document.getElementById('enterToSend').checked = settings.enterToSend;
    document.getElementById('soundEffects').checked = settings.soundEffects;
    
    document.getElementById('rateValue').textContent = settings.ttsRate;
    document.getElementById('pitchValue').textContent = settings.ttsPitch;
    document.getElementById('fontSizeValue').textContent = settings.fontSize;
    
    // Apply dark mode if enabled
    if (settings.darkMode) {
        document.body.classList.add('dark');
    }
    
    // Apply font size
    document.body.style.fontSize = settings.fontSize + 'px';
});

// Export functions for use in other scripts
window.flaskAISettings = {
    getSettings: getSettings,
    saveSettings: saveSettingsToStorage,
    loadSettings: loadSettings
};