/* ==========================================
   AI ASSISTANT - CLEAN SEARCH BAR
   ========================================== */

let isSearchOpen = false;
let isListening = false;

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
    if (event.key === 'Enter') {
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

// Send Message
function sendMessage() {
    const input = document.getElementById('aiSearchInput');
    if (!input) return;
    
    const message = input.value.trim();
    
    if (!message) return;
    
    console.log('Sending message:', message);
    
    // TODO: Send to your backend API
    // Example: fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message }) })
    
    alert(`Message sent: "${message}"\n\nThis will be processed by your AI backend!`);
    
    // Clear and close
    input.value = '';
    updateSendButton();
    closeSearchBar();
}

// Toggle Microphone
function toggleMic() {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
}

// Start Listening
function startListening() {
    isListening = true;
    const micBtn = document.getElementById('aiMicBtn');
    const micStatus = document.getElementById('aiMicStatus');
    
    micBtn.classList.add('listening');
    micStatus.classList.add('show');
    
    console.log('Started listening...');
    
    // TODO: Implement Web Speech API
    // const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    // recognition.start();
    
    // Simulate speech recognition for now
    setTimeout(() => {
        stopListening();
        
        // Simulate recognized text
        const input = document.getElementById('aiSearchInput');
        if (input) {
            input.value = "What is the weather today?";
            updateSendButton();
        }
    }, 3000);
}

// Stop Listening
function stopListening() {
    isListening = false;
    const micBtn = document.getElementById('aiMicBtn');
    const micStatus = document.getElementById('aiMicStatus');
    
    micBtn.classList.remove('listening');
    micStatus.classList.remove('show');
    
    console.log('Stopped listening.');
}

// Open file upload
function openFileUpload() {
    const fileInput = document.getElementById('aiFileInput');
    fileInput.click();
}

// Handle file selection
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('aiFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                console.log('Files selected:', files);
                
                const fileNames = Array.from(files).map(f => f.name).join(', ');
                alert(`${files.length} file(s) selected:\n${fileNames}`);
            }
        });
    }
});

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