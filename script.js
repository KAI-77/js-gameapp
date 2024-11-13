document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const scoreDisplay = document.getElementById("score");
  let board;
  let score;
  let is2048Exist = false;
  let is4096Exist = false;
  let is8192Exist = false;

  function initGame() {
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    score = 0;
    is2048Exist = false;
    is4096Exist = false;
    is8192Exist = false;
    addNewTile();
    addNewTile();
    updateBoard();
  }

  function addNewTile() {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyTiles.push({ row: i, col: j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { row, col } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function updateBoard() {
    const cells = gameBoard.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = board[row][col];
      cell.textContent = value !== 0 ? value : "";
      cell.className = `cell cell-${value}`;
    });
    scoreDisplay.textContent = score;
  }

  function move(direction) {
    let moved = false;
    const newBoard = JSON.parse(JSON.stringify(board));

    function shiftTiles(row) {
      const filteredRow = row.filter((tile) => tile !== 0);
      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
          score += filteredRow[i];
          checkWin(filteredRow[i]);
        }
      }
      const newRow = filteredRow.filter((tile) => tile !== 0);
      while (newRow.length < 4) {
        newRow.push(0);
      }
      return newRow;
    }

    if (direction === "ArrowLeft" || direction === "ArrowRight") {
      for (let i = 0; i < 4; i++) {
        const row =
          direction === "ArrowLeft" ? newBoard[i] : newBoard[i].reverse();
        const newRow = shiftTiles(row);
        newBoard[i] = direction === "ArrowLeft" ? newRow : newRow.reverse();
        if (JSON.stringify(newBoard[i]) !== JSON.stringify(board[i])) {
          moved = true;
        }
      }
    } else if (direction === "ArrowUp" || direction === "ArrowDown") {
      for (let j = 0; j < 4; j++) {
        const column = [
          newBoard[0][j],
          newBoard[1][j],
          newBoard[2][j],
          newBoard[3][j],
        ];
        const newColumn =
          direction === "ArrowUp"
            ? shiftTiles(column)
            : shiftTiles(column.reverse()).reverse();
        for (let i = 0; i < 4; i++) {
          if (newBoard[i][j] !== newColumn[i]) {
            moved = true;
          }
          newBoard[i][j] = newColumn[i];
        }
      }
    }

    if (moved) {
      board = newBoard;
      addNewTile();
      updateBoard();
      if (hasLost()) {
        setTimeout(() => {
          alert("Game Over! Click any arrow key to restart.");
          initGame();
        }, 100);
      }
    }
  }

  function checkWin(value) {
    if (value === 2048 && !is2048Exist) {
      is2048Exist = true;
      setTimeout(() => alert("You win! You got the 2048 tile!"), 100);
    } else if (value === 4096 && !is4096Exist) {
      is4096Exist = true;
      setTimeout(() => alert("You are awesome! You got the 4096 tile!"), 100);
    } else if (value === 8192 && !is8192Exist) {
      is8192Exist = true;
      setTimeout(
        () => alert("You are a 2048 master! You got the 8192 tile!"),
        100
      );
    }
  }

  function hasLost() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          return false;
        }
        if (
          (i < 3 && board[i][j] === board[i + 1][j]) ||
          (j < 3 && board[i][j] === board[i][j + 1])
        ) {
          return false;
        }
      }
    }
    return true;
  }

  document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      move(e.key);
    }
  });

  gameBoard.addEventListener("focus", () => {
    gameBoard.style.outline = "none";
  });

  initGame();
});
