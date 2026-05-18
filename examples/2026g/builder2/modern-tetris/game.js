/**
 * Modern Tetris Core Logic
 */

// --- Constants ---
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = {
    I: '#00f2ff', // Cyan
    J: '#0044ff', // Blue
    L: '#ff9100', // Orange
    O: '#feff00', // Yellow
    S: '#00ff44', // Green
    T: '#bc13fe', // Purple
    Z: '#ff0044'  // Red
};

const PIECES = {
    I: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
    J: [[1,0,0], [1,1,1], [0,0,0]],
    L: [[0,0,1], [1,1,1], [0,0,0]],
    O: [[1,1], [1,1]],
    S: [[0,1,1], [1,1,0], [0,0,0]],
    T: [[0,1,0], [1,1,1], [0,0,0]],
    Z: [[1,1,0], [0,1,1], [0,0,0]]
};

// --- DOM Elements ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');
const holdCanvas = document.getElementById('hold-canvas');
const holdCtx = holdCanvas.getContext('2d');

const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const scoreMsgElement = document.getElementById('score-msg');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');

// --- Game State ---
let board = createBoard();
let score = 0;
let lines = 0;
let level = 1;
let gameOver = false;
let isPaused = true;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let scoreMsgTimeout = null;

let player = {
    pos: {x: 0, y: 0},
    matrix: null,
    type: null
};

let nextPiece = null;
let holdPiece = null;
let canHold = true;

// --- Initialization ---
function createBoard() {
    return Array.from({length: ROWS}, () => Array(COLS).fill(0));
}

function init() {
    board = createBoard();
    score = 0;
    lines = 0;
    level = 1;
    gameOver = false;
    dropInterval = 1000;
    holdPiece = null;
    canHold = true;
    
    updateScore();
    resetPlayer();
    
    // UI Update
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.display = 'none', 300);
}

// --- Player Logic ---
function resetPlayer() {
    if (!nextPiece) {
        nextPiece = getRandomPiece();
    }
    
    player.type = nextPiece;
    player.matrix = PIECES[player.type];
    player.pos.y = 0;
    player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
    
    nextPiece = getRandomPiece();
    canHold = true;
    
    if (collide(board, player)) {
        handleGameOver();
    }
}

function getRandomPiece() {
    const keys = Object.keys(PIECES);
    return keys[Math.floor(Math.random() * keys.length)];
}

function rotate(matrix, dir) {
    // Transpose
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    // Reverse rows (CW) or columns (CCW)
    if (dir > 0) matrix.forEach(row => row.reverse());
    else matrix.reverse();
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

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(board, player)) {
        player.pos.x -= dir;
    }
}

function playerDrop() {
    player.pos.y++;
    if (collide(board, player)) {
        player.pos.y--;
        merge(board, player);
        sweep();
        resetPlayer();
    }
    dropCounter = 0;
}

function playerHardDrop() {
    while (!collide(board, player)) {
        player.pos.y++;
    }
    player.pos.y--;
    merge(board, player);
    sweep();
    resetPlayer();
    dropCounter = 0;
}

function playerHold() {
    if (!canHold) return;
    
    if (!holdPiece) {
        holdPiece = player.type;
        resetPlayer();
    } else {
        const temp = player.type;
        player.type = holdPiece;
        player.matrix = PIECES[player.type];
        player.pos.y = 0;
        player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
        holdPiece = temp;
    }
    
    canHold = false;
}

// --- Collision & Board Logic ---
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

function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + player.pos.y][x + player.pos.x] = player.type;
            }
        });
    });
}

// --- Audio ---
let audioCtx = null;

