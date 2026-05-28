document.addEventListener("DOMContentLoaded", () => {
  const gameGrid = document.querySelector(".game-grid");
  const SIZE = 4;

  let board = [];

  let currentScore = 0;

  const currentScoreElem = document.querySelector(".current-score");
  const highScoreElem = document.querySelector(".high-score");

  let highScore = localStorage.getItem("2048-highScore") || 0;

  highScoreElem.textContent = highScore;

  const gameOverElement = document.querySelector(".game-over");

  function updateScore(value) {
    currentScore += value;
    currentScoreElem.textContent = currentScore;

    if (currentScore > highScore) {
      highScore = currentScore;
      highScoreElem.textContent = highScore;
      localStorage.setItem("2048-highScore", highScore);
    }
  }

  function restartGame() {
    currentScore = 0;
    currentScoreElem.textContent = "0";
    gameOverElement.style.display = "none";
    initializeGames();
  }

  function initializeGames() {
    board = [...Array(SIZE)].map(() => Array(SIZE).fill(0));

    placeRandom();
    placeRandom();

    renderBoard();
  }

  function renderBoard() {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const cell = document.querySelector(
          `[data-row="${i}"][data-col="${j}"]`,
        );

        const pravValue = cell.dataset.value;
        const currentValue = board[i][j];

        if (currentValue !== 0) {
          cell.dataset.value = currentValue;
          cell.textContent = currentValue;

          if (
            currentValue !== parseInt(pravValue) &&
            !cell.classList.contains("new-tile")
          ) {
            cell.classList.add("merge-tile");
          }
        } else {
          delete cell.dataset.value;
          cell.textContent = "";
          cell.classList.remove("merge-tile", "new-tile");
        }
      }
    }

    setTimeout(() => {
      const cell = document.querySelectorAll(".grid-cell");

      cell.forEach((cell) => {
        cell.classList.remove("merge-tile", "new-tile");
      });
    }, 300);
  }

  function placeRandom() {
    const availableCells = [];

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board[i][j] === 0) {
          availableCells.push({ i, j });
        }
      }
    }

    if (availableCells.length > 0) {
      const randomCell =
        availableCells[Math.floor(Math.random() * availableCells.length)];
      board[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;

      const cell = document.querySelector(
        `[data-row="${randomCell.i}"][data-col="${randomCell.j}"]`,
      );
      cell.classList.add("new-tile");
    }
  }

  function move(direction) {
    let hasChanged = false;

    if (direction === "ArrowUp" || direction === "ArrowDown") {
      for (let j = 0; j < SIZE; j++) {
        const column = [...Array(SIZE)].map((_, i) => board[i][j]);
        const newColumn = transform(column, direction === "ArrowUp");

        for (let i = 0; i < SIZE; i++) {
          if (board[i][j] !== newColumn[i]) {
            board[i][j] = newColumn[i];
            hasChanged = true;
          }
        }
      }
    } else if (direction === "ArrowLeft" || direction === "ArrowRight") {
      for (let i = 0; i < SIZE; i++) {
        const row = board[i];
        const newRow = transform(row, direction === "ArrowLeft");

        if (row.join(",") !== newRow.join(",")) {
          board[i] = newRow;
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      placeRandom();
      renderBoard();
      checkGameOver();
    }
  }

  function transform(line, moveTowardsStart) {

    let newLine = line.filter(cell => cell !== 0);

    if(!moveTowardsStart) {
      newLine.reverse();
    }

    for(let i = 0; i < newLine.length - 1; i++) {
      if(newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        updateScore(newLine[i]);
        newLine.splice(i + 1, 1);
      }
    }

    while (newLine.length < SIZE) {
      newLine.push(0);
    }

    if(!moveTowardsStart) {
      newLine.reverse();
    }

    return newLine;

  }

  function checkGameOver() {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board[i][j] === 0) {
          return;
        }
        
        if (j < SIZE - 1 && board[i][j] === board[i][j + 1]) {
          return;
        }
         if (i < SIZE - 1 && board[i][j] === board[i + 1][j]) {
           return;
         }
      }
    }

    gameOverElement.style.display = "flex";
  }

  document.addEventListener("keydown", event => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      move(event.key);
    }
  });

  document.querySelector(".restart-game").addEventListener("click", restartGame);

  initializeGames();
  
});