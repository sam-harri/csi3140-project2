import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Row from "./Row";

const Board = ({ boardProp }) => {
  const rows = boardProp.rows;

  const filledRows = [...rows];

  // Fill the rest with blanks if less than 5 rows
  while (filledRows.length < 6) {
    filledRows.push({ letters: Array(5).fill(""), evaluation: Array(5).fill("") });
  }

  return (
    <div className="flex h-[420px] w-[350px] flex-col space-y-1 p-[10px]">
      <Toaster />
      {filledRows.map(({ letters, evaluation }, index) => (
        <Row key={index} letters={letters} evaluation={evaluation} />
      ))}
    </div>
  );
};

export default Board;
