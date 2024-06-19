import Tile from "./Tile";

const maxLetters = 5;

const Row = ({ letters, evaluation }) => {
  let letterArray = Array.from(letters);
  const letterCount = letterArray.length;
  if (letterArray.length < maxLetters) {
    for (let i = 0; i < maxLetters - letterCount; i++) {
      letterArray.push("");
    }
  }

  return (
    <div className="flex space-x-[5px]">
      {letterArray.map((letter, index) => {
        let onFlipEnd;
        if (index === letterArray.length - 1)
          onFlipEnd = () => {
            dispatch(lastTileReveal());
          };
        return (
          <Tile
            key={index}
            letter={letter}
            flipDelay={index * 300}
            evaluation={evaluation?.at(index)}
            onFlipEnd={onFlipEnd}
          />
        );
      })}
    </div>
  );
};

export default Row;
