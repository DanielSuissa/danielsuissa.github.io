// UI Utilities
const UI = {
    showElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) element.style.display = 'block';
    },

    hideElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) element.style.display = 'none';
    },

    setElementText: (elementId, text) => {
        const element = document.getElementById(elementId);
        if (element) element.textContent = text;
    },

    showError: (message) => {
        alert(message); // Could be replaced with a better UI component
    }
};

// Date and Time Utilities
const DateTime = {
    formatDateTime: (date) => {
        return new Date(date).toLocaleString();
    },

    getRemainingTime: (targetDate) => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const diff = target - now;

        if (diff <= 0) return null;

        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return {
            minutes,
            seconds,
            total: diff
        };
    },

    formatRemainingTime: (timeObj) => {
        if (!timeObj) return '--:--';
        return `${timeObj.minutes}:${timeObj.seconds.toString().padStart(2, '0')}`;
    }
};

// Game Board Utilities
const Board = {
    generateUniqueNumbers: (size) => {
        const maxNum = Math.floor(Math.pow(size, 2) * 1.5);
        const numbers = new Set();
        
        while (numbers.size < size * size) {
            numbers.add(Math.floor(Math.random() * maxNum) + 1);
        }
        
        return Array.from(numbers);
    },

    createBoardMatrix: (numbers, size) => {
        const matrix = [];
        let index = 0;
        
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(numbers[index++]);
            }
            matrix.push(row);
        }
        
        return matrix;
    }
};

// Local Storage Utilities
const Storage = {
    saveGameState: (gameId, state) => {
        localStorage.setItem(`game_${gameId}`, JSON.stringify(state));
    },

    loadGameState: (gameId) => {
        const saved = localStorage.getItem(`game_${gameId}`);
        return saved ? JSON.parse(saved) : null;
    },

    clearGameState: (gameId) => {
        localStorage.removeItem(`game_${gameId}`);
    }
};

// API Utilities
const API = {
    async createGame(gameData) {
        try {
            const response = await fetch('/api/create-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameData)
            });

            if (!response.ok) {
                throw new Error('Failed to create game');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`API Error: ${error.message}`);
        }
    },

    async joinGame(gameId, playerName) {
        try {
            const response = await fetch(`/api/game/${gameId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playerName })
            });

            if (!response.ok) {
                throw new Error('Failed to join game');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`API Error: ${error.message}`);
        }
    }
};

// Copy to Clipboard Utility
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        return false;
    }
};

// Event Stream Connection Manager
class EventStreamManager {
    constructor(gameId) {
        this.gameId = gameId;
        this.eventSource = null;
        this.handlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect() {
        if (this.eventSource) {
            this.eventSource.close();
        }

        this.eventSource = new EventSource(`/api/game/${this.gameId}/events`);
        
        this.eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const handler = this.handlers.get(data.type);
            if (handler) handler(data);
        };

        this.eventSource.onerror = () => {
            this.handleError();
        };
    }

    on(eventType, handler) {
        this.handlers.set(eventType, handler);
    }

    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    handleError() {
        this.disconnect();
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.connect(), 1000 * Math.pow(2, this.reconnectAttempts));
        } else {
            UI.showError('Connection lost. Please refresh the page.');
        }
    }
}