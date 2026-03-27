const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const wordDisplay = document.getElementById('wordToDraw');
let painting = false;

const words = ["DRAGON", "LEGO", "TREE", "HOUSE", "CAR", "SNAKE", "CLOUD"];

function startPosition(e) { painting = true; draw(e); }
function finishedPosition() { painting = false; ctx.beginPath(); }

function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2f3542';

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }
function nextWord() {
    clearCanvas();
    const randomWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.innerText = randomWord;
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);