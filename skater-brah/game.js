// --- Game Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

let score = 0;
let gameOver = true; // Start as true to show 'Start Game' button
let animationFrameId;

// --- Player ---
const player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 150,
    width: 80,
    height: 145,
    speed: 7,
    dx: 0 // Direction of movement
};

const playerImage = new Image();
let imageLoaded = false;
playerImage.onload = () => {
    imageLoaded = true;
};
playerImage.onerror = () => {
    imageLoaded = false;
    console.error("Player image 'player.png' not found. Using fallback rectangle.");
};
playerImage.src = 'player.png'; // Make sure you saved the sprite as this!

// --- Background (Simple Scrolling Road) ---
const roadLineHeight = 30;
const roadLineGap = 60;
let roadLineY = 0;
let obstacleSpeed = 4; // Moved this global

function drawRoad() {
    ctx.fillStyle = '#4a4a4a'; // Darker road from CSS
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw scrolling road lines
    ctx.fillStyle = '#fff'; // White lines
    for (let i = 0; i < canvas.height / (roadLineHeight + roadLineGap) + 2; i++) {
        ctx.fillRect(canvas.width / 2 - 5, roadLineY + i * (roadLineHeight + roadLineGap), 10, roadLineHeight);
    }
    
    // Only scroll road if game is running
    if (!gameOver) {
        roadLineY += obstacleSpeed / 2;
        if (roadLineY >= (roadLineHeight + roadLineGap)) {
            roadLineY = 0;
        }
    }
}

// --- Obstacles ---
let obstacles = [];
let obstacleSpawnTimer = 0;
const obstacleTypes = [
    { type: 'cone', width: 30, height: 40, color: '#f90' },
    { type: 'hydrant', width: 40, height: 60, color: '#e74c3c' }, // Red
    { type: 'boombox', width: 60, height: 40, color: '#34495e' } // Dark blue/grey
];

function spawnObstacle() {
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const obstacle = {
        x: Math.random() * (canvas.width - type.width),
        y: -type.height,
        width: type.width,
        height: type.height,
        color: type.color,
        type: type.type // Store type for drawing
    };
    obstacles.push(obstacle);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        if (obstacle.type === 'cone') {
            ctx.fillStyle = obstacle.color;
            ctx.beginPath();
            ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fff'; // White band
            ctx.fillRect(obstacle.x + obstacle.width * 0.2, obstacle.y + obstacle.height * 0.6, obstacle.width * 0.6, obstacle.height * 0.15);
        } else if (obstacle.type === 'hydrant') {
            ctx.fillStyle = obstacle.color; // Red
            ctx.fillRect(obstacle.x + obstacle.width * 0.2, obstacle.y, obstacle.width * 0.6, obstacle.height * 0.6); // Top cylinder
            ctx.fillRect(obstacle.x + obstacle.width * 0.1, obstacle.y + obstacle.height * 0.6, obstacle.width * 0.8, obstacle.height * 0.2); // Middle base
            ctx.fillRect(obstacle.x, obstacle.y + obstacle.height * 0.8, obstacle.width, obstacle.height * 0.2); // Bottom base
            ctx.fillStyle = '#333'; // Dark for caps
            ctx.fillRect(obstacle.x + obstacle.width * 0.35, obstacle.y - 5, obstacle.width * 0.3, 10);
        } else if (obstacle.type === 'boombox') {
            ctx.fillStyle = obstacle.color; // Dark grey
            ctx.fillRect(obstacle.x, obstacle.y + obstacle.height * 0.2, obstacle.width, obstacle.height * 0.8);
            ctx.fillStyle = '#95a5a6'; // Light grey for speakers/grill
            ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.height * 0.3, obstacle.width / 3 - 5, obstacle.height * 0.6);
            ctx.fillRect(obstacle.x + obstacle.width - (obstacle.width / 3), obstacle.y + obstacle.height * 0.3, obstacle.width / 3 - 5, obstacle.height * 0.6);
            ctx.fillStyle = '#e67e22'; // Orange for buttons/details
            ctx.fillRect(obstacle.x + obstacle.width / 2 - 5, obstacle.y + obstacle.height * 0.3, 10, 10);
            ctx.fillRect(obstacle.x + obstacle.width / 2 - 5, obstacle.y + obstacle.height * 0.5, 10, 10);
        }
    });
}

function updateObstacles() {
    obstacleSpawnTimer++;
    if (obstacleSpawnTimer > 90) { // Adjust for difficulty and 90s pace
        spawnObstacle();
        obstacleSpawnTimer = 0;
        if (obstacleSpeed < 8) { // Max speed
            obstacleSpeed += 0.1;
        }
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacleSpeed;

        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
        }

        // Collision detection
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
        }
    });
}

// --- Game Loop ---
function drawPlayer() {
    if (imageLoaded) {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    } else {
        // Draw a fallback 90s-style box if image fails
        ctx.fillStyle = '#00ff00'; // Neon green skater
        ctx.fillRect(player.x + player.width/4, player.y, player.width/2, player.height/3); // Torso
        ctx.fillStyle = '#ff00ff'; // Magenta pants
        ctx.fillRect(player.x + player.width/4, player.y + player.height/3, player.width/2, player.height/3);
        ctx.fillStyle = '#333'; // "Skateboard"
        ctx.fillRect(player.x, player.y + player.height - 20, player.width, 20);
    }
}

function drawScore() {
    ctx.fillStyle = '#00ff00';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 10, 30);
}

function update() {
    if (gameOver) {
        cancelAnimationFrame(animationFrameId);
        gameOverScreen.classList.remove('hidden');
        finalScoreDisplay.textContent = score;
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear only what's needed or whole canvas

    drawRoad(); // Draw background first

    // Update Player
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    drawPlayer();
    updateObstacles();
    drawObstacles();
    drawScore();

    animationFrameId = requestAnimationFrame(update);
}

// --- Controls ---
function move(dir) {
    if (dir === 'left') {
        player.dx = -player.speed;
    } else if (dir === 'right') {
        player.dx = player.speed;
    }
}

function stop() {
    player.dx = 0;
}

// --- Game State Management ---
function startGame() {
    score = 0;
    obstacles = [];
    obstacleSpeed = 4;
    player.x = canvas.width / 2 - 40;
    roadLineY = 0;
    gameOver = false;
    startButton.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Clear any old animation frame
    cancelAnimationFrame(animationFrameId);
    // Start the game loop
    update();
}

// --- Event Listeners ---
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        move('left');
    } else if (e.key === 'ArrowRight') {
        move('right');
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        stop();
    }
});

// --- Initial Draw ---
// Draw the static start screen right away, even before image loads.
drawRoad();
drawPlayer();
drawScore();