/* ==========================================
   AI ASSISTANT - SEARCH BAR STYLE
   ========================================== */

let isExpanded = false;

// Mouse following eyes
document.addEventListener('mousemove', (e) => {
    // Pill eyes
    const pillLeft = document.getElementById('pillLeftPupil');
    const pillRight = document.getElementById('pillRightPupil');
    if (pillLeft && pillRight) {
        const face = pillLeft.closest('.ai-face');
        if (face) updateEyes(face, pillLeft, pillRight, e);
    }
    
    // Watcher eyes
    const watcherLeft = document.getElementById('watcherLeftPupil');
    const watcherRight = document.getElementById('watcherRightPupil');
    if (watcherLeft && watcherRight) {
        const watcher = watcherLeft.closest('.ai-watcher');
        if (watcher) updateEyes(watcher, watcherLeft, watcherRight, e);
    }
});

function updateEyes(faceElement, leftPupil, rightPupil, mouseEvent) {
    const rect = faceElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(mouseEvent.clientY - centerY, mouseEvent.clientX - centerX);
    const distance = Math.min(2, Math.hypot(mouseEvent.clientX - centerX, mouseEvent.clientY - centerY) / 100);
    
    const pupilX = Math.cos(angle) * distance;
    const pupilY = Math.sin(angle) * distance;
    
    leftPupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
    rightPupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
}

// Expand search bar
function expandSearchBar() {
    const container = document.getElementById('aiContainer');
    container.classList.add('expanded');
    isExpanded = true;
    
    // Focus input after animation
    setTimeout(() => {
        const input = document.getElementById('aiSearchInput');
        if (input) input.focus();
    }, 300);
}

// Collapse search bar
function collapseSearchBar() {
    const container = document.getElementById('aiContainer');
    const input = document.getElementById('aiSearchInput');
    
    container.classList.remove('expanded');
    isExpanded = false;
    
    // Clear input
    if (input) input.value = '';
}

// Send message
function sendSearchMessage() {
    const input = document.getElementById('aiSearchInput');
    const message = input.value.trim();
    
    if (!message) {
        return; // Don't send empty messages
    }
    
    // Here you would send to your backend API
    console.log('Sending message:', message);
    
    // Show processing (you can expand this with chat interface)
    alert(`Message sent: "${message}"\n\nThis will be processed by your AI!`);
    
    // Clear and collapse
    input.value = '';
    collapseSearchBar();
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
                alert(`${files.length} file(s) selected!\n\nYou can now send them with your message.`);
            }
        });
    }
    
    // Set username
    const username = document.body.dataset.username || 'User';
    // You can use this for welcome messages if needed
});

// Click outside to collapse
document.addEventListener('click', (e) => {
    const container = document.getElementById('aiContainer');
    if (isExpanded && !container.contains(e.target)) {
        collapseSearchBar();
    }
});

// Escape key to collapse
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isExpanded) {
        collapseSearchBar();
    }
});
