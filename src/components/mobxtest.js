import React from "react";
import { observable, computed, makeObservable, makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
const Swal = require("sweetalert2");

const TicTacNew = () => {
  class Game extends React.Component {
    initialScore = {
      x: 0,
      o: 0,
    };
    player = "o";
    status = "";
    score = this.initialScore;
    board = [];
    containers = "";

    constructor(props) {
      super(props);
      makeObservable(this, {
        initialScore: observable,
        player: observable,
        status: observable,
        board: observable,
        containers: observable,
        winningGrid: observable,
        score: observable,
      });
    }
    resetGame() {
      const grid = this.props.Grid;
      this.containers = {
        x: {
          rows: Array(grid).fill(0),
          columns: Array(grid).fill(0),
          diagonal: Array(grid).fill(0),
          inverseDiagonal: Array(grid).fill(0),
        },
        o: {
          rows: Array(grid).fill(0),
          columns: Array(grid).fill(0),
          diagonal: Array(grid).fill(0),
          inverseDiagonal: Array(grid).fill(0),
        },
      };
      this.player = "o";
      this.status = "";
    }

    checkDraw() {
      this.board.every((row) => row.every((cell) => cell !== ""));
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
          confirmButtonText: "Reset Game",
        }).then((game) => this.resetGame());
      }
      if (this.checkDraw()) {
        this.status = "draw";
        Swal.fire({
          title: `Game over!`,
          text: `We have a draw !`,
          icon: "warning",
          confirmButtonText: "Reset Game",
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
      //keep a copy of the old board positions in memory (this neeeds to be updated for performace reasons, there has to be a better way to handle this with MOBX ????)
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

      this.containers(newContainers);
      this.board(newBoard);
      this.updateGame();
    }

    renderPlayerScore = (player) => {
      return (
        <>
          <p className=" font-bold text-2xl mb-3"> {player} </p>
          <p className="text-3xl md:text-5xl">{this.score[player]} </p>
        </>
      );
    };

    renderBoard() {
      return (
        <div
          className={`h-full w-full bg-gray-300 text-black grid grid-cols-${this.grid} grid-rows-${this.grid}`}
        >
          {this.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                className="border flex justify-center items-center"
                key={`cell-${rowIndex}-${colIndex}`}
                id={`cell-${rowIndex}-${colIndex}`}
                onClick={(e) => this.handleCellClick(e, rowIndex, colIndex)}
                role="button"
                tabIndex={this.grid * rowIndex * colIndex}
              >
                {cell !== "" && (
                  <img
                    className="h-2/5 2/5"
                    src={`${cell}.png`}
                    alt={`Grid-${rowIndex}-${colIndex}`}
                  />
                )}
              </div>
            ))
          )}
        </div>
      );
    }
  }
};

export default observer(TicTacNew);
