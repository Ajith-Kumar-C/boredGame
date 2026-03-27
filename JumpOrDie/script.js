const character = document.getElementById("character");
const treeContainer = document.getElementById("treeContainer");
const scoreSpan = document.getElementById("scoreSpan");
const highScoreSpan = document.getElementById("highScoreSpan");
const startScreen = document.getElementById("startScreen");
const pauseBtn = document.getElementById("pauseBtn");
const gameOverBanner = document.getElementById("gameOverBanner");

let score = 0;
let highScore = localStorage.getItem("dragonHighScore") || 0;
let isPaused = true;
let isGameOver = false;
let gameStarted = false;
let speed = 5;
let trees = [];

highScoreSpan.innerHTML = highScore;

function startGame() {
    gameStarted = true; isPaused = false;
    startScreen.classList.add("hidden");
    character.classList.remove("hidden");
    pauseBtn.classList.remove("hidden");
    gameLoop();
}

function createTree(offsetX = 0, isSmall = false, isScoring = false) {
    const treeDiv = document.createElement("div");
    treeDiv.classList.add("tree");
    if (isSmall) treeDiv.classList.add("small-tree");
    treeDiv.innerHTML = `<div class="tree-leaves"></div><div class="tree-trunk"></div>`;
    
    let treeObj = {
        element: treeDiv,
        x: 650 + offsetX,
        width: isSmall ? 20 : 28,
        isScoring: isScoring,
        passed: false
    };
    treeContainer.appendChild(treeDiv);
    trees.push(treeObj);
}

function spawnTreeGroup() {
    const isPair = Math.random() > 0.6;
    if (isPair) {
        createTree(0, false, true); // First tree scores
        createTree(50, true, false); // Second doesn't
    } else {
        createTree(0, Math.random() > 0.5, true);
    }
}

function gameLoop() {
    if (!isPaused && !isGameOver && gameStarted) {
        if (trees.length === 0 || trees[trees.length - 1].x < 300) {
            if (Math.random() > 0.98 || trees.length === 0) spawnTreeGroup();
        }

        for (let i = trees.length - 1; i >= 0; i--) {
            let tree = trees[i];
            tree.x -= speed;
            tree.element.style.left = tree.x + "px";

            let charBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
            
            // Tightened collision (Human is at x: 50 to 84)
            if (tree.x < 82 && tree.x > 48 && charBottom < 45) handleGameOver();

            if (tree.x < -50) {
                if (tree.isScoring && !tree.passed) {
                    score++;
                    scoreSpan.innerHTML = score;
                    speed += 0.015;
                }
                tree.element.remove();
                trees.splice(i, 1);
            }
        }
        requestAnimationFrame(gameLoop);
    }
}

function handleGameOver() {
    isGameOver = true;
    document.getElementById("gameCanvas").classList.add("frozen");
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("dragonHighScore", highScore);
        highScoreSpan.innerHTML = highScore;
    }
    document.getElementById("finalScore").innerHTML = score;
    document.getElementById("bestScore").innerHTML = highScore;
    gameOverBanner.classList.remove("hidden");
}

function resetGame() {
    score = 0; speed = 5; isGameOver = false; isPaused = false;
    scoreSpan.innerHTML = "0";
    document.getElementById("gameCanvas").classList.remove("frozen");
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