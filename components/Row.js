import Tile from "./Tile";

const Row = ({ letters, evaluation }) => {
  let letterArray = Array.from(letters);

  return (
    <div className="flex space-x-[5px]">
      {letterArray.map((letter, index) => {
        return (
          <Tile
            key={index}
            letter={letter}
            flipDelay={index * 300}
            evaluation={evaluation?.at(index)}
          />
        );
      })}
    </div>
  );
};

export default Row;
