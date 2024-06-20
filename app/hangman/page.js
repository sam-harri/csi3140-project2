'use client';
import { useEffect, useState } from "react";
import Head from "next/head";
import { FaGithub } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { generate } from "random-words";
import Image from 'next/image';

export default function Home() {
  const [inputWord, setInputWord] = useState("");
  const [solution, setSolution] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [word, setWord] = useState("");

  const newGame = () => {
    let word = generate({ minLength: 5, maxLength: 15 });
    setWord(word);
    setLoaded(true);
    toast.success("New game started!");
    console.log(word);
    setSolution(word.toUpperCase().split(""));
    setGuessedLetters([]);
    setIncorrectGuesses([]);
  };

  useEffect(() => {
    newGame();
  }, []);

  const handleInputChange = (e) => {
    setInputWord(e.target.value.toUpperCase());
  };

  const handleSubmit = () => {
    if (inputWord.length !== 1) {
      toast.error("Can Only Submit One Letter At A Time");
      return;
    }

    if (guessedLetters.includes(inputWord) || incorrectGuesses.includes(inputWord)) {
      toast.error("Letter already guessed");
      setInputWord("");
      return;
    }

    if (solution.includes(inputWord)) {
      setGuessedLetters([...guessedLetters, inputWord]);
      toast.success("Correct guess!");
    } else {
      setIncorrectGuesses([...incorrectGuesses, inputWord]);
      toast.error("Incorrect guess!");
    }

    setInputWord("");
  };

  useEffect(() => {
    let isWinner = solution.every(letter => guessedLetters.includes(letter));
    if (isWinner && loaded) {
      toast.success("Congratulations, you've won!");
      setTimeout(() => newGame(), 4000);
    }

    if (incorrectGuesses.length >= 6 && !isWinner) {
      toast.error(`The word was ${word}! Better luck next time!`);
      setTimeout(() => newGame(), 4000);
    }
  }, [guessedLetters, incorrectGuesses]);

  return (
    <div className={`flex h-screen w-full flex-col bg-gray-100`}>
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
            src={`/hangman${incorrectGuesses.length}.png`}
            alt="Hangman"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>

        <div className="flex items-center justify-center w-full space-x-2">
          {
            solution.map((letter, i) => (
              <div
                key={i}
                className={`border-b-8 flex h-[58px] w-[58px] items-center justify-center text-black text-[32px]`}
              >
                {guessedLetters.includes(letter) ? letter : ""}
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
