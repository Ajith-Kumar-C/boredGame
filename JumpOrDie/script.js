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

function createTree(offsetX = 0, isSmall = false) {
    const treeDiv = document.createElement("div");
    treeDiv.classList.add("tree");
    if (isSmall) treeDiv.classList.add("small-tree");
    
    treeDiv.innerHTML = `<div class="tree-leaves"></div><div class="tree-trunk"></div>`;
    
    let treeObj = {
        element: treeDiv,
        x: 650 + offsetX,
        width: isSmall ? 22 : 30 // Smaller hit detection for small trees
    };
    
    treeContainer.appendChild(treeDiv);
    trees.push(treeObj);
}

function spawnTreeGroup() {
    // Randomly decide: 1 tree or 2 trees (A pair)
    const isPair = Math.random() > 0.6;
    
    if (isPair) {
        // Create a pair: One normal, one small, very close together (45px apart)
        createTree(0, false);
        createTree(45, true); 
    } else {
        // Create a single tree (randomly normal or small)
        createTree(0, Math.random() > 0.7);
    }
}

function gameLoop() {
    if (!isPaused && !isGameOver && gameStarted) {
        // Spawn Logic: Check if screen is clear or large gap exists
        if (trees.length === 0 || trees[trees.length - 1].x < 300) {
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
            // Human is at x: 50 to 84. Tree hit box adjusted for size.
            if (tree.x < 80 && tree.x > 45 && charBottom < 45) {
                handleGameOver();
            }

            // Scoring and Cleanup
            if (tree.x < -50) {
                tree.element.remove();
                trees.splice(i, 1);
                score++;
                scoreSpan.innerHTML = score;
                speed += 0.01; // Extremely minimal speed increase
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