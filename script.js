const character = document.getElementById("character");
const block = document.getElementById("block");
const scoreSpan = document.getElementById("scoreSpan");
const pauseOverlay = document.getElementById("pauseOverlay");

let score = 0;
let isPaused = false;
let blockPos = 600;
let speed = 5; // Starting speed

function gameLoop() {
    if (!isPaused) {
        blockPos -= speed;
        if (blockPos < -30) {
            blockPos = 600 + Math.random() * 200; // Random distance
            score++;
            speed += 0.2; // Gradually speeds up
            scoreSpan.innerHTML = score;
        }
        block.style.left = blockPos + "px";

        // Collision Detection
        let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
        if (blockPos < 90 && blockPos > 50 && characterBottom < 30) {
            alert("Game Over! Score: " + score);
            resetGame();
        }
    }
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    score = 0;
    speed = 5;
    blockPos = 600;
    scoreSpan.innerHTML = score;
}

function jump() {
    if (!character.classList.contains("animate") && !isPaused) {
        character.classList.add("animate");
        setTimeout(() => character.classList.remove("animate"), 500);
    }
}

function togglePause() {
    isPaused = !isPaused;
    pauseOverlay.classList.toggle("hidden");
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") jump();
    if (e.code === "KeyP") togglePause();
});

gameLoop();
