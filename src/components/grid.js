import TicTacToe from "../declarations";
import React, { useState } from "react";

const Grid = ( ) => {
    const [turnType, setTurnType] = useState(TicTacToe.possibleTurnTypes[0]);
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

      <div>
        {TicTacToe.grid.map((row, i) => (
          <div className="flex flex-row" key={`row_${i}`}>
            {" "}
            {row.map((col, j) => (
              <div
                className="hover:bg-red-100 border h-20 w-20 text-center p-5"
                onClick={handleTurnClick(i, j)}
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

export default Grid