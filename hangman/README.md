# Hangman Game

A simple Hangman game built with HTML, CSS, and JavaScript. The game allows the user to guess letters to form a hidden word, with a visual representation of a hangman being drawn for each wrong guess. The game also includes a confetti effect when the user wins and a shaking effect for incorrect guesses.

## Features

- Guess letters to reveal the hidden word.
- Visual representation of a hangman that progresses with each wrong guess.
- Confetti effect when the user wins.
- Shaking effect for wrong guesses.
- Restart button to reset the game.

## Technologies Used

- HTML
- CSS
- JavaScript

## File Structure

- `images/`: Contains images for each stage of the hangman.
- `index.html`: The main HTML file.
- `styles.css`: The CSS file for styling.
- `script.js`: The JavaScript file containing the game logic.
- `README.md`: This README file.

## Game Instructions

1. Open the game in your web browser.
2. Guess a letter by clicking on the letter buttons.
3. Correct guesses will reveal the letter in the hidden word.
4. Wrong guesses will increment the hangman drawing and make the letter button shake.
5. You have up to 6 wrong guesses before the game is over.
6. If you guess the word correctly, a confetti effect will display, and a congratulatory message will appear.
7. Use the "Restart Game" button to reset the game at any time.

## Customization

### Changing the Word List

To change the list of words used in the game, update the `words` array in the `script.js` file:
```javascript
const words = ["javascript", "hangman", "coding", "developer", "programming"];
```