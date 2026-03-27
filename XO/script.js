let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;

const winStatus = document.getElementById("winStatus");
const turnDisplay = document.getElementById("turnDisplay");
const banner = document.getElementById("gameOverBanner");
const cells = document.querySelectorAll(".cell");

const winConditions = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
];

function makeMove(idx) {
    if (board[idx] === "" && isGameActive) {
        board[idx] = currentPlayer;
        cells[idx].innerText = currentPlayer;
        cells[idx].style.color = currentPlayer === "X" ? "#eb4d4b" : "#2980b9";
        checkResult();
    }
}

function checkResult() {
    let roundWon = false;
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        winStatus.innerText = currentPlayer + " WINS!";
        banner.classList.remove("hidden");
        isGameActive = false;
    } else if (!board.includes("")) {
        winStatus.innerText = "DRAW!";
        banner.classList.remove("hidden");
        isGameActive = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        turnDisplay.innerText = currentPlayer;
    }
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    turnDisplay.innerText = "X";
    banner.classList.add("hidden");
    cells.forEach(c => c.innerText = "");
}