import { useState } from "react";

const TicTacToe = {
  possibleTurnTypes: ["O", "X"],
  rowSize: 3,
  colSize: 3,
  consecutiveRequired: 3,
  lastTurnType: "",
  grid: [
    ["", "", "",],
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
      return;
    }
    if (this.lastTurnType === turnType) {
      this.errorMessage = `${turnType} just claimed their box, wait for the other player`;
    }
  },
  checkForWinner(turnType, { row, col }) {
    console.table(this.grid);

    let hasWon = false;
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
      if (this.grid[0][i] === turnType && this.grid[1][i] === turnType ) {
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
        columns.push("");
      }
      this.grid.push(columns);
    }
    console.log(this.grid)
  },
};

function App() {
  const [turnType, setTurnType] = useState(TicTacToe.possibleTurnTypes[0]);
  // const [gameGrid, setGameGrid]=useState(TicTacToe.generateGrid(3,3))
  const handleTurnClick = (row, col) => () => {
    if (TicTacToe.winner !== "") {
      return;
    }
    TicTacToe.errorMessage = "";
    let grid = { row, col };
    !turnType && grid
      ? (TicTacToe.errorMessage = " you cannot play that box !")
      : TicTacToe.takeTurn(turnType, grid);
    setTurnType(
      turnType === TicTacToe.possibleTurnTypes[0]
        ? TicTacToe.possibleTurnTypes[1]
        : TicTacToe.possibleTurnTypes[0]
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="">TIC TAC TOEING IT UP</h1>
      <div>
        {TicTacToe.grid.map((row, i) => (
          <div className="flex flex-row" key={`row_${i}`}>
            {" "}
            {row.map((col, j) => (
              <div
                className="hover:bg-red-100 border"
                onClick={handleTurnClick(i, j)}
                style={{ padding: 25 }}
                key={`row_col_${i}_${j}`}
              >
                {col || ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      {TicTacToe.winner && (
          <h1 className="text-xl">Winner is {TicTacToe.winner}</h1>
        )}
        {TicTacToe.errorMessage && <p>{TicTacToe.errorMessage}</p>}
    </div>
  );
}

export default App;
