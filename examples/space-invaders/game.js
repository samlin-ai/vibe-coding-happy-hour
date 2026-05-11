const gameContainer = document.getElementById('game-container');
const ship = document.getElementById('ship');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Game State
let score = 0;
let isGameOver = false;
let shipX = window.innerWidth / 2;
let bullets = [];
let alienBullets = [];
let aliens = [];
let alienDirection = 1; // 1 for right, -1 for left
let alienMoveStep = 10;
let alienDropStep = 30;
let lastAlienMove = 0;
let alienMoveInterval = 1000; // ms
let lastAlienShoot = 0;
let alienShootInterval = 2000; // ms
let keys = {};

// Constants
const SHIP_SPEED = 7;
const BULLET_SPEED = 10;
const ALIEN_ROWS = 4;
const ALIEN_COLS = 8;
const ALIEN_EMOJIS = ['👾', '🛸', '👽', '🤖'];

function initAliens() {
    aliens = [];
    const containerWidth = window.innerWidth;
    const startX = (containerWidth - (ALIEN_COLS * 60)) / 2;
    const startY = 80;

    for (let row = 0; row < ALIEN_ROWS; row++) {
        for (let col = 0; col < ALIEN_COLS; col++) {
            const alienElement = document.createElement('div');
            alienElement.className = 'alien';
            alienElement.innerText = ALIEN_EMOJIS[row % ALIEN_EMOJIS.length];
            
            const x = startX + col * 60;
            const y = startY + row * 50;
            
            alienElement.style.left = `${x}px`;
            alienElement.style.top = `${y}px`;
            
            gameContainer.appendChild(alienElement);
            aliens.push({
                element: alienElement,
                x: x,
                y: y,
                row,
                col
            });
        }
    }
}

// Input Handling
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function handleInput() {
    if (isGameOver) return;

    if (keys['ArrowLeft'] || keys['KeyA']) {
        shipX -= SHIP_SPEED;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        shipX += SHIP_SPEED;
    }

    // Constrain ship
    const shipWidth = 50;
    if (shipX < shipWidth / 2) shipX = shipWidth / 2;
    if (shipX > window.innerWidth - shipWidth / 2) shipX = window.innerWidth - shipWidth / 2;

    ship.style.left = `${shipX}px`;

    if (keys['Space']) {
        fireBullet();
        keys['Space'] = false; // Prevent rapid fire
    }
}

function fireBullet() {
    const bulletElement = document.createElement('div');
    bulletElement.className = 'bullet';
    const x = shipX;
    const y = window.innerHeight - 80;
    
    bulletElement.style.left = `${x}px`;
    bulletElement.style.top = `${y}px`;
    
    gameContainer.appendChild(bulletElement);
    bullets.push({ element: bulletElement, x, y });
}

function spawnAlienBullet(alien) {
    const bulletElement = document.createElement('div');
    bulletElement.className = 'bullet alien-bullet';
    const x = alien.x + 15;
    const y = alien.y + 30;
    
    bulletElement.style.left = `${x}px`;
    bulletElement.style.top = `${y}px`;
    
    gameContainer.appendChild(bulletElement);
    alienBullets.push({ element: bulletElement, x, y });
}

function moveAliens(timestamp) {
    if (timestamp - lastAlienMove < alienMoveInterval) return;
    lastAlienMove = timestamp;

    let reachEdge = false;
    const padding = 50;

    aliens.forEach(alien => {
        alien.x += alienMoveStep * alienDirection;
        if (alien.x > window.innerWidth - padding || alien.x < padding) {
            reachEdge = true;
        }
    });

    if (reachEdge) {
        alienDirection *= -1;
        aliens.forEach(alien => {
            alien.y += alienDropStep;
            if (alien.y > window.innerHeight - 100) {
                endGame();
            }
        });
        // Speed up
        alienMoveInterval = Math.max(200, alienMoveInterval - 50);
    }

    aliens.forEach(alien => {
        alien.element.style.left = `${alien.x}px`;
        alien.element.style.top = `${alien.y}px`;
    });
}

function alienShooting(timestamp) {
    if (timestamp - lastAlienShoot < alienShootInterval) return;
    lastAlienShoot = timestamp;

    if (aliens.length > 0) {
        const randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
        spawnAlienBullet(randomAlien);
    }
}

function updateBullets() {
    // Player bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y -= BULLET_SPEED;
        b.element.style.top = `${b.y}px`;

        if (b.y < 0) {
            gameContainer.removeChild(b.element);
            bullets.splice(i, 1);
            continue;
        }

        // Check collision with aliens
        for (let j = aliens.length - 1; j >= 0; j--) {
            const a = aliens[j];
            if (
                b.x > a.x && b.x < a.x + 40 &&
                b.y > a.y && b.y < a.y + 40
            ) {
                // Hit!
                score += 10;
                scoreElement.innerText = score;
                gameContainer.removeChild(a.element);
                aliens.splice(j, 1);
                gameContainer.removeChild(b.element);
                bullets.splice(i, 1);
                
                if (aliens.length === 0) {
                    // Level clear - restart with more speed
                    initAliens();
                    alienMoveInterval = Math.max(200, alienMoveInterval - 100);
                }
                break;
            }
        }
    }

    // Alien bullets
    for (let i = alienBullets.length - 1; i >= 0; i--) {
        const b = alienBullets[i];
        b.y += BULLET_SPEED * 0.6;
        b.element.style.top = `${b.y}px`;

        if (b.y > window.innerHeight) {
            gameContainer.removeChild(b.element);
            alienBullets.splice(i, 1);
            continue;
        }

        // Check collision with ship
        const shipRect = ship.getBoundingClientRect();
        if (
            b.x > shipRect.left && b.x < shipRect.right &&
            b.y > shipRect.top && b.y < shipRect.bottom
        ) {
            endGame();
        }
    }
}

function gameLoop(timestamp) {
    if (isGameOver) return;

    handleInput();
    moveAliens(timestamp);
    alienShooting(timestamp);
    updateBullets();

    requestAnimationFrame(gameLoop);
}

function createExplosion(x, y, emoji) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.innerText = '💥';
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    explosion.style.position = 'absolute';
    explosion.style.fontSize = '30px';
    explosion.style.zIndex = '50';
    
    gameContainer.appendChild(explosion);
    
    setTimeout(() => {
        if (gameContainer.contains(explosion)) {
            gameContainer.removeChild(explosion);
        }
    }, 500);
}

function endGame() {
    isGameOver = true;
    finalScoreElement.innerText = score;
    gameOverScreen.classList.remove('hidden');
}

function restartGame() {
    // Reset state
    score = 0;
    scoreElement.innerText = score;
    isGameOver = false;
    alienMoveInterval = 1000;
    alienDirection = 1;
    
    // Clear elements
    aliens.forEach(a => gameContainer.removeChild(a.element));
    bullets.forEach(b => gameContainer.removeChild(b.element));
    alienBullets.forEach(b => gameContainer.removeChild(b.element));
    
    aliens = [];
    bullets = [];
    alienBullets = [];
    
    gameOverScreen.classList.add('hidden');
    
    initAliens();
    requestAnimationFrame(gameLoop);
}

restartBtn.addEventListener('click', restartGame);

// Start
initAliens();
requestAnimationFrame(gameLoop);
