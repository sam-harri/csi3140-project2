'use client';
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import Board from "@/components/Board";
import axiosInstance from "../axiosinstance";

const initialBoardProp = {
  rows: [],
  solution: []
};

export default function Home() {
  const [boardProp, setBoardProp] = useState(initialBoardProp);
  const [inputWord, setInputWord] = useState("");
  const [gameId, setGameId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  const newGame = async () => {
    try {
      const response = await axiosInstance.get('/wordle/newgame');
      const { game_id, solution } = response.data;
      setGameId(game_id);
      setBoardProp({
        rows: [],
        solution: solution
      });
      fetchLeaderboard();
      toast.success("New game started!");
    } catch (error) {
      console.error("Failed to start a new game", error);
      toast.error("Failed to start a new game");
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axiosInstance.get('/wordle/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
      toast.error("Failed to fetch leaderboard");
    }
  };

  useEffect(() => {
    newGame();
  }, []);

  const handleInputChange = (e) => {
    setInputWord(e.target.value.toUpperCase());
  };

  const handleSubmit = async () => {
    if (inputWord.length !== 5) {
      toast.error("Word must be 5 letters long");
      return;
    }

    try {
      const response = await axiosInstance.post('/wordle/guess', {
        game_id: gameId,
        word: inputWord
      });
      const game = response.data;

      setBoardProp({
        rows: game.guesses.map(({ word, evaluation }) => ({
          letters: word.split(""),
          evaluation
        })),
        solution: game.solution
      });

      if (game.message.includes('won')) {
        toast.success(game.message);
        setTimeout(() => newGame(), 2000);
      } else if (game.message.includes('over')) {
        toast.error(game.message);
        setTimeout(() => newGame(), 2000);
      } else {
        toast(game.message);
      }
    } catch (error) {
      console.error("Failed to submit guess", error);
      toast.error("Failed to submit guess");
    }

    setInputWord("");
  };

  return (
    <div className={`flex min-h-screen w-full flex-col bg-gray-100`}>
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
        <div className="w-full max-w-lg px-4 py-6">
          <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b">Word</th>
                <th className="py-2 px-4 border-b">Guesses</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map(([word, guesses], index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{word}</td>
                  <td className="py-2 px-4 border-b">{guesses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
