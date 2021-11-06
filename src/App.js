import TicTacToe from "./components/newTicTacComponent";
import React from "react";
import { Game } from "./components/mobxStateGame";

const game = new Game();

function App() {
  return (
    <div className="bg-gray-900 flex flex-col items-center w-screen">
      <TicTacToe game={game} />
    </div>
  );
}

export default App;
