const character = document.getElementById("character");
const block = document.getElementById("block");
const scoreSpan = document.getElementById("scoreSpan");
const pauseOverlay = document.getElementById("pauseOverlay");

let score = 0;
let isPaused = false;
let blockPos = 600;
let speed = 5; 

function gameLoop() {
    if (!isPaused) {
        blockPos -= speed;
        
        // If block goes off screen
        if (blockPos < -30) {
            blockPos = 600 + Math.random() * 300; // Randomize gap
            score++;
            speed += 0.3; // This increases difficulty every point!
            scoreSpan.innerHTML = score;
        }
        
        block.style.left = blockPos + "px";

        // Collision Logic
        let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
        
        // Check if character is hitting the block
        if (blockPos < 90 && blockPos > 50 && characterBottom < 35) {
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
    character.classList.remove("animate");
}

function jump() {
    if (!character.classList.contains("animate") && !isPaused) {
        character.classList.add("animate");
        setTimeout(() => character.classList.remove("animate"), 500);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") jump();
    if (e.code === "KeyP") {
        isPaused = !isPaused;
        pauseOverlay.classList.toggle("hidden");
    }
});

gameLoop();
