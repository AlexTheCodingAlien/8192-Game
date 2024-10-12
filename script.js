let board = [];
let score = 0;
let highScore = 0;
let gameOver = false;
const maxTile = 8192;  // Set the max number to 8192

// Initialize the game
function init() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    gameOver = false;
    addRandomTile();
    addRandomTile();
    updateBoard();
    document.getElementById('lose-screen').style.display = 'none';
}

// Add a random tile (2 or 4) to the board
function addRandomTile() {
    let emptyTiles = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) {
                emptyTiles.push({ row: r, col: c });
            }
        }
    }

    if (emptyTiles.length > 0) {
        let { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Update the visual board
function updateBoard() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.setAttribute('data-value', board[r][c]);
            cell.innerText = board[r][c] === 0 ? '' : board[r][c];
            if (board[r][c] !== 0) {
                cell.style.animation = 'slide 0.2s ease';
            }
            gridContainer.appendChild(cell);
        }
    }
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('high-score').innerText = `High Score: ${highScore}`;
    checkGameOver();
}

// Move and merge tiles
function move(direction) {
    if (gameOver) return;
    let moved = false;

    // Create a copy of the board to check for changes
    const previousBoard = JSON.parse(JSON.stringify(board));

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] !== 0) {
                let newRow = r;
                let newCol = c;

                // Determine new position based on direction
                while (true) {
                    let nextRow = newRow;
                    let nextCol = newCol;

                    if (direction === 'up') nextRow--;
                    else if (direction === 'down') nextRow++;
                    else if (direction === 'left') nextCol--;
                    else if (direction === 'right') nextCol++;

                    if (nextRow < 0 || nextRow > 3 || nextCol < 0 || nextCol > 3) break;
                    if (board[nextRow][nextCol] === 0) {
                        board[nextRow][nextCol] = board[newRow][newCol];
                        board[newRow][newCol] = 0;
                        moved = true;
                    } else if (board[nextRow][nextCol] === board[newRow][newCol]) {
                        board[nextRow][nextCol] *= 2;
                        board[newRow][newCol] = 0;
                        score += board[nextRow][nextCol];
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                    newRow = nextRow;
                    newCol = nextCol;
                }
            }
        }
    }

    if (moved) {
        addRandomTile();
        updateBoard();
        checkGameOver(previousBoard);
    }
}

// Check if the game is over
function checkGameOver(previousBoard) {
    if (board.flat().includes(maxTile)) {  // Check if 8192 is reached
        alert("You win!");
        gameOver = true;
    } else if (board.flat().every(cell => cell !== 0) && !canMove()) {
        document.getElementById('final-score').innerText = score;
        document.getElementById('lose-screen').style.display = 'block';
        gameOver = true;

        // Update high score in local storage
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
    }
}

// Check if any moves are possible
function canMove() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) return true;
            if (r < 3 && board[r][c] === board[r + 1][c]) return true;
            if (c < 3 && board[r][c] === board[r][c + 1]) return true;
        }
    }
    return false;
}

// Handle key press for movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') move('up');
    else if (event.key === 'ArrowDown') move('down');
    else if (event.key === 'ArrowLeft') move('left');
    else if (event.key === 'ArrowRight') move('right');
});

// Restart the game
document.getElementById('restart-button').addEventListener('click', init);

// Restart from loss screen
document.getElementById('restart-from-lose').addEventListener('click', init);

// Load high score from local storage
function loadHighScore() {
    const storedHighScore = localStorage.getItem('highScore');
    highScore = storedHighScore ? parseInt(storedHighScore) : 0;
    document.getElementById('high-score').innerText = `High Score: ${highScore}`;
}

// Initialize the game on load
window.onload = () => {
    loadHighScore();
    init();
};
