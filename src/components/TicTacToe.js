import React from "react";
import { useEffect, useState } from "react";

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
  //self explanatory -- set the initial score of the game
  const [score, setScore] = useState(initialScore);
  /// set the game board.
  const [board, setBoard] = useState([]);

  const resetGame = () => {
    ///this sets it to 3x3 by default, need to improve on generate grid function so it goes hand in hand with algorithm.
    setBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setContainers({
      x: {
        rows: Array(3).fill(0),
        columns: Array(3).fill(0),
        diagonal: Array(3).fill(0),
        inverseDiagonal: Array(3).fill(0),
      },
      o: {
        rows: Array(3).fill(0),
        columns: Array(3).fill(0),
        diagonal: Array(3).fill(0),
        inverseDiagonal: Array(3).fill(0),
      },
    });
    setPlayer("o");
    setStatus("");
  };

  //make sure an empty board renders on reload of the page
  useEffect(() => {
    resetGame();
  }, []);

  const checkDraw = () =>
    board.every((row) => row.every((cell) => cell !== ""));

  const checkWinner = () => {
    const currentPlayerContainer = containers[player];

    //check rows
    if (currentPlayerContainer.rows.some((value) => value === 3)) {
      return true;
    }
    //check verticals
    if (currentPlayerContainer.columns.some((value) => value === 3)) {
      return true;
    }
    //check diagonal

    if (currentPlayerContainer.diagonal.every((value) => value === 1)) {
      return true;
    }
    //check inverse diagonal
    if (currentPlayerContainer.inverseDiagonal.every((value) => value === 1)) {
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

      return;
    }

    if (checkDraw()) {
      setStatus("draw");

      return;
    }

    updatePlayer();
  };

  const handleCellClick = (e, row, col) => {
    //assign unique id to each event
    const { id } = e.target;

    //handle undefined index errors
    const [_, rowIndex, colIndex] = id.split("-");

    //keep a copy of the old board positions in memory (this neeeds to be updated for performace reasons, there has to be a better way to handle this with MOBX ????)
    const newBoard = [...board];
    newBoard[+rowIndex][+colIndex] = player;
    const newContainers = { ...containers };
    console.log(containers);

    ///LOGIC FOR CHECKING WINNERS IS ABOUT ADDING TO THREE IN THE SAME AXIS -- IS THIS SUSTAINABLE TO A BIGGER BOARD ??

    //the below clones the current position in each direction and adds a 1 to it.
    //so if row[0]col[1] is clicked, result will be [0,1,0]. if row[1]col[0], then [1,0,0]
    newContainers[player].rows[+rowIndex] += 1;
    newContainers[player].columns[+colIndex] += 1;

    //checks diagonal
    if (colIndex === rowIndex) {
      newContainers[player].diagonal[+colIndex] += 1;
    }

    /// checks inverseDiagonal conditions
    if (+rowIndex + +colIndex === 3 - 1) {
      newContainers[player].inverseDiagonal[+colIndex] += 1;
    }

    setContainers(newContainers);
    setBoard(newBoard);
    updateGame();
  };

  const renderNewGame = (e) => {
    resetGame();
  };
  //this will be replaced by sweetAlert, merely in for functionality. Swwet alert will have the option to reset the board.
  const renderStatusOverlay = () => {
    if (status === "") return;
    let message = "";
    if (status === "draw") {
      message = "Draw";
    }
    if (status === "won") {
      message = `${player} won!`;
    }
    return (
      <div className="absolute inset-0 w-full h-full font-bold text-3xl flex items-center justify-center bg-gray-600">
        <p className="break-words"> {message} </p>
      </div>
    );
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
      <div className="h-full w-full bg-gray-300 text-black grid grid-cols-3 grid-rows-3">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              className="border flex justify-center items-center"
              key={`cell-${rowIndex}-${colIndex}`}
              id={`cell-${rowIndex}-${colIndex}`}
              onClick={(e) => handleCellClick(e, rowIndex, colIndex)}
              role="button"
              tabIndex={3 * rowIndex * colIndex}
            >
              {cell !== "" && (
                <img src={`${cell}.png`} alt={`Grid-${rowIndex}-${colIndex}`} />
              )}
            </div>
          ))
        )}
      </div>
    );
  };
  ///  \/ PAGE RENDERING STARTS BELOW \/ ///
  return (
    <div>
      <section className="text-white py=16 text-center px-4 md:px-section h-screen flex flex-col justify-center">
        <h1 className="font-bold text-3xl mb-5"> TicTacToe </h1>
        <div className=" flex flex-row flex-wrap justify-between items-center w-full">
          <div className="hidden md:block">{renderPlayerScore("o")}</div>
          <div className="relative mx-0 md:mx-4 w-96 h-96 border border-gray-100 mb-10 md:mb-0">
            {renderStatusOverlay()}
            {renderBoard()}
          </div>
          <div className="block md:hidden">{renderPlayerScore("o")}</div>
          <div> {renderPlayerScore("x")}</div>
        </div>
        <button
          onClick={(e) => renderNewGame(e)}
          className="bg-gray-500 btn-sm hover:bg-gray-400 text-white font-bold m-5 py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded"
        >
          {" "}
          Reset Game
        </button>
      </section>
    </div>
  );
};

export default TicTacToe;
