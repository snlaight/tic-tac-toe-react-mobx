import React from "react";
import TicTacNew from "./mobxtest";

const NewGame = () => {
  return (
    <div>
      <section className="text-white py-16 text-center px-4 md:px-section h-screen flex flex-col justify-center">
        <h1 className="font-bold text-3xl mb-5"> TicTacToe </h1>
        <div className="flex flex-row flex-wrap justify-between items-center w-full">
          <div className="hidden md:block">{TicTacNew.renderPlayerScore("o")}</div>
          <div className="relative mx-1 md:mx-4 w-96 h-96 border border-gray-100 ">
            {TicTacNew.renderBoard()}
          </div>
          <div className="block md:hidden">{TicTacNew.renderPlayerScore("o")}</div>
          <div> {TicTacNew.renderPlayerScore("x")}</div>
        </div>
      </section>
    </div>
  );
}; 
export default NewGame;
