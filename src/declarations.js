import PlayerX from "./players/playerX";
import PlayerO from "./players/playerO";

const TicTacToe = {
  possibleTurnTypes: ["X", "O"],
  rowSize: 3,
  colSize: 3,
  consecutiveRequired: 3,
  lastTurnType: "",
  grid: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  winner: "",
  errorMessage: "",
  moves: [],

  validateTurn(turnType, { row, col }) {
    if (this.winner) {
      this.errorMessage = "Game has ended, loser !!!";
    }

    if (row >= this.rowSize) {
      this.errorMessage = "out of bound row position";
    }
    if (col >= this.colSize) {
      this.errorMessage = "out of bound column position";
    }
    if (this.grid[row][col]) {
      this.errorMessage = `Box is already claimed by ${this.grid[row][col]}`;
    }
    if (this.lastTurnType === turnType) {
      this.errorMessage = `${turnType} just claimed their box, wait for the other player`;
    }
  },
  checkForWinner(turnType, { row, col }) {
    const rowValues = [
      this.grid[row][col - 1],
      this.grid[row][col - 2],
      turnType,
      this.grid[row][col + 1],
      this.grid[row][col + 2],
    ];
    let isConsecutive = false;

    let consecutiveFound = 0;

    for (let i = 0; i < rowValues.length; i++) {
      isConsecutive = rowValues[i] === turnType;
      if (isConsecutive) {
        consecutiveFound += 1;
        if (consecutiveFound === this.consecutiveRequired) {
          this.winner = turnType;
        }
      } else {
        consecutiveFound = 0;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (this.grid[0][i] === turnType && this.grid[1][i] === turnType) {
        this.winner = turnType;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (this.grid[0][i] === turnType && this.grid[1][1] === turnType) {
        this.winner = turnType;
      }
    }
  },
  takeTurn(turnType, { row, col }) {

    // compute who won based on this turn if there is a winner set the value of the winner
    this.checkForWinner(turnType, { row, col });

    let move = this.grid[row][col];
    if (move) {
      return;
    }
    this.validateTurn(turnType, { row, col });
    // make sure row and cols are within bound
    this.grid[row][col] = turnType;
    this.moves.push(move);
    this.lastTurnType = turnType;
  },
  generateGrid(rowSize, colSize) {
    this.rowSize = rowSize;
    this.colSize = colSize;
    this.grid = [];

    for (let i = 0; i < rowSize; i++) {
      const columns = [];
      for (let j = 0; j < colSize; j++) {
        columns.push(this.PlayerO);
      }
      this.grid.push(columns);
    }
    console.log(this.grid);
  },
};
export default TicTacToe;
