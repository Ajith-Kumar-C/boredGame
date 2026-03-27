const character = document.getElementById("character");
const treeContainer = document.getElementById("treeContainer");
const scoreSpan = document.getElementById("scoreSpan");
const highScoreSpan = document.getElementById("highScoreSpan");
const startScreen = document.getElementById("startScreen");
const pauseBtn = document.getElementById("pauseBtn");
const gameOverBanner = document.getElementById("gameOverBanner");

let score = 0;
let highScore = localStorage.getItem("legoHighScore") || 0;
let isPaused = true;
let isGameOver = false;
let gameStarted = false;
let speed = 5;
let trees = [];

highScoreSpan.innerHTML = highScore;

function startGame() {
    gameStarted = true;
    isPaused = false;
    startScreen.classList.add("hidden");
    character.classList.remove("hidden");
    pauseBtn.classList.remove("hidden");
    gameLoop();
}

function createTree(offsetX = 0) {
    const treeDiv = document.createElement("div");
    treeDiv.classList.add("tree");
    treeDiv.innerHTML = `<div class="tree-leaves"></div><div class="tree-trunk"></div>`;
    
    let treeObj = {
        element: treeDiv,
        x: 650 + offsetX
    };
    
    treeContainer.appendChild(treeDiv);
    trees.push(treeObj);
}

function spawnTreeGroup() {
    // Randomly decide group size: 1, 2, or 3 trees
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
        // Clump them close together (50px gap)
        createTree(i * 55); 
    }
}

function gameLoop() {
    if (!isPaused && !isGameOver && gameStarted) {
        // Spawn Logic: Check if the last tree is far enough to start a new group
        if (trees.length === 0 || trees[trees.length - 1].x < 250) {
            // Random chance to spawn a group if screen is clearing
            if (Math.random() > 0.98 || trees.length === 0) {
                spawnTreeGroup();
            }
        }

        for (let i = trees.length - 1; i >= 0; i--) {
            let tree = trees[i];
            tree.x -= speed;
            tree.element.style.left = tree.x + "px";

            // Collision Detection
            let charBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
            if (tree.x < 85 && tree.x > 45 && charBottom < 45) {
                handleGameOver();
            }

            // Scoring and Cleanup
            if (tree.x < -40) {
                tree.element.remove();
                trees.splice(i, 1);
                score++;
                scoreSpan.innerHTML = score;
                speed += 0.02; // Very minimal speed increase
            }
        }
        requestAnimationFrame(gameLoop);
    }
}

function handleGameOver() {
    isGameOver = true;
    character.classList.add("frozen");
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("legoHighScore", highScore);
        highScoreSpan.innerHTML = highScore;
    }
    document.getElementById("finalScore").innerHTML = score;
    document.getElementById("bestScore").innerHTML = highScore;
    gameOverBanner.classList.remove("hidden");
}

function resetGame() {
    score = 0; speed = 5; isGameOver = false; isPaused = false;
    scoreSpan.innerHTML = "0";
    character.classList.remove("frozen");
    gameOverBanner.classList.add("hidden");
    trees.forEach(t => t.element.remove());
    trees = [];
    gameLoop();
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.innerHTML = isPaused ? "Play" : "Pause";
    if (!isPaused) gameLoop();
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !character.classList.contains("animate") && !isPaused && !isGameOver && gameStarted) {
        character.classList.add("animate");
        setTimeout(() => character.classList.remove("animate"), 600);
    }
    if (e.code === "KeyP") togglePause();
});