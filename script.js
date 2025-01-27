// Configuration
const CONFIG = {
    WORKER_URL: 'https://bingomaker.xyz',
    MAX_BOARD_SIZE: 10,
    MIN_BOARD_SIZE: 2,
    DEFAULT_MAX_NUMBER: 75,
    MAX_BOARDS: 100
};

// State management
let state = {
    boardType: null,
    boardSize: null,
    selectedImages: [],
    boardCount: null
};

// Initialize Material components
document.addEventListener('DOMContentLoaded', function () {
    mdc.autoInit();
});

// Helper Functions
function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

// Step 1: Board Type Selection
function selectBoardType(type) {
    state.boardType = type;
    showStep(2);
}

// Step 2: Board Size Selection
function selectBoardSize(size) {
    state.boardSize = size;
    let nextStep;
    if (state.boardType === 'images') {
        nextStep = 3;
        setupDragAndDrop();
        updateRemainingCounter();
    } else {
        nextStep = 4;
    }
    if(typeof setStep !== 'undefined'){
        setStep(`step${nextStep}`);
    }
    showStep(nextStep);
}

function showCustomSizeDialog() {
    const size = prompt('Enter board size (e.g., 7 for 7x7):', '');
    if (size && !isNaN(size)) {
        const sizeNum = parseInt(size);
        if (sizeNum >= CONFIG.MIN_BOARD_SIZE && sizeNum <= CONFIG.MAX_BOARD_SIZE) {
            selectBoardSize(sizeNum);
        } else {
            alert(`Board size must be between ${CONFIG.MIN_BOARD_SIZE} and ${CONFIG.MAX_BOARD_SIZE}`);
        }
    }
}

// Image Search and Selection
async function searchImages(query) {
    if (!query) return;

    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '<div>Searching images...</div>';

    try {
        const response = await fetch(`${CONFIG.WORKER_URL}/api/unsplash/search/photos?query=${encodeURIComponent(query)}&per_page=20`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        searchResults.innerHTML = '';

        data.results.forEach(result => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'search-result-container';

            const img = document.createElement('img');
            img.src = result.urls.thumb;
            img.dataset.fullUrl = result.urls.regular;
            img.className = 'search-result-img';

            const overlay = document.createElement('div');
            overlay.className = 'image-attribution-overlay';
            overlay.innerHTML = `Photo by <a href="https://unsplash.com/@${result.user.username}?utm_source=bingo_generator&utm_medium=referral" target="_blank">${result.user.name}</a> on <a href="https://unsplash.com/?utm_source=bingo_generator&utm_medium=referral" target="_blank">Unsplash</a>`;

            imgContainer.onclick = () => selectImage(result.urls.regular, `/api/unsplash/photos/${result.id}/download`);
            imgContainer.appendChild(img);
            imgContainer.appendChild(overlay);
            searchResults.appendChild(imgContainer);
        });
    } catch (error) {
        searchResults.innerHTML = 'Error searching images. Please try again.';
        console.error('Error searching images:', error);
    }
}

async function trackUnsplashDownload(downloadEndpoint) {
    try {
        await fetch(`${CONFIG.WORKER_URL}${downloadEndpoint}`);
        console.log('Download tracked successfully');
    } catch (error) {
        console.error('Error tracking download:', error);
    }
}

// Step 4: Board Count Selection
function showCustomCountDialog() {
    const count = prompt('Enter number of boards to generate:', '');
    if (count && !isNaN(count)) {
        const countNum = parseInt(count);
        if (countNum > 0 && countNum <= CONFIG.MAX_BOARDS) {
            selectBoardCount(countNum);
        } else {
            alert(`Please enter a number between 1 and ${CONFIG.MAX_BOARDS}`);
        }
    }
}

function selectBoardCount(count) {
    state.boardCount = count;
    startGeneration();
}

// Step 5: Generation Process
function startGeneration() {
    showStep(5);
    const progressBar = new mdc.linearProgress.MDCLinearProgress(document.getElementById('progressBar'));
    progressBar.progress = 0;

    let progress = 0;
    const interval = setInterval(() => {
        progress += 0.1;
        progressBar.progress = progress;

        if (progress >= 1) {
            clearInterval(interval);
            generateBoards();
        }
    }, 1000);
}

// Content Generation Functions
function generateBoardContent(size) {
    const numbers = new Set();
    const maxNum = Math.max(CONFIG.DEFAULT_MAX_NUMBER, size * size);
    const requiredNumbers = size * size;

    while (numbers.size < requiredNumbers) {
        numbers.add(Math.floor(Math.random() * maxNum) + 1);
    }
    return Array.from(numbers);
}

function generateImageBoard(size, images) {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, size * size);
}

// Drag and Drop Management
function setupDragAndDrop() {
    const selectedImagesDiv = document.getElementById('selectedImages');

    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const highlight = () => selectedImagesDiv.classList.add('drag-over');
    const unhighlight = () => selectedImagesDiv.classList.remove('drag-over');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        selectedImagesDiv.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        selectedImagesDiv.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        selectedImagesDiv.addEventListener(eventName, unhighlight, false);
    });

    selectedImagesDiv.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const files = Array.from(e.dataTransfer.files).filter(file =>
        file.type.startsWith('image/')
    );

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (state.selectedImages.length < state.boardSize * state.boardSize) {
                state.selectedImages.push(event.target.result);
                updateSelectedImages();
                updateRemainingCounter();
            }
        };
        reader.readAsDataURL(file);
    });
}

