///START SCREEN TO SELECT GAME GRID SIZE WILL GO HERE.
const StartScreen = ({grid}) => {
  return (
    <div>
<h2 >Choose your grid size: </h2>
<div className="flex flex-row flex-wrap">
<button onClick={()=> grid + 1 }> + </button>
<h1> Current size : {grid} x {grid} </h1>
<button onClick={()=> grid - 1}> - </button>
</div>
    </div>
  );
};
export default StartScreen;
