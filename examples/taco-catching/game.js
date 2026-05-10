const gameContainer = document.getElementById('game-container');
const panda = document.getElementById('panda');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let isGameOver = false;
let tacos = [];
let pandaX = window.innerWidth / 2;
let lastTacoSpawn = 0;
let spawnRate = 1000; // ms
let gameLoopId;

// Initialize Panda position
panda.style.left = `${pandaX}px`;

// Mouse movement
window.addEventListener('mousemove', (e) => {
    if (isGameOver) return;
    pandaX = e.clientX;
    // Constrain to screen
    const pandaWidth = 60;
    if (pandaX < pandaWidth / 2) pandaX = pandaWidth / 2;
    if (pandaX > window.innerWidth - pandaWidth / 2) pandaX = window.innerWidth - pandaWidth / 2;
    
    panda.style.left = `${pandaX}px`;
});

// Touch support
window.addEventListener('touchmove', (e) => {
    if (isGameOver) return;
    pandaX = e.touches[0].clientX;
    const pandaWidth = 60;
    if (pandaX < pandaWidth / 2) pandaX = pandaWidth / 2;
    if (pandaX > window.innerWidth - pandaWidth / 2) pandaX = window.innerWidth - pandaWidth / 2;
    
    panda.style.left = `${pandaX}px`;
    e.preventDefault();
}, { passive: false });

function spawnTaco() {
    const tacoElement = document.createElement('div');
    tacoElement.className = 'taco';
    tacoElement.innerText = '🌮';
    
    const x = Math.random() * (window.innerWidth - 40);
    const y = -50;
    const speed = 3 + Math.random() * 4;
    
    tacoElement.style.left = `${x}px`;
    tacoElement.style.top = `${y}px`;
    
    gameContainer.appendChild(tacoElement);
    
    tacos.push({
        element: tacoElement,
        x: x,
        y: y,
        speed: speed
    });
}

function updateGame(timestamp) {
    if (isGameOver) return;

    // Spawn tacos
    if (timestamp - lastTacoSpawn > spawnRate) {
        spawnTaco();
        lastTacoSpawn = timestamp;
        // Slowly increase difficulty
        if (spawnRate > 400) spawnRate -= 5;
    }

    // Update tacos
    for (let i = tacos.length - 1; i >= 0; i--) {
        const taco = tacos[i];
        taco.y += taco.speed;
        taco.element.style.top = `${taco.y}px`;

        // Collision detection
        const pandaRect = panda.getBoundingClientRect();
        const tacoRect = taco.element.getBoundingClientRect();

        if (
            tacoRect.bottom >= pandaRect.top &&
            tacoRect.top <= pandaRect.bottom &&
            tacoRect.right >= pandaRect.left &&
            tacoRect.left <= pandaRect.right
        ) {
            // Caught!
            score++;
            scoreElement.innerText = score;
            gameContainer.removeChild(taco.element);
            tacos.splice(i, 1);
            continue;
        }

        // Missed!
        if (taco.y > window.innerHeight) {
            lives--;
            livesElement.innerText = lives;
            gameContainer.removeChild(taco.element);
            tacos.splice(i, 1);

            if (lives <= 0) {
                endGame();
            }
        }
    }

    gameLoopId = requestAnimationFrame(updateGame);
}

function endGame() {
    isGameOver = true;
    cancelAnimationFrame(gameLoopId);
    finalScoreElement.innerText = score;
    gameOverScreen.classList.remove('hidden');
    gameContainer.style.cursor = 'default';
}

function restartGame() {
    // Reset state
    score = 0;
    lives = 3;
    isGameOver = false;
    spawnRate = 1000;
    scoreElement.innerText = score;
    livesElement.innerText = lives;
    
    // Clear tacos
    tacos.forEach(taco => gameContainer.removeChild(taco.element));
    tacos = [];
    
    // Hide overlay
    gameOverScreen.classList.add('hidden');
    gameContainer.style.cursor = 'none';
    
    // Restart loop
    lastTacoSpawn = performance.now();
    requestAnimationFrame(updateGame);
}

restartBtn.addEventListener('click', restartGame);

// Start game
lastTacoSpawn = performance.now();
requestAnimationFrame(updateGame);
