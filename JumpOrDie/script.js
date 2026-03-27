const character = document.getElementById("character");
const block = document.getElementById("block");
const scoreSpan = document.getElementById("scoreSpan");
const pauseBtn = document.getElementById("pauseBtn");
const gameOverBanner = document.getElementById("gameOverBanner");
const finalScore = document.getElementById("finalScore");

let score = 0;
let isPaused = false;
let isGameOver = false;
let blockPos = 600;
let speed = 6; 

function gameLoop() {
    if (!isPaused && !isGameOver) {
        blockPos -= speed;
        
        if (blockPos < -30) {
            blockPos = 600 + Math.random() * 300; 
            score++;
            speed += 0.4; // Increases speed every point
            scoreSpan.innerHTML = score;
        }
        
        block.style.left = blockPos + "px";

        let charBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
        
        // Collision Detection
        if (blockPos < 80 && blockPos > 50 && charBottom < 30) {
            handleGameOver();
        }
    }
    requestAnimationFrame(gameLoop);
}

function handleGameOver() {
    isGameOver = true;
    finalScore.innerHTML = score;
    gameOverBanner.classList.remove("hidden");
}

function resetGame() {
    score = 0;
    speed = 6;
    blockPos = 600;
    isGameOver = false;
    scoreSpan.innerHTML = "0";
    gameOverBanner.classList.add("hidden");
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.innerHTML = isPaused ? "Play" : "Pause";
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !character.classList.contains("animate") && !isPaused && !isGameOver) {
        character.classList.add("animate");
        setTimeout(() => character.classList.remove("animate"), 500);
    }
});

// Start the game loop
gameLoop();