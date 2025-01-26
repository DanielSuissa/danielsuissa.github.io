// Enum for pattern types
const PRESET_PATTERNS = {
    ALL_ROWS: 'all_rows',
    ALL_COLUMNS: 'all_columns',
    DIAGONALS: 'diagonals',
    FOUR_CORNERS: 'four_corners',
    FULL_BOARD: 'full_board',
    CENTER_SQUARE: 'center_square',
    X_PATTERN: 'x_pattern',
    PLUS_PATTERN: 'plus_pattern'
};

// Pattern descriptions for UI
const PATTERN_DESCRIPTIONS = {
    [PRESET_PATTERNS.ALL_ROWS]: 'Complete any row to win',
    [PRESET_PATTERNS.ALL_COLUMNS]: 'Complete any column to win',
    [PRESET_PATTERNS.DIAGONALS]: 'Complete any diagonal to win',
    [PRESET_PATTERNS.FOUR_CORNERS]: 'Complete all four corners',
    [PRESET_PATTERNS.FULL_BOARD]: 'Complete the entire board',
    [PRESET_PATTERNS.CENTER_SQUARE]: 'Complete the center square (2x2)',
    [PRESET_PATTERNS.X_PATTERN]: 'Complete an X pattern',
    [PRESET_PATTERNS.PLUS_PATTERN]: 'Complete a plus (+) pattern'
};

// Pattern preview data for visualization
const PATTERN_PREVIEWS = {
    [PRESET_PATTERNS.ALL_ROWS]: [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [PRESET_PATTERNS.ALL_COLUMNS]: [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0]
    ],
    [PRESET_PATTERNS.DIAGONALS]: [
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [1, 0, 0, 1]
    ],
    [PRESET_PATTERNS.FOUR_CORNERS]: [
        [1, 0, 0, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 0, 0, 1]
    ],
    [PRESET_PATTERNS.FULL_BOARD]: [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1]
    ],
    [PRESET_PATTERNS.CENTER_SQUARE]: [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [PRESET_PATTERNS.X_PATTERN]: [
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [1, 0, 0, 1]
    ],
    [PRESET_PATTERNS.PLUS_PATTERN]: [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [1, 1, 1, 1],
        [0, 0, 1, 0]
    ]
};

// Generate pattern matrix for given type and size
function generatePatternMatrix(patternType, boardSize) {
    const matrix = Array(boardSize).fill().map(() => Array(boardSize).fill(false));
    
    switch (patternType) {
        case PRESET_PATTERNS.ALL_ROWS:
            return { type: 'any_row', pattern: matrix };
            
        case PRESET_PATTERNS.ALL_COLUMNS:
            return { type: 'any_column', pattern: matrix };
            
        case PRESET_PATTERNS.DIAGONALS:
            return { type: 'any_diagonal', pattern: matrix };
            
        case PRESET_PATTERNS.FOUR_CORNERS:
            matrix[0][0] = true;
            matrix[0][boardSize-1] = true;
            matrix[boardSize-1][0] = true;
            matrix[boardSize-1][boardSize-1] = true;
            return { type: 'exact', pattern: matrix };
            
        case PRESET_PATTERNS.FULL_BOARD:
            return {
                type: 'exact',
                pattern: matrix.map(row => row.fill(true))
            };
            
        case PRESET_PATTERNS.CENTER_SQUARE:
            if (boardSize < 3) return null;
            const center = Math.floor(boardSize/2);
            matrix[center-1][center-1] = true;
            matrix[center-1][center] = true;
            matrix[center][center-1] = true;
            matrix[center][center] = true;
            return { type: 'exact', pattern: matrix };
            
        case PRESET_PATTERNS.X_PATTERN:
            for (let i = 0; i < boardSize; i++) {
                matrix[i][i] = true;
                matrix[i][boardSize-1-i] = true;
            }
            return { type: 'exact', pattern: matrix };
            
        case PRESET_PATTERNS.PLUS_PATTERN:
            const mid = Math.floor(boardSize/2);
            for (let i = 0; i < boardSize; i++) {
                matrix[mid][i] = true;
                matrix[i][mid] = true;
            }
            return { type: 'exact', pattern: matrix };
            
        default:
            return null;
    }
}
