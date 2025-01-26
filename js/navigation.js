// Step navigation map - defines the previous step for each step
const STEP_NAVIGATION = {
    print: ['modeSelection', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6'],
    multiplayer: ['modeSelection', 'multiplayerSetup', 'patternSelection', 'gameCreated']
};

// State cleanup map - defines what state to clear when going back
const STATE_CLEANUP = {
    'step1': () => {
        appState.mode = null;
    },
    'step2': () => {
        appState.boardType = null;
    },
    'step3': () => {
        appState.boardSize = null;
    },
    'step4': () => {
        appState.selectedImages = [];
    },
    'multiplayerSetup': () => {
        appState.mode = null;
        document.getElementById('gameName').value = '';
        document.getElementById('gameStartTime').value = '';
        appState.boardSize = null;
    },
    'patternSelection': () => {
        appState.selectedPatterns.clear();
        appState.customPattern = null;
    }
};

function handleBack() {
    // Get current step from appState
    const currentStep = appState.step;
    const currentMode = appState.mode;

    // If we're at the first step, there's nowhere to go back to
    if (currentStep === 'modeSelection') {
        return;
    }

    // Get the previous step from our navigation map
    const currentStepIndex = STEP_NAVIGATION[currentMode].indexOf(currentStep);
    const previousStep = STEP_NAVIGATION[currentMode][currentStepIndex - 1];

    //TODO: If we have a cleanup function for this step, run it
    if (STATE_CLEANUP[currentStep]) {
        STATE_CLEANUP[currentStep]();
    }

    // Update the app state
    appState.step = previousStep;

    // For the mode selection step, hide the back button
    if (previousStep === 'modeSelection') {
        document.getElementById('backButton').style.display = 'none';
        document.getElementById('modeSelection').style.display = 'block';
    }

    // Update URL without adding to history (replace instead of push)
    const params = new URLSearchParams();
    if (appState.mode) params.set('mode', appState.mode);
    if (appState.step !== 'modeSelection') params.set('step', appState.step);
    if (appState.boardSize) params.set('boardSize', appState.boardSize);
    if (appState.selectedPatterns.size > 0) {
        params.set('patterns', Array.from(appState.selectedPatterns).join(','));
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.replaceState(appState, '', newUrl);

    // Update the UI
    updateUI();

    // Additional cleanup based on the step we're going back to
    switch (previousStep) {
        case 'multiplayerSetup':
            // Reset board size selection highlighting
            document.querySelectorAll('[data-size]').forEach(btn => {
                btn.classList.remove('mdc-button--unelevated');
            });
            break;

        case 'patternSelection':
            // Reset pattern selection UI
            updatePatternUI();
            break;

        case 'modeSelection':
            // Reset everything
            document.querySelectorAll('input').forEach(input => {
                input.value = '';
            });
            break;
    }

    // If there are any active event listeners or connections, clean them up
    if (currentStep === 'gameCreated') {
        // Clean up any active SSE connections
        if (window.eventStreamManager) {
            window.eventStreamManager.disconnect();
        }
    }
}

// Helper function to check if we can go back
function canGoBack() {
    return appState.step !== 'modeSelection';
}

// Add event listener for browser back button
window.addEventListener('popstate', (event) => {
    if (event.state) {
        // Use the state from the history entry
        appState = event.state;
        updateUI();
    } else {
        // If no state, go back to mode selection
        appState = {
            mode: null,
            step: 'modeSelection',
            boardSize: null,
            selectedPatterns: new Set(),
            customPattern: null
        };
        updateUI();
    }
});

// Initialize from URL if exists
function initFromUrl() {
    const params = new URLSearchParams(window.location.search);
    appState.mode = params.get('mode') || null;
    appState.step = params.get('step') || 'modeSelection';
    appState.boardSize = params.get('boardSize') ? parseInt(params.get('boardSize')) : null;

    if (params.get('patterns')) {
        appState.selectedPatterns = new Set(params.get('patterns').split(','));
    }

    updateUI();
}

// Update URL with current state
function updateUrl() {
    const params = new URLSearchParams();
    if (appState.mode) params.set('mode', appState.mode);
    if (appState.step !== 'modeSelection') params.set('step', appState.step);
    if (appState.boardSize) params.set('boardSize', appState.boardSize);
    if (appState.selectedPatterns.size > 0) {
        params.set('patterns', Array.from(appState.selectedPatterns).join(','));
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState(appState, '', newUrl);
}

function setStep(step){
    appState.step=step;
    updateUrl();
}

// Handle browser back button
window.addEventListener('popstate', (event) => {
    if (event.state) {
        appState = event.state;
        updateUI();
    } else {
        initFromUrl();
    }
});
