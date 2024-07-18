'use client';
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import Image from 'next/image';
import axiosInstance from "../axiosinstance";

export default function Home() {
  const [inputWord, setInputWord] = useState("");
  const [gameId, setGameId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameStateArray, setGameStateArray] = useState([]);
  const [numIncorrectGuesses, setNumIncorrectGuesses] = useState(0);

  const newGame = async () => {
    try {
      const response = await axiosInstance.get('/hangman/newgame');
      const { game_id, word_length } = response.data;
      setGameId(game_id);
      setGameStateArray(Array(word_length).fill(""));
      setNumIncorrectGuesses(0);
      fetchLeaderboard();
      toast.success("New game started!");
    } catch (error) {
      console.error("Failed to start a new game", error);
      toast.error("Failed to start a new game");
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axiosInstance.get('/hangman/leaderboard');
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
    if (inputWord.length !== 1) {
      toast.error("Can only submit one letter at a time");
      return;
    }

    try {
      const response = await axiosInstance.post('/hangman/guess', {
        game_id: gameId,
        letter: inputWord
      });
      const game = response.data;

      setGameStateArray(game.game);
      setNumIncorrectGuesses(game.num_incorrect);

      if (game.message.includes('Incorrect')) {
        toast.error(game.message);
      } else if (game.message.includes('already')) {
        toast.error(game.message);
      }  else {
        toast.success(game.message);
      }

      if (game.finished) {
        setTimeout(() => newGame(), 2000);
      }
    } catch (error) {
      console.error("Failed to submit guess", error);
      toast.error("Failed to submit guess");
    }

    setInputWord("");
  };

  return (
    <div className={`flex w-full min-h-screen flex-col bg-gray-100`}>
      <header className="flex h-16 w-full items-center justify-center border-b-2 border-b-gray-500 text-black">
        <div className="absolute left-0 flex items-center justify-center pl-4">
          <a href="https://github.com/sam-harri/csi3140-project2">
            <FaGithub size={24} />
          </a>
        </div>
        <div className="text-4xl font-bold">Hangman Clone</div>
      </header>
      <main className="flex flex-col items-center justify-center h-full w-full space-y-8">
        <div className="flex justify-center w-full">
          <Image
            src={`/hangman${numIncorrectGuesses}.png`}
            alt="Hangman"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>

        <div className="flex items-center justify-center w-full space-x-2">
          {
            gameStateArray.map((letter, i) => (
              <div
                key={i}
                className={`border-b-8 flex h-[58px] w-[58px] items-center justify-center text-black text-[32px]`}
              >
                {letter || "_"}
              </div>
            ))
          }
        </div>

        <div className="flex items-center space-x-2 p-4">
          <input
            type="text"
            value={inputWord}
            onChange={handleInputChange}
            className="p-2 border border-gray-500 rounded text-black focus:outline-none"
            maxLength="1"
            disabled={gameStateArray.every(letter => letter !== "")}
          />
          <button
            onClick={handleSubmit}
            className="p-2 bg-gray-800 text-white rounded"
            disabled={gameStateArray.every(letter => letter !== "")}
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
                <th className="py-2 px-4 border-b">Incorrect Guesses</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map(([word, incorrectGuesses], index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{word}</td>
                  <td className="py-2 px-4 border-b">{incorrectGuesses}</td>
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