function playScoreSound(rowCount) {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'square';
    // Frequency increases with lines cleared
    oscillator.frequency.setValueAtTime(200 + (rowCount * 100), audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800 + (rowCount * 200), audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
}

function sweep() {
    let rowCount = 0;
    outer: for (let y = board.length - 1; y > 0; --y) {
        for (let x = 0; x < board[y].length; ++x) {
            if (board[y][x] === 0) continue outer;
        }
        
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y;
        rowCount++;
    }
    
    if (rowCount > 0) {
        const lineScores = [0, 100, 300, 500, 800];
        const gain = lineScores[rowCount] * level;
        score += gain;
        lines += rowCount;
        
        playScoreSound(rowCount);
        showScoreMessage(rowCount, gain);

        if (lines >= level * 10) {
            level++;
            dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        }
        updateScore();
    }
}

function showScoreMessage(rowCount, gain) {
    const labels = ["", "SINGLE", "DOUBLE", "TRIPLE", "TETRIS!"];
    const basePoints = [0, 100, 300, 500, 800][rowCount];
    
    clearTimeout(scoreMsgTimeout);
    scoreMsgElement.innerHTML = `
        <div class="points">+${gain}</div>
        <div class="explanation">${labels[rowCount]}</div>
        <div class="explanation">(${basePoints} x LVL ${level})</div>
    `;
    scoreMsgElement.classList.remove('show');
    void scoreMsgElement.offsetWidth; // trigger reflow
    scoreMsgElement.classList.add('show');
    
    scoreMsgTimeout = setTimeout(() => {
        scoreMsgElement.classList.remove('show');
    }, 2000);
}

// --- Rendering ---
function drawBlock(ctx, x, y, type, isGhost = false) {
    const color = COLORS[type];
    ctx.fillStyle = color;
    
    if (isGhost) {
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
        ctx.globalAlpha = 1.0;
        return;
    }

    // Modern Block: Gradient + Glow
    const grad = ctx.createLinearGradient(x * BLOCK_SIZE, y * BLOCK_SIZE, (x+1) * BLOCK_SIZE, (y+1) * BLOCK_SIZE);
    grad.addColorStop(0, color);
    grad.addColorStop(1, adjustColor(color, -40));
    ctx.fillStyle = grad;
    
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    ctx.shadowBlur = 0;
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x * BLOCK_SIZE + 4, y * BLOCK_SIZE + 4, BLOCK_SIZE / 4, BLOCK_SIZE / 4);
}

function adjustColor(hex, amt) {
    let usePound = false;
    if (hex[0] == "#") { hex = hex.slice(1); usePound = true; }
    let num = parseInt(hex, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

function draw() {
    // Clear Main Board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Board
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) drawBlock(ctx, x, y, value);
        });
    });
    
    // Draw Ghost
    const ghost = {
        pos: {x: player.pos.x, y: player.pos.y},
        matrix: player.matrix,
        type: player.type
    };
    while (!collide(board, ghost)) {
        ghost.pos.y++;
    }
    ghost.pos.y--;
    ghost.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) drawBlock(ctx, x + ghost.pos.x, y + ghost.pos.y, ghost.type, true);
        });
    });

    // Draw Player
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) drawBlock(ctx, x + player.pos.x, y + player.pos.y, player.type);
        });
    });

    // Side Canvases
    drawPreview(nextCtx, nextCanvas, nextPiece);
    drawPreview(holdCtx, holdCanvas, holdPiece);
}

function drawPreview(ctx, canvas, type) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!type) return;
    
    const matrix = PIECES[type];
    const size = BLOCK_SIZE * 0.8;
    const offset = (canvas.width - matrix[0].length * size) / 2;
    
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const color = COLORS[type];
                ctx.fillStyle = color;
                ctx.shadowBlur = 5;
                ctx.shadowColor = color;
                ctx.fillRect(offset + x * size, offset + y * size, size - 2, size - 2);
                ctx.shadowBlur = 0;
            }
        });
    });
}

// --- UI & Controls ---
function updateScore() {
    scoreElement.innerText = score.toString().padStart(6, '0');
    levelElement.innerText = level;
    linesElement.innerText = lines;
}

function handleGameOver() {
    gameOver = true;
    isPaused = true;
    overlayTitle.innerText = "GAME OVER";
    startBtn.innerText = "RETRY";
    overlay.style.display = 'flex';
    setTimeout(() => overlay.style.opacity = '1', 10);
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

document.addEventListener('keydown', event => {
    if (isPaused) return;
    
    switch(event.code) {
        case 'ArrowLeft': playerMove(-1); break;
        case 'ArrowRight': playerMove(1); break;
        case 'ArrowDown': playerDrop(); break;
        case 'ArrowUp': playerRotate(1); break;
        case 'Space': playerHardDrop(); break;
        case 'KeyC': playerHold(); break;
    }
    draw();
});

startBtn.addEventListener('click', () => {
    isPaused = false;
    init();
    lastTime = performance.now();
    update();
});

// Initial Draw
draw();
