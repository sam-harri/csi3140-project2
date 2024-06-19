'use client';
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import Board from "@/components/Board";
import { generate } from "random-words";

const initialBoardProp = {
  rows: [],
  solution: []
};

export default function Home() {
  const [boardProp, setBoardProp] = useState(initialBoardProp);
  const [inputWord, setInputWord] = useState("");

  const newGame = () => {
    let word = generate({ minLength: 5, maxLength: 5 })
    toast.success("New game started!");
    console.log(word)
    setBoardProp(initialBoardProp)
    setBoardProp((prev) => ({
      ...prev,
      solution: word.toUpperCase().split("")
    }));
  }

  useEffect(() => {
    newGame()
  }, []);


  const handleInputChange = (e) => {
    setInputWord(e.target.value.toUpperCase());
  };

  const handleSubmit = () => {
    if (inputWord.length !== 5) {
      toast.error("Word must be 5 letters long");
      return;
    }

    const evaluation = inputWord.split("").map((letter, index) => {
      if (boardProp.solution[index] === letter) {
        return "correct";
      } else if (boardProp.solution.includes(letter)) {
        return "present";
      } else {
        return "absent";
      }
    });

    const newRows = [
      ...boardProp.rows,
      { letters: inputWord.split(""), evaluation }
    ];

    setBoardProp((prev) => ({
      ...prev,
      rows: newRows
    }));

    setInputWord("");
  };

  useEffect(() => {
    const isWinner = boardProp.rows.some(row => row.evaluation.every(e => e === "correct"));
    if (isWinner) {
      toast.success("Congratulations, you've won!");
      setTimeout(() => newGame(), 2000);
    }
    if (boardProp.rows.length === 6 && !isWinner) {
      toast.error("Better luck next time!");
      setTimeout(() => newGame(), 2000);
    }
  }, [boardProp.rows]);

  return (
    <div className={`flex h-screen w-full flex-col bg-gray-100`}>
      <header className="flex h-16 w-full items-center justify-center border-b-2 border-b-gray-500 text-black">
        <div className="absolute left-0 flex items-center justify-center pl-4">
          <a href="https://github.com/sam-harri/csi3140-project2">
            <FaGithub size={24} />
          </a>
        </div>
        <div className="text-4xl font-bold">Wordle Clone</div>
      </header>
      <main className="flex flex-col items-center">
        <div className="flex items-center mt-12">
          <Board boardProp={boardProp} />
        </div>
        <div className="flex items-center space-x-2 p-4">
          <input
            type="text"
            value={inputWord}
            onChange={handleInputChange}
            className="p-2 border border-gray-500 rounded text-black focus:outline-none"
            maxLength="5"
          />
          <button
            onClick={handleSubmit}
            className="p-2 bg-gray-800 text-white rounded"
          >
            Submit
          </button>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
