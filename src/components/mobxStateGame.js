import { makeAutoObservable } from "mobx";
const Swal = require("sweetalert2");

export class Game {
  initialScore = {
    x: 0,
    o: 0
  };
  player = "o";
  status = "";
  board = [];
  containers = "";
  grid = 3;

  constructor() {
    this.score = this.initialScore;
    this.resetGame();
    makeAutoObservable(this);
  }
  resetGame() {
    const grid = this.grid;
    this.containers = {
      x: {
        rows: Array(grid).fill(0),
        columns: Array(grid).fill(0),
        diagonal: Array(grid).fill(0),
        inverseDiagonal: Array(grid).fill(0)
      },
      o: {
        rows: Array(grid).fill(0),
        columns: Array(grid).fill(0),
        diagonal: Array(grid).fill(0),
        inverseDiagonal: Array(grid).fill(0)
      }
    };
    this.board = Array(grid)
      .fill(null)
      .map((_) => Array(grid).fill(""));
    this.player = "o";
    this.status = "";
  }

  checkDraw() {
    return this.board.every((row) => row.every((cell) => cell !== ""));
  }

  checkWinner() {
    const currentPlayerContainer = this.containers[this.player];

    //check rows
    const winRow = currentPlayerContainer.rows.findIndex(
      (row) => row === this.grid
    );
    if (winRow > -1) {
      this.winningGrid = Array(this.grid)
        .fill(Number)
        .map((_, index) => ({ row: winRow, column: index }));
      return true;
    }
    //check verticals
    const winCol = currentPlayerContainer.columns.findIndex(
      (col) => col === this.grid
    );
    if (winCol > -1) {
      this.winningGrid = Array(this.grid)
        .fill(Number)
        .map((_, index) => ({ row: index, column: winCol }));
      return true;
    }
    // check diagonal
    if (currentPlayerContainer.diagonal.every((value) => value >= 1)) {
      this.winningGrid = Array(this.grid)
        .fill(Number)
        .map((_, index) => ({ row: index, column: index }));
      return true;
    }
    // check cross diagonal
    if (currentPlayerContainer.inverseDiagonal.every((value) => value >= 1)) {
      this.winningGrid = Array(this.grid)
        .fill(Number)
        .map((_, index) => ({ row: index, column: index - 1 }));
      return true;
    }
    return false;
  }

  updatePlayer() {
    const currentPlayer = this.player === "o" ? "x" : "o";
    this.player = currentPlayer;
  }

  updateScore() {
    const newScore = { ...this.score };
    newScore[this.player] += 1;
    this.score = newScore;
  }

  //change player type after clicking on grid
  updateGame() {
    if (this.checkWinner()) {
      this.status = "won";
      this.updateScore();
      Swal.fire({
        title: `Game over!`,
        text: `The winner is ${this.player}`,
        icon: "success",
        confirmButtonText: "Reset Game"
      }).then((game) => this.resetGame());
    }
    if (this.checkDraw()) {
      this.status = "draw";
      Swal.fire({
        title: `Game over!`,
        text: `We have a draw !`,
        icon: "warning",
        confirmButtonText: "Reset Game"
      }).then((game) => this.resetGame());
      return;
    }
    this.updatePlayer();
  }
  handleCellClick(e, row, col) {
    //asign id to each event
    const { id } = e.target;

    //handle undefined index errors, assign the value "Grid-[rowIndex]-[colIndex] to each grid position. IE- first topleft grid position will be Grid-0-0, etc etc etc."//handle undefined index errors
    const [_, rowIndex, colIndex] = id.split("-");
    //keep a copy of the old board positions in memory
    const newBoard = [...this.board];
    newBoard[+rowIndex][+colIndex] = this.player;
    const newContainers = { ...this.containers };
    //the below clones the current position in each direction and adds a 1 to it.
    //so if row[0]col[1] is clicked, result will be [0,1,0]. if row[1]col[0], then [1,0,0]
    newContainers[this.player].rows[+rowIndex] += 1;
    newContainers[this.player].columns[+colIndex] += 1;

    //checks diagonal
    if (colIndex === rowIndex) {
      newContainers[this.player].diagonal[+colIndex] += 1;
    }

    //checks cross diagonal
    if (+rowIndex + +colIndex === this.grid - 1) {
      newContainers[this.player].inverseDiagonal[+colIndex] += 1;
    }

    this.containers = newContainers;
    this.board = newBoard;
    this.updateGame();
  }
}
