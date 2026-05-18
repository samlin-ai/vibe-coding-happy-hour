const gameContainer = document.getElementById('game-container');
const turtle = document.getElementById('turtle');
const axolotl = document.getElementById('axolotl');
const roundNumDisplay = document.getElementById('round-num');
const menuOverlay = document.getElementById('menu-overlay');
const winOverlay = document.getElementById('win-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');

// Game State
let gameMode = 1; // 1 or 2
let currentRound = 1;
let isGameActive = false;
let crabs = [];
let obstacles = [];
let keysPressed = {};

// Player Data
const players = {
    turtle: {
        el: turtle,
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        speed: 5,
        isFinished: false,
        isActive: true,
        reset() {
            this.x = window.innerWidth / 2 - this.width / 2;
            this.y = window.innerHeight - 80;
            this.isFinished = false;
            this.updatePos();
        },
        updatePos() {
            this.el.style.left = `${this.x}px`;
            this.el.style.top = `${this.y}px`;
        }
    },
    axolotl: {
        el: axolotl,
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        speed: 5,
        isFinished: false,
        isActive: false,
        reset() {
            if (!this.isActive) return;
            this.x = window.innerWidth / 2 + 10;
            this.y = window.innerHeight - 80;
            this.isFinished = false;
            this.updatePos();
        },
        updatePos() {
            this.el.style.left = `${this.x}px`;
            this.el.style.top = `${this.y}px`;
        }
    }
};

// Crab & Obstacle Data
function spawnLevelElements() {
    // Clear old elements
    crabs.forEach(c => gameContainer.removeChild(c.el));
    obstacles.forEach(o => gameContainer.removeChild(o.el));
    crabs = [];
    obstacles = [];

    // Spawn Crabs
    const crabCount = 3 + currentRound * 2; 
    const speedBase = 2 + currentRound * 0.5;

    for (let i = 0; i < crabCount; i++) {
        const el = document.createElement('div');
        el.className = 'crab';
        el.innerHTML = `
            <div class="chibi-crab">
                <div class="body"></div>
                <div class="eye left"></div>
                <div class="eye right"></div>
                <div class="claw left"></div>
                <div class="claw right"></div>
                <div class="leg l1"></div>
                <div class="leg l2"></div>
                <div class="leg r1"></div>
                <div class="leg r2"></div>
            </div>
        `;
        gameContainer.appendChild(el);

        const minY = 100;
        const maxY = window.innerHeight - 150;
        const y = minY + Math.random() * (maxY - minY);
        
        const direction = Math.random() > 0.5 ? 1 : -1;
        const x = Math.random() * window.innerWidth;
        const speed = speedBase + Math.random() * 3;
        const wobbleSpeed = 0.02 + Math.random() * 0.05;
        const wobbleAmount = 10 + Math.random() * 20;
        const offset = Math.random() * Math.PI * 2;

        crabs.push({ el, x, y, speed, direction, wobbleSpeed, wobbleAmount, offset, baseY: y });
    }

    // Spawn Obstacles (Starting Level 5)
    if (currentRound >= 5) {
        const obstacleCount = currentRound - 3; // 2 at lvl 5, 3 at lvl 6, etc.
        for (let i = 0; i < obstacleCount; i++) {
            const el = document.createElement('div');
            el.className = 'obstacle';
            const type = Math.random() > 0.5 ? 'coral' : 'rock';
            el.innerHTML = `<div class="${type}"></div>`;
            gameContainer.appendChild(el);

            const x = 50 + Math.random() * (window.innerWidth - 100);
            const y = 150 + Math.random() * (window.innerHeight - 300);
            
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;

            obstacles.push({ el, x, y, width: 40, height: 40 });
        }
    }
}

// Input Handling
window.addEventListener('keydown', (e) => keysPressed[e.code] = true);
window.addEventListener('keyup', (e) => keysPressed[e.code] = false);

function handleInput() {
    if (!isGameActive) return;

    // Turtle (WASD)
    if (players.turtle.isActive && !players.turtle.isFinished) {
        if (keysPressed['KeyW']) players.turtle.y -= players.turtle.speed;
        if (keysPressed['KeyS']) players.turtle.y += players.turtle.speed;
        if (keysPressed['KeyA']) players.turtle.x -= players.turtle.speed;
        if (keysPressed['KeyD']) players.turtle.x += players.turtle.speed;
        
        // Boundaries
        players.turtle.x = Math.max(0, Math.min(window.innerWidth - players.turtle.width, players.turtle.x));
        players.turtle.y = Math.max(0, Math.min(window.innerHeight - players.turtle.height, players.turtle.y));
        
        // Finish Check
        if (players.turtle.y < 80) {
            players.turtle.isFinished = true;
        }
        players.turtle.updatePos();
    }

    // Axolotl (Arrows)
    if (players.axolotl.isActive && !players.axolotl.isFinished) {
        if (keysPressed['ArrowUp']) players.axolotl.y -= players.axolotl.speed;
        if (keysPressed['ArrowDown']) players.axolotl.y += players.axolotl.speed;
        if (keysPressed['ArrowLeft']) players.axolotl.x -= players.axolotl.speed;
        if (keysPressed['ArrowRight']) players.axolotl.x += players.axolotl.speed;

        // Boundaries
        players.axolotl.x = Math.max(0, Math.min(window.innerWidth - players.axolotl.width, players.axolotl.x));
        players.axolotl.y = Math.max(0, Math.min(window.innerHeight - players.axolotl.height, players.axolotl.y));

        // Finish Check
        if (players.axolotl.y < 80) {
            players.axolotl.isFinished = true;
        }
        players.axolotl.updatePos();
    }
}

