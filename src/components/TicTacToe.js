import React from "react";
import { useEffect, useState } from "react";

const Swal = require("sweetalert2");

const TicTacToe = () => {
  const initialScore = {
    x: 0,
    o: 0,
  };
  //HOW TO HANDLE THESE WITH MOBX ??? REACT STATE HOOKS ARE EASY.

  //set the starting and player turn.
  const [player, setPlayer] = useState("o");
  //used to update the game status when there is a matching result
  const [status, setStatus] = useState("");
  //this saves the player moves to check for winning logic
  const [containers, setContainers] = useState("");
  /// this will set the grid size and arrays to check against
  const [grid, setGrid] = useState(3);
  //self explanatory -- set the initial score of the game
  const [score, setScore] = useState(initialScore);
  /// set the game board.
  const [board, setBoard] = useState([]);
  //as the board grows, need a better way to handle checking for a win -- creating a new array to hold these values is what makes the most sense for the current implementation
  const [winner, setWinningGrid] = useState([]);

  const resetGame = () => {
    setBoard(
      Array(grid)
        .fill(null)
        .map((_) => Array(grid).fill(""))
    );
    setContainers({
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
    });
    setPlayer("o");
    setStatus("");
  };

  //make sure an empty board renders on reload of the page
  useEffect(() => {
    resetGame();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkDraw = () =>
    board.every((row) => row.every((cell) => cell !== ""));

  const checkWinner = () => {
    const currentPlayerContainer = containers[player];

    //check rows
    const winRow = currentPlayerContainer.rows.findIndex((row) => row === grid);
    console.log(winRow);
    if (winRow > -1) {
      setWinningGrid(
        Array(grid)
          .fill(Number)
          .map((_, index) => ({ row: winRow, column: index }))
      );
      return true;
    }
    //check verticals
    const winCol = currentPlayerContainer.columns.findIndex(
      (col) => col === grid
    );
    if (winCol > -1) {
      setWinningGrid(
        Array(grid)
          .fill(Number)
          .map((_, index) => ({ row: index, column: winCol }))
      );
      return true;
    }
    //check diagonal

    if (currentPlayerContainer.diagonal.every((value) => value >= 1)) {
      setWinningGrid(
        Array(grid)
          .fill(Number)
          .map((_, index) => ({ row: index, column: index }))
      );
      return true;
    }
    //check inverse diagonal
    if (currentPlayerContainer.inverseDiagonal.every((value) => value >= 1)) {
      setWinningGrid(
        Array(grid)
          .fill(Number)
          .map((_, index) => ({ row: index, column: grid - index - 1 }))
      );
      return true;
    }

    return false;
  };

  const updatePlayer = () => {
    /// ---->  KEEP THIS AS IS SO PNG REFERENCES AREN'T BROKEN. <------ ///
    setPlayer(player === "o" ? "x" : "o");
  };

  const updateScore = () => {
    const newScore = { ...score };
    newScore[player] += 1;
    setScore(newScore);
  };
  //change player type after player selects their grid.
  const updateGame = () => {
    if (checkWinner()) {
      setStatus("won");
      updateScore();
      Swal.fire({
        title: `Game over!`,
        text: `The winner is ${player}`,
        icon: "success",
        confirmButtonText: "Reset Game",
      }).then((game) => resetGame());
      return;
    }

    if (checkDraw()) {
      setStatus("draw");
      Swal.fire({
        title: `Game over!`,
        text: `We have a draw !`,
        icon: "warning",
        confirmButtonText: "Reset Game",
      }).then((game) => resetGame());
      return;
    }

    updatePlayer();
  };

  const handleCellClick = (e, row, col) => {
    //assign unique id to each event
    const { id } = e.target;

    //handle undefined index errors, assign the value "Grid-[rowIndex]-[colIndex] to each grid position. IE- first topleft grid position will be Grid-0-0, etc etc etc."
    const [_, rowIndex, colIndex] = id.split("-");
    //keep a copy of the old board positions in memory (this neeeds to be updated for performace reasons, there has to be a better way to handle this with MOBX ????)
    const newBoard = [...board];
    newBoard[+rowIndex][+colIndex] = player;
    const newContainers = { ...containers };
    console.log(containers);

    //the below clones the current position in each direction and adds a 1 to it.
    //so if row[0]col[1] is clicked, result will be [0,1,0]. if row[1]col[0], then [1,0,0]
    newContainers[player].rows[+rowIndex] += 1;
    newContainers[player].columns[+colIndex] += 1;

    //checks diagonal
    if (colIndex === rowIndex) {
      newContainers[player].diagonal[+colIndex] += 1;
    }

    /// checks inverseDiagonal conditions
    if (+rowIndex + +colIndex === grid - 1) {
      newContainers[player].inverseDiagonal[+colIndex] += 1;
    }

    setContainers(newContainers);
    setBoard(newBoard);
    updateGame();
  };

  const renderPlayerScore = (player) => {
    return (
      <>
        <p className=" font-bold text-2xl mb-3">{player}</p>
        <p className="text-3xl md:text-5xl">{score[player]} </p>
      </>
    );
  };

  /// this renders the game board and logic --- ideally it will be deconstructed and built in a separate component that receives the grid size from start screen.
  const renderBoard = () => {
    return (
      <div
        className={`h-full w-full bg-gray-300 text-black grid grid-cols-${grid} grid-rows-${grid}`}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              className="border flex justify-center items-center"
              key={`cell-${rowIndex}-${colIndex}`}
              id={`cell-${rowIndex}-${colIndex}`}
              onClick={(e) => handleCellClick(e, rowIndex, colIndex)}
              role="button"
              tabIndex={grid * rowIndex * colIndex}
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
  };

  const setBoardSize = (gridValue) => {
    if (gridValue < 3) {
      return;
    } else {
      setGrid(gridValue);
      setBoard(
        Array(grid)
          .fill(null)
          .map((_) => Array(grid).fill(""))
      );
    }
  };
  const startScreen = () => {
    return (
      <div className="h-full w-full bg-gray-500 text-white">
        <h1 className="text-white font-bold text-3xl mb-5">
          {" "}
          Choose your grid size :
        </h1>
        <div className="flex flex-row flex-wrap justify-evenly text-center">
          <button className="" onClick={() => setGrid(grid - 1)} value="-1">
            {" "}
            -{" "}
          </button>
          <h2>
            {" "}
            Your current game will be {grid} x {grid}{" "}
          </h2>
          <button className="" onClick={() => setGrid(grid + 1)} value="+1">
            {" "}
            +{" "}
          </button>
        </div>
        <button onClick={(e) => setBoardSize(grid)}> START GAME!</button>
      </div>
    );
  };
  ///  \/ PAGE RENDERING STARTS BELOW \/ ///
  return (
    <div>
      <section className="text-white py-16 text-center px-4 md:px-section h-screen flex flex-col justify-center">
        <h1 className="font-bold text-3xl mb-5"> TicTacToe </h1>
        <div className="flex flex-row flex-wrap justify-between items-center w-full">
          <div className="hidden md:block">{renderPlayerScore("o")}</div>
          <div className="relative mx-1 md:mx-4 w-96 h-96 border border-gray-100 ">
            {renderBoard()}
          </div>
          <div className="block md:hidden">{renderPlayerScore("o")}</div>
          <div> {renderPlayerScore("x")}</div>
        </div>
      </section>
    </div>
  );
};

export default TicTacToe;
