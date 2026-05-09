// Game constants and configuration
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = [
    null,
    '#FF0D72', // T
    '#0DC2FF', // I
    '#0DFF72', // S
    '#F538FF', // Z
    '#FF8E0D', // L
    '#FFE138', // J
    '#3877FF', // O
];

const PIECES = [
    null,
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]], // T
    [[0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0]], // I
    [[0, 3, 3], [3, 3, 0], [0, 0, 0]], // S
    [[4, 4, 0], [0, 4, 4], [0, 0, 0]], // Z
    [[5, 0, 0], [5, 5, 5], [0, 0, 0]], // L
    [[0, 0, 6], [6, 6, 6], [0, 0, 0]], // J
    [[7, 7], [7, 7]], // O
];

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-piece');
const nextContext = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');
const message = document.getElementById('message');

context.scale(BLOCK_SIZE, BLOCK_SIZE);
nextContext.scale(BLOCK_SIZE, BLOCK_SIZE);

// Game state
let board = createMatrix(COLS, ROWS);
let player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};
let nextPiece = null;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let isPaused = true;

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function draw() {
    // Fill background
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(board, {x: 0, y: 0}, context);
    drawMatrix(player.matrix, player.pos, context);
}

function drawMatrix(matrix, offset, ctx) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = COLORS[value];
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                
                // Add a small border to each block for better visual definition
                ctx.lineWidth = 0.05;
                ctx.strokeStyle = '#000';
                ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function drawNext() {
    nextContext.fillStyle = '#000';
    nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    // Center the next piece in the small canvas
    const offset = {
        x: (nextCanvas.width / BLOCK_SIZE - nextPiece.length) / 2,
        y: (nextCanvas.height / BLOCK_SIZE - nextPiece.length) / 2
    };
    drawMatrix(nextPiece, offset, nextContext);
}

function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerDrop() {
    player.pos.y++;
    if (collide(board, player)) {
        player.pos.y--;
        merge(board, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(board, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(board, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function playerReset() {
    if (!nextPiece) {
        player.matrix = createPiece(PIECES.length * Math.random() | 0);
    } else {
        player.matrix = nextPiece;
    }
    nextPiece = createPiece(PIECES.length * Math.random() | 0);
    
    player.pos.y = 0;
    player.pos.x = (board[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    
    if (collide(board, player)) {
        board.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
        gameOver();
    }
    
    drawNext();
}

function createPiece(type) {
    // Ensure we don't return null if type is 0
    type = type === 0 ? 1 : type;
    // Deep copy the piece matrix
    return PIECES[type].map(row => [...row]);
}

function collide(board, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = board.length - 1; y > 0; --y) {
        for (let x = 0; x < board[y].length; ++x) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function updateScore() {
    scoreElement.innerText = player.score;
}

function update(time = 0) {
    if (isPaused) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function gameOver() {
    isPaused = true;
    message.innerText = 'GAME OVER';
    message.style.display = 'block';
    startBtn.innerText = 'Play Again';
    overlay.style.display = 'flex';
}

function startGame() {
    isPaused = false;
    overlay.style.display = 'none';
    board.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
    playerReset();
    lastTime = performance.now();
    update();
}

document.addEventListener('keydown', event => {
    if (isPaused) return;

    if (event.keyCode === 37) { // Left
        playerMove(-1);
    } else if (event.keyCode === 39) { // Right
        playerMove(1);
    } else if (event.keyCode === 40) { // Down
        playerDrop();
    } else if (event.keyCode === 38) { // Up
        playerRotate(1);
    } else if (event.keyCode === 81) { // Q (rotate CCW)
        playerRotate(-1);
    } else if (event.keyCode === 87) { // W (rotate CW)
        playerRotate(1);
    }
});

startBtn.addEventListener('click', () => {
    startGame();
});

// Initial draw to show blank board
draw();
