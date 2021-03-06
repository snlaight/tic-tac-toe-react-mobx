import React from "react";
import { observer } from "mobx-react";
import Select from "react-select";
const Board = ({ grid, board, handleCellClick }) => {
  return (
    <div
      className={`h-96 w-96 bg-gray-300 text-black grid grid-cols-${grid} grid-rows-${grid}`}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            className="border flex justify-center items-center h-full w-full"
            key={`cell-${rowIndex}-${colIndex}`}
            id={`cell-${rowIndex}-${colIndex}`}
            onClick={(e) => handleCellClick(e, rowIndex, colIndex)}
            role="button"
            tabIndex={grid * rowIndex * colIndex}
          >
            {cell !== "" && (
              <img
                className="h-1/3 w-1/3 p-0 m-0"
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

///switching rendering player score area to component.
const PlayerAndScore = ({ score, player }) => {
  return (
    <>
      <p className=" font-bold text-2xl mb-3"> {player} </p>
      <p className="text-3xl md:text-5xl">{score} </p>
    </>
  );
};

//exporting the new game as a functionable component that is observed by mobx state.
const NewGame = observer(({ game }) => {
  return (
    <div>
      <section className="text-white py-16 text-center px-4 md:px-section h-screen flex flex-col justify-center">
        {game.grid === 0 ? (
          <>
            <h1> Choose your grid size to get started: </h1>
            <div className="text-gray-900 w-full">
              <Select
                options={game.options}
                onChange={(e) => game.setSize(e)}
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="font-bold text-3xl mb-5"> TicTacToe </h1>
            <div className="flex flex-row flex-wrap justify-between items-center w-full">
              <div className="hidden md:block">
                <PlayerAndScore player={"Player 1"} score={game.score["o"]} />
              </div>
              <div className="relative mx-1 md:mx-4 w-auto h-auto border border-gray-100 ">
                <Board
                  grid={game.grid}
                  board={game.board}
                  handleCellClick={(e, rowIndex, colIndex) =>
                    game.handleCellClick(e, rowIndex, colIndex)
                  }
                />
              </div>
              <div className="block md:hidden">
                <PlayerAndScore player={"Player 1"} score={game.score["o"]} />
              </div>
              <div>
                {" "}
                <PlayerAndScore
                  player={"Player 2"}
                  score={game.score["x"]}
                />{" "}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
});

export default NewGame;
