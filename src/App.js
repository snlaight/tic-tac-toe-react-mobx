import TicTacToe from "./components/TicTacToe";
import React from "react";
import NewGame from './components/newTicTacComponent'


function App() {

  return (
    <div className="bg-gray-900 flex flex-col items-center w-screen">
      <NewGame />
    </div>
  );
}

export default App;
