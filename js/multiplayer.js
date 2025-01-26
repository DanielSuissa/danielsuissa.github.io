// Multiplayer game state
let multiplayerState = {
    gameName: '',
    startTime: '',
    boardSize: 0,
    pattern: [],
    gameId: ''
};

function selectGameMode(mode) {
    if (mode === 'print') {
        //containers
        document.querySelector('#printMode').style.display = 'block';
        document.querySelector('#multiplayerMode').style.display = 'none';
        document.querySelector('#modeSelection').style.display = 'none';

        //steps
        appState.step = 'step1';
    } else {
        document.querySelector('#printMode').style.display = 'none';
        document.querySelector('#multiplayerMode').style.display = 'block';
        document.querySelector('#modeSelection').style.display = 'none';
        appState.step = 'multiplayerSetup';
    }
    appState.mode = mode;
    updateUrl();
    updateUI();
}

function selectMultiplayerBoardSize(event, size) {
    multiplayerState.boardSize = size;
    document.querySelectorAll('.board-size-selection .mdc-button').forEach(btn => {
        btn.classList.remove('btn-checked');
    });
    event.target.classList.add('btn-checked');
}

function showPatternSelection() {
    const customPatternElement = document.getElementById('customPatternElement');
    const size = multiplayerState.boardSize;
    
    // Initialize empty pattern
    multiplayerState.pattern = Array(size).fill().map(() => Array(size).fill(false));
    
    // Create pattern selection grid
    let html = `
        <h2 class="mdc-typography--headline6">Select Winning Pattern</h2>
        <p class="mdc-typography--body1">Click cells to create the winning pattern</p>
        <div class="pattern-grid" style="grid-template-columns: repeat(${size}, 1fr);">
    `;
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            html += `<div class="pattern-cell" data-row="${i}" data-col="${j}" onclick="togglePatternCell(${i}, ${j})"></div>`;
        }
    }
    
    html += `</div>
        <button class="mdc-button mdc-button--raised" onclick="createGame()">
            <span class="mdc-button__label">Create Game</span>
        </button>
    `;
    
    customPatternElement.innerHTML = html;
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    customPatternElement.classList.add('active');
}

function togglePatternCell(row, col) {
    const cell = document.querySelector(`.pattern-cell[data-row="${row}"][data-col="${col}"]`);
    multiplayerState.pattern[row][col] = !multiplayerState.pattern[row][col];
    cell.classList.toggle('selected');
}

async function createGame() {
    // Ensure at least one cell is selected
    if (!multiplayerState.pattern.some(row => row.some(cell => cell))) {
        alert('Please select at least one cell for the winning pattern');
        return;
    }

    try {
        const response = await fetch(`${CONFIG.WORKER_URL}/api/create-game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(multiplayerState)
        });

        if (!response.ok) {
            throw new Error('Failed to create game');
        }

        const game = await response.json();
        showGameCreated(game);
    } catch (error) {
        alert('Error creating game: ' + error.message);
    }
}

function showGameCreated(game) {
    const step3 = document.getElementById('multiplayerStep3');
    const gameUrl = `${window.location.origin}/game/${game.id}`;
    
    const html = `
        <h2 class="mdc-typography--headline6">Game Created Successfully!</h2>
        <div class="game-info">
            <p><strong>Game Name:</strong> ${game.name}</p>
            <p><strong>Start Time:</strong> ${new Date(game.startTime).toLocaleString()}</p>
            <p><strong>Players:</strong> 0/200</p>
            <p><strong>Share this link with players:</strong></p>
            <div class="game-link">${gameUrl}</div>
            <button class="mdc-button mdc-button--raised copy-button" onclick="copyGameLink('${gameUrl}')">
                <span class="mdc-button__icon material-icons">content_copy</span>
                <span class="mdc-button__label">Copy Link</span>
            </button>
            <button class="mdc-button mdc-button--raised" onclick="goToHostView('${game.id}')">
                <span class="mdc-button__label">Go to Host View</span>
            </button>
        </div>
    `;
    
    step3.innerHTML = html;
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    step3.classList.add('active');
}

function copyGameLink(url) {
    navigator.clipboard.writeText(url)
        .then(() => {
            const button = document.querySelector('.copy-button');
            const label = button.querySelector('.mdc-button__label');
            const originalText = label.textContent;
            label.textContent = 'Copied!';
            setTimeout(() => {
                label.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            alert('Failed to copy link: ' + err.message);
        });
}

function goToHostView(gameId) {
    window.location.href = `/host/${gameId}`;
}