const character = document.getElementById("character");
const treeContainer = document.getElementById("treeContainer");
const scoreSpan = document.getElementById("scoreSpan");
const highScoreSpan = document.getElementById("highScoreSpan");
const pauseBtn = document.getElementById("pauseBtn");
const gameOverBanner = document.getElementById("gameOverBanner");
const finalScore = document.getElementById("finalScore");
const bestScore = document.getElementById("bestScore");

let score = 0;
let highScore = localStorage.getItem("jumpHighScore") || 0;
let isPaused = false;
let isGameOver = false;
let speed = 5;
let trees = [];

// Initialize High Score Display
highScoreSpan.innerHTML = highScore;

function createTree() {
    const treeDiv = document.createElement("div");
    treeDiv.classList.add("tree");
    treeDiv.innerHTML = `<div class="tree-leaves"></div><div class="tree-trunk"></div>`;
    
    let treeObj = {
        element: treeDiv,
        x: 650 + (Math.random() * 100) // Random slight offset
    };
    
    treeContainer.appendChild(treeDiv);
    trees.push(treeObj);
}

function gameLoop() {
    if (!isPaused && !isGameOver) {
        // Spawn Logic: Min gap of 220px, Max 3 trees
        if (trees.length < 3) {
            let lastTreeX = trees.length > 0 ? trees[trees.length - 1].x : 0;
            if (lastTreeX < 380) { // Ensures a safe jumping gap
                createTree();
            }
        }

        for (let i = trees.length - 1; i >= 0; i--) {
            let tree = trees[i];
            tree.x -= speed;
            tree.element.style.left = tree.x + "px";

            // Collision Detection
            let charBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
            if (tree.x < 80 && tree.x > 50 && charBottom < 40) {
                handleGameOver();
            }

            // Scoring
            if (tree.x < -40) {
                tree.element.remove();
                trees.splice(i, 1);
                score++;
                scoreSpan.innerHTML = score;
                // Very minimal speed increase (0.05 per point)
                speed += 0.05; 
            }
        }
    }
    requestAnimationFrame(gameLoop);
}

function handleGameOver() {
    isGameOver = true;
    character.classList.add("frozen"); // Stops leg animation
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("jumpHighScore", highScore);
        highScoreSpan.innerHTML = highScore;
    }
    finalScore.innerHTML = score;
    bestScore.innerHTML = highScore;
    gameOverBanner.classList.remove("hidden");
}

function resetGame() {
    score = 0; speed = 5; isGameOver = false;
    scoreSpan.innerHTML = "0";
    character.classList.remove("frozen");
    gameOverBanner.classList.add("hidden");
    trees.forEach(t => t.element.remove());
    trees = [];
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