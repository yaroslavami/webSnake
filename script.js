const canvas = document.querySelector('.grid');
const ctx = canvas.getContext('2d');
const tileCount = 15;
const tileSize = 30;
let headX = 5;
let headY = 5;
let xVelocity = 1;
let yVelocity = 0;
let appleX = 0;
let appleY = 0;
let score = 0;
let tailLength = 2;
let timer = 0;
let gameInterval;
let isGameOver = false;
const snakeParts = [];
canvas.width = tileSize * tileCount;
canvas.height = tileSize * tileCount;

document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
  initializeGame();
  document.body.addEventListener('keydown', keyDown);
}

function initializeGame() {
  clearScreen();
  headX = 5;
  headY = 5;
  xVelocity = 1;
  yVelocity = 0;
  score = 0;
  timer = 0;
  tailLength = 2;
  isGameOver = false;
  snakeParts.length = 0;
  snakeParts.push({ x: headX, y: headY });
  generateFood();
  startTimer();
}

function startTimer() {
  gameInterval = setInterval(drawGame, 1000 / 3);
}

function drawGame() {
  if (isGameOver) return;
  clearScreen();
  changeSnakePosition();
  drawSnake();
  checkCollision();
  drawApple();
  drawScore();
  document.querySelector('.timer').innerText = 'Timer: ' + timer++ + 's';
}

function clearScreen() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = 'rgba(0, 255, 255, 0.9)';
  ctx.strokeStyle = 'rgba(0, 150, 255, 0.8)';
  ctx.lineWidth = 2;
  snakeParts.forEach(part => {
    ctx.beginPath();
    ctx.arc(part.x * tileSize + tileSize / 2, part.y * tileSize + tileSize / 2, tileSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  });
}

function drawApple() {
  ctx.fillStyle = '#e63600';
  ctx.strokeStyle = '#e63600';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(appleX * tileSize + tileSize / 2, appleY * tileSize + tileSize / 2, tileSize / 2.5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function generateFood() {
  do {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
  } while (isSnakeAt(appleX, appleY));
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Orbitron, sans-serif';
  ctx.fillText('Score: ' + score, canvas.width - 100, 20);
}

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;

  if (headX < 0 || headY < 0 || headX >= tileCount || headY >= tileCount || isSnakeCollidingWithItself()) {
    endGame();
    return;
  }

  snakeParts.unshift({ x: headX, y: headY });
  if (snakeParts.length > tailLength) snakeParts.pop();
}

function endGame() {
  clearInterval(gameInterval);
  isGameOver = true;
  ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.font = '40px Orbitron, sans-serif';
  ctx.fillText('Game Over!', canvas.width / 4, canvas.height / 2);
}

function checkCollision() {
  if (headX === appleX && headY === appleY) {
    tailLength++;
    score++;
    generateFood();
  }
}

function isSnakeAt(x, y) {
  return snakeParts.some(part => part.x === x && part.y === y);
}

function isSnakeCollidingWithItself() {
  return snakeParts.slice(1).some(part => part.x === headX && part.y === headY);
}

function keyDown(event) {
  if (isGameOver) return;
  switch (event.keyCode) {
    case 37: if (xVelocity !== 1) { xVelocity = -1; yVelocity = 0; } break;
    case 38: if (yVelocity !== 1) { xVelocity = 0; yVelocity = -1; } break;
    case 39: if (xVelocity !== -1) { xVelocity = 1; yVelocity = 0; } break;
    case 40: if (yVelocity !== -1) { xVelocity = 0; yVelocity = 1; } break;
  }
}
