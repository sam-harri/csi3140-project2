import Row from "./Row";

const Board = ({ boardProp }) => {
  const filledRows = [...boardProp.rows];

  while (filledRows.length < 6) {
    filledRows.push({ letters: Array(5).fill(""), evaluation: Array(5).fill("") });
  }

  return (
    <div className="flex h-[420px] w-[350px] flex-col space-y-1 p-[10px]">
      {filledRows.map(({ letters, evaluation }, index) => (
        <Row key={index} letters={letters} evaluation={evaluation} />
      ))}
    </div>
  );
};

export default Board;