// UI Update Functions
function updateRemainingCounter() {
    const totalNeeded = state.boardSize * state.boardSize;
    const selected = state.selectedImages.length;
    const remaining = Math.max(0, totalNeeded - selected);

    const counterContainer = document.getElementById('remainingCounter');
    if (counterContainer) {
        counterContainer.innerHTML = `Remaining to select: <span>${remaining}</span> images`;
    }
}

function updateSelectedImages() {
    const container = document.getElementById('selectedImages');
    container.innerHTML = '<div class="selected-images-count">' + state.selectedImages.length + '</div>';

    state.selectedImages.forEach((src, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.display = 'inline-block';
        imgContainer.style.margin = '4px';

        const img = document.createElement('img');
        img.src = src;
        img.classList.add('thumbnail');

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.className = 'mdc-button mdc-button--raised';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '-8px';
        removeBtn.style.right = '-8px';
        removeBtn.style.minWidth = '24px';
        removeBtn.style.width = '24px';
        removeBtn.style.height = '24px';
        removeBtn.style.padding = '0';
        removeBtn.onclick = () => {
            state.selectedImages.splice(index, 1);
            updateSelectedImages();
            updateContinueButton();
            updateRemainingCounter();
        };

        imgContainer.appendChild(img);
        imgContainer.appendChild(removeBtn);
        container.appendChild(imgContainer);
    });

    updateContinueButton();
}

function selectImage(src, downloadLocation) {
    const maxImages = state.boardSize * state.boardSize;
    if (state.selectedImages.length < maxImages) {
        state.selectedImages.push(src);
        updateSelectedImages();
        updateRemainingCounter();

        if (downloadLocation) {
            setTimeout(() => {
                trackUnsplashDownload(downloadLocation)
                    .catch(error => console.error('Failed to track download:', error));
            }, 0);
        }

        if (state.selectedImages.length === maxImages) {
            showStep(4);
            showStep('step4');
        }
    }
}

function updateContinueButton() {
    const continueButton = document.getElementById('continueButton');
    if (state.selectedImages.length === state.boardSize * state.boardSize) {
        continueButton.classList.add('visible');
    } else {
        continueButton.classList.remove('visible');
    }
}

// Board Generation and Display
function generateBoards() {
    const container = document.getElementById('bingoBoards');
    container.innerHTML = '';

    for (let i = 0; i < state.boardCount; i++) {
        const board = document.createElement('div');
        board.classList.add('bingo-board','page');

        const companyRemark = document.createElement('span');
        companyRemark.classList.add('board-remark');
        companyRemark.innerText = "Visit us again at https://www.bingomaker.xyz";

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${state.boardSize}, 1fr)`;
        grid.style.gap = '8px';

        let boardContent;
        if (state.boardType === 'numbers') {
            boardContent = generateBoardContent(state.boardSize);
        } else {
            boardContent = generateImageBoard(state.boardSize, state.selectedImages);
        }

        boardContent.forEach((content) => {
            const cell = document.createElement('div');
            cell.className = 'bingo-cell';
            cell.style.border = '1px solid #ccc';
            cell.style.textAlign = 'center';

            if (state.boardType === 'numbers') {
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                const baseFontSize = 2.5;
                const scaleFactor = 5 / state.boardSize;
                cell.style.fontSize = `${baseFontSize * scaleFactor}rem`;
                cell.style.fontWeight = 'bold';
                cell.textContent = content;
            } else {
                const img = document.createElement('img');
                img.src = content;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                cell.appendChild(img);
            }

            grid.appendChild(cell);
        });

        board.appendChild(grid);
        board.appendChild(companyRemark);

        container.appendChild(board);
    }

    showStep(6);
}

function restartApp() {
    state = {
        boardType: null,
        boardSize: null,
        selectedImages: [],
        boardCount: null
    };

    document.getElementById('imageSearch').value = '';
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('selectedImages').innerHTML = '<div class="selected-images-count">0</div>';
    document.getElementById('bingoBoards').innerHTML = '';

    showStep(1);
}

// Mobile file upload handling
document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', handleFileUpload);
    }
});

function handleFileUpload(event) {
    const files = Array.from(event.target.files).filter(file =>
        file.type.startsWith('image/')
    );

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (state.selectedImages.length < state.boardSize * state.boardSize) {
                selectImage(e.target.result);
            }
        };
        reader.readAsDataURL(file);
    });

    // Reset file input
    event.target.value = '';
}

// Prevent bounce-scroll on iOS
document.addEventListener('touchmove', function (event) {
    if (event.target.closest('.search-results, .selected-images')) {
        event.stopPropagation();
    }
}, { passive: true });

// Better touch handling for image selection
document.addEventListener('touchstart', function () { }, { passive: true });