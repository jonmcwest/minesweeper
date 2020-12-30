document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  //Current Grid width in squares
  let width = 10;
  let squares = [];
  let bombCount = 15;

  //Create the play board
  function createBoard() {
    //creates array with random bombs
    const bombsArray = Array(bombCount).fill('bomb');
    //creates array with remaining safe spaces
    const emptyArray = Array(width * width - bombCount).fill('safe');
    //combines safe and bomb array
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = fisherShuffle(gameArray);
    console.log(shuffledArray);

    for (let i = 0; i < width * width; i++) {
      //create square div
      const square = document.createElement('div');
      //apply individual id to the square
      square.setAttribute('id', i);
      //places square div into grid when created
      grid.appendChild(square);
      //adds the create square into the squares array
      squares.push(square);
    }
  }
  createBoard();

  //Fisher Yates Shuffle Method
  function fisherShuffle(array) {
    var copy = [],
      n = array.length,
      i;

    // While there remain elements to shuffle…
    while (n) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * array.length);

      // If not already shuffled, move it to the new array.
      if (i in array) {
        copy.push(array[i]);
        delete array[i];
        n--;
      }
    }

    return copy;
  }
});