function updateCrabs() {
    crabs.forEach(crab => {
        crab.x += crab.speed * crab.direction;
        
        // Vertical Wobble
        crab.offset += crab.wobbleSpeed;
        crab.y = crab.baseY + Math.sin(crab.offset) * crab.wobbleAmount;
        
        // Wrap around
        if (crab.direction === 1 && crab.x > window.innerWidth + 50) {
            crab.x = -50;
            // Slightly randomize speed and Y on wrap for more chaos
            crab.speed = (2 + currentRound * 0.5) + Math.random() * 3;
        } else if (crab.direction === -1 && crab.x < -50) {
            crab.x = window.innerWidth + 50;
            crab.speed = (2 + currentRound * 0.5) + Math.random() * 3;
        }
        
        crab.el.style.left = `${crab.x}px`;
        crab.el.style.top = `${crab.y}px`;

        // Collision Detection
        checkCollision(crab);
    });
}

function checkCollision(crab) {
    const crabRect = {
        left: crab.x + 5,
        right: crab.x + 35,
        top: crab.y + 5,
        bottom: crab.y + 35
    };

    [players.turtle, players.axolotl].forEach(p => {
        if (p.isActive && !p.isFinished) {
            const pRect = {
                left: p.x + 5,
                right: p.x + 45,
                top: p.y + 5,
                bottom: p.y + 45
            };

            // Check Crab Collision
            if (pRect.left < crabRect.right &&
                pRect.right > crabRect.left &&
                pRect.top < crabRect.bottom &&
                pRect.bottom > crabRect.top) {
                playPopSound();
                p.reset();
            }

            // Check Obstacle Collision
            obstacles.forEach(o => {
                const oRect = {
                    left: o.x + 5,
                    right: o.x + 35,
                    top: o.y + 5,
                    bottom: o.y + 35
                };
                if (pRect.left < oRect.right &&
                    pRect.right > oRect.left &&
                    pRect.top < oRect.bottom &&
                    pRect.bottom > oRect.top) {
                    playPopSound();
                    p.reset();
                }
            });
        }
    });
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPopSound() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function checkRoundEnd() {
    const allFinished = (!players.turtle.isActive || players.turtle.isFinished) &&
                        (!players.axolotl.isActive || players.axolotl.isFinished);
    
    if (allFinished) {
        if (currentRound >= 10) {
            winGame();
        } else {
            nextRound();
        }
    }
}

function nextRound() {
    currentRound++;
    roundNumDisplay.innerText = currentRound;
    players.turtle.reset();
    players.axolotl.reset();
    spawnLevelElements();
}

function winGame() {
    isGameActive = false;
    winOverlay.classList.remove('hidden');
    
    // Play Victory Music (YouTube Embed)
    const videoContainer = document.getElementById('victory-video-container');
    videoContainer.innerHTML = `
        <iframe width="300" height="170" 
            src="https://www.youtube.com/embed/3BsBXp6VkvU?autoplay=1" 
            title="YouTube video player" frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen></iframe>
    `;
}

function gameLoop() {
    if (!isGameActive) return;
    handleInput();
    updateCrabs();
    checkRoundEnd();
    requestAnimationFrame(gameLoop);
}

// Menu Functions
document.getElementById('btn-1p').addEventListener('click', () => startLevel(1));
document.getElementById('btn-2p').addEventListener('click', () => startLevel(2));
document.querySelectorAll('.restart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Clear video
        document.getElementById('victory-video-container').innerHTML = '';
        winOverlay.classList.add('hidden');
        gameOverOverlay.classList.add('hidden');
        menuOverlay.classList.remove('hidden');
    });
});

function startLevel(mode) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    gameMode = mode;
    currentRound = 1;
    roundNumDisplay.innerText = currentRound;
    
    players.turtle.isActive = true;
    players.axolotl.isActive = (mode === 2);
    
    if (mode === 2) {
        axolotl.classList.remove('hidden');
    } else {
        axolotl.classList.add('hidden');
    }

    players.turtle.reset();
    players.axolotl.reset();
    
    spawnLevelElements();
    
    menuOverlay.classList.add('hidden');
    isGameActive = true;
    requestAnimationFrame(gameLoop);
}
