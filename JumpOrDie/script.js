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
let baseSpeed = 5; 
let speed = baseSpeed;

function gameLoop() {
    if (!isPaused && !isGameOver) {
        blockPos -= speed; // Move RIGHT to LEFT
        
        if (blockPos < -40) {
            blockPos = 600 + Math.random() * 200; 
            score++;
            scoreSpan.innerHTML = score;

            // Tiered Difficulty Logic
            if (score >= 30) {
                speed = baseSpeed + 3; // Much faster after 30
            } else if (score >= 10) {
                speed = baseSpeed + 1.5; // Slightly faster after 10
            } else {
                speed = baseSpeed; // Normal speed at start
            }
        }
        
        block.style.left = blockPos + "px";

        let charBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
        
        // Accurate collision for the new box sizes
        if (blockPos < 80 && blockPos > 50 && charBottom < 40) {
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
    speed = baseSpeed;
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
        setTimeout(() => character.classList.remove("animate"), 600);
    }
    if (e.code === "KeyP") togglePause();
});

gameLoop();