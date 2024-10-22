var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var startScreen = document.getElementById('startScreen');
var endScreen = document.getElementById('endScreen');
var startButton = document.getElementById('startButton');
var restartButton = document.getElementById('restartButton');
var scoreDisplay = document.getElementById('scoreDisplay');
var highScoreDisplay = document.getElementById('highScoreDisplay');
var currentScoreElement = document.getElementById('currentScore');
var highScoreElement = document.getElementById('highScore');

var grid = 16;
var count = 0;
var score = 0;
var highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = highScore;
var animationFrameId;

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

var letters = ["N", "A", "N", "D", "A"];
var currentLetterIndex = 0;

var apple = {
  x: getRandomInt(0, 25) * grid,
  y: getRandomInt(0, 25) * grid
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  score = 0;
  currentScoreElement.textContent = score;
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

function gameOver() {
  endScreen.style.display = 'flex';
  scoreDisplay.innerHTML = "Your Score: " + score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }

  highScoreDisplay.innerHTML = "High Score: " + highScore;
}

function loop() {
  animationFrameId = requestAnimationFrame(loop);

  if (++count < 10) { 
    return;
  }
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({x: snake.x, y: snake.y});

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  
  context.fillStyle = 'RED'; // Set text color
  context.font = '20px Arial';
  context.fillText(letters[currentLetterIndex], apple.x + 5, apple.y + 15); // Display the current letter


  snake.cells.forEach(function(cell, index) {
    context.beginPath();
    if (index === 0) {
      // Snake head (darker green)
      context.arc(cell.x + grid / 2, cell.y + grid / 2, grid / 2, 0, 2 * Math.PI);
      context.fillStyle = 'darkgreen';
      context.fill();
    } else {
      // Snake body (lighter green)
      context.arc(cell.x + grid / 2, cell.y + grid / 2, grid / 2, 0, 2 * Math.PI);
      context.fillStyle = 'green';
      context.fill();
    }

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      currentScoreElement.textContent = score;

      currentLetterIndex = (currentLetterIndex + 1) % letters.length;

      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
        resetGame();
      }
    }
  });
}

document.addEventListener('keydown', function(e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

startScreen.style.display = 'flex';

startButton.addEventListener('click', function() {
  startScreen.style.display = 'none';
  resetGame();
  requestAnimationFrame(loop);
});

restartButton.addEventListener('click', function() {
  endScreen.style.display = 'none';
  resetGame();
  requestAnimationFrame(loop);
});

document.getElementById('upArrow').addEventListener('click', function() {
  if (snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
});

document.getElementById('downArrow').addEventListener('click', function() {
  if (snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

document.getElementById('leftArrow').addEventListener('click', function() {
  if (snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
});

document.getElementById('rightArrow').addEventListener('click', function() {
  if (snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
});