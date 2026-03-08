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
    // Trigger event so other pages know settings changed
    window.dispatchEvent(new CustomEvent('settingsChanged', { detail: settings }));
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

// Find best female natural voice
function findBestVoice(voices) {
    // Priority list of preferred voices
    const preferredVoices = [
        // Microsoft Edge voices
        'Microsoft Ava',
        'Microsoft Jenny',
        'Microsoft Aria',
        // Google Chrome voices
        'Google Australian English Female',
        'Google UK English Female',
        'Google US English Female',
        // iOS voices
        'Samantha',
        'Karen (Enhanced)',
        'Karen',
        // Android voices
        'en-au-x-aua-network',
        'en-gb-x-gbg-network',
        'en-us-x-sfg-network',
        // Any female voice
        'Female',
    ];
    
    // Try to find preferred voices in order
    for (const preferred of preferredVoices) {
        const voice = voices.find(v => 
            v.name.includes(preferred) || 
            v.name.toLowerCase().includes(preferred.toLowerCase())
        );
        if (voice) return voice;
    }
    
    // Fallback: find any female English voice
    const femaleVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.toLowerCase().includes('female') || 
         v.name.toLowerCase().includes('woman'))
    );
    if (femaleVoice) return femaleVoice;
    
    // Last resort: default voice
    return voices.find(v => v.default) || voices[0];
}

// Load available voices
function loadVoices() {
    voices = synth.getVoices();
    const voiceSelect = document.getElementById('ttsVoice');
    
    if (!voiceSelect) return; // Not on settings page
    
    voiceSelect.innerHTML = '';
    
    // Group voices by language
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const otherVoices = voices.filter(v => !v.lang.startsWith('en'));
    
    // Add English voices first
    if (englishVoices.length > 0) {
        const group = document.createElement('optgroup');
        group.label = 'English Voices';
        englishVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = voices.indexOf(voice);
            option.textContent = `${voice.name} (${voice.lang})`;
            
            // Mark special voices
            if (voice.name.includes('Natural') || voice.name.includes('Neural')) {
                option.textContent += ' ✨';
            }
            if (voice.name.toLowerCase().includes('female')) {
                option.textContent += ' 👩';
            }
            
            group.appendChild(option);
        });
        voiceSelect.appendChild(group);
    }
    
    // Add other voices
    if (otherVoices.length > 0) {
        const group = document.createElement('optgroup');
        group.label = 'Other Languages';
        otherVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = voices.indexOf(voice);
            option.textContent = `${voice.name} (${voice.lang})`;
            group.appendChild(option);
        });
        voiceSelect.appendChild(group);
    }
    
    // Auto-select best voice if not set
    if (settings.ttsVoice === '' && voices.length > 0) {
        const bestVoice = findBestVoice(voices);
        const bestIndex = voices.indexOf(bestVoice);
        settings.ttsVoice = bestIndex.toString();
        saveSettingsToStorage(settings);
        voiceSelect.value = bestIndex;
        
        // Add indicator
        const recommendedText = document.createElement('p');
        recommendedText.className = 'text-sm text-green-600 mt-1';
        recommendedText.innerHTML = `✓ Auto-selected: ${bestVoice.name}`;
        voiceSelect.parentNode.appendChild(recommendedText);
    } else if (settings.ttsVoice !== '') {
        voiceSelect.value = settings.ttsVoice;
    }
}

// Load voices when available
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}

// Try to load voices immediately and after delay
loadVoices();
setTimeout(loadVoices, 100);
setTimeout(loadVoices, 500);

function toggleTTS() {
    settings.ttsEnabled = document.getElementById('ttsEnabled').checked;
    saveSettingsToStorage(settings);
    console.log('TTS enabled:', settings.ttsEnabled);
}

function saveVoice() {
    settings.ttsVoice = document.getElementById('ttsVoice').value;
    saveSettingsToStorage(settings);
    console.log('Voice saved:', voices[settings.ttsVoice]?.name);
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
    console.log('TTS autoplay:', settings.ttsAutoplay);
}

function testVoice() {
    // Make sure voices are loaded
    if (voices.length === 0) {
        voices = synth.getVoices();
    }
    
    const voiceIndex = document.getElementById('ttsVoice').value;
    const utterance = new SpeechSynthesisUtterance('Hello! This is how I sound. I can read your AI responses with this voice, rate, and pitch.');
    
    if (voices[voiceIndex]) {
        utterance.voice = voices[voiceIndex];
    }
    utterance.rate = settings.ttsRate;
    utterance.pitch = settings.ttsPitch;
    
    synth.cancel(); // Stop any ongoing speech
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
    
    // Update toggle visual states
    const toggles = [
        'ttsEnabled', 'ttsAutoplay', 'micEnabled', 
        'darkMode', 'enterToSend', 'soundEffects'
    ];
    
    toggles.forEach(id => {
        const checkbox = document.getElementById(id);
        const label = checkbox.nextElementSibling;
        const indicator = label.nextElementSibling;
        
        if (checkbox.checked) {
            label.classList.add('bg-[#00b4d8]');
            label.classList.remove('bg-gray-300');
            indicator.classList.add('right-1');
            indicator.classList.remove('left-1');
        }
    });
    
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