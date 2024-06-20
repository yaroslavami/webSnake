const canvas = document.querySelector('.grid');
const ctx = canvas.getContext('2d');
const tileCount = 10;
const tileSize = 40;
let headX = 0;
let headY = 0;
let xVelocity = 1; // Start with the snake moving right
let yVelocity = 0;
let appleX = 0;
let appleY = 0;
let score = 0;
let tailLength = 2;
const speed = 10; // Speed of the snake
let timer = 0;
let gameInterval;
let isGameOver = false; // Flag to track game over state
const snakeParts = [];
canvas.width = tileSize * tileCount;
canvas.height = tileSize * tileCount;

function drawGame() {
  if (!isGameOver) { // Check if the game is over before updating
    clearScreen();
    changeSnakePosition();
    drawSnake();
    checkCollision();
    drawApple();
    drawScore();
  }
}
document.getElementById('startButton').addEventListener('click', startGame);
function startGame() {
  initializeGame();
  document.body.addEventListener('keydown', keyDown);
}


function clearScreen() {
  ctx.fillStyle = 'rgb(98, 144, 219)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function initializeGame() {
  clearScreen();
  headX = -1;
  headY = 0;
  xVelocity = 1;
  yVelocity = 0;
  score = 0;
  timer = 0;
  tailLength = 1;
  snakeParts.length = 0;
  snakeParts.push({ x: headX, y: headY });
  generateFood();
  drawGame();
  startTimer();
}

function startTimer() {
  gameInterval = setInterval(() => {
    if (!isGameOver) {
      timer++;
      document.querySelector('.timer').innerText = 'Timer: ' + timer + 's';
    }
    drawGame(); // Call drawGame() at regular intervals to update the game state
  }, 1000 / speed); // Adjust speed
}

function drawSnake() {
  ctx.fillStyle = 'purple';
  snakeParts.forEach(part => {
    ctx.strokeStyle = 'black'; // Border color
    ctx.lineWidth = 2; // Border width
    ctx.strokeRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
  });
}

function drawApple() {
  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'black'; // Border color
  ctx.lineWidth = 2;
  ctx.strokeRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);
  ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);
}

function generateFood() {
  do {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
  } while (isSnakeAt(appleX, appleY));
}

function isSnakeAt(x, y) {
  return snakeParts.some(part => part.x === x && part.y === y);
}

function drawScore() {
  ctx.fillStyle = 'navy';
  ctx.font = '15px verdana';
  ctx.fillText('Score: ' + score, canvas.width - 75, 15);
}

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;

  // Check if the game is over before updating snake position
  if (isGameOver) {
    return;
  }

  // Check if the snake's head goes out of the canvas boundaries
  if (headX < 0 || headY < 0 || headX >= tileCount || headY >= tileCount || isSnakeCollidingWithItself()) {
    endGame();
    return; // Exit the function to stop further movement
  }

  // Add the new head position to the beginning of the snakeParts array
  snakeParts.unshift({ x: headX, y: headY });

  // Remove the last part of the snake if its length exceeds the tailLength
  if (snakeParts.length > tailLength) {
    snakeParts.pop();
  }
}

function endGame() {
  clearScreen()
  clearInterval(gameInterval);
  isGameOver = true; // Set the game over flag to true
  ctx.fillStyle = 'black';
  ctx.font = '50px verdana';
  ctx.fillText('Game Over!', canvas.width / 6.5, canvas.height / 2);
  canvas.style.zIndex = '1';
}

function checkCollision() {
  if (headX === appleX && headY === appleY) {
    tailLength++;
    score++;
    generateFood();
  }
}

function isSnakeCollidingWithItself() {
  // Check if the snake's head collides with any part of its body
  return snakeParts.slice(1).some(part => part.x === headX && part.y === headY);
}

function keyDown(event) {
  if (isGameOver) { // Prevent input handling if the game is over
    return;
  }
  switch (event.keyCode) {
    case 37: // Left arrow key
      if (xVelocity !== 1) { // Prevent moving in opposite direction
        xVelocity = -1;
        yVelocity = 0;
      }
      break;
    case 38: // Up arrow key
      if (yVelocity !== 1) {
        xVelocity = 0;
        yVelocity = -1;
      }
      break;
    case 39: // Right arrow key
      if (xVelocity !== -1) {
        xVelocity = 1;
        yVelocity = 0;
      }
      break;
    case 40: // Down arrow key
      if (yVelocity !== -1) {
        xVelocity = 0;
        yVelocity = 1;
      }
      break;
  }
}
