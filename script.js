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

    for (let i = 0; i < width * width; i++) {
      //create square div
      const square = document.createElement('div');
      //apply individual id to the square
      square.setAttribute('id', i);
      //applies bomb class based on the shuffled array
      square.classList.add(shuffledArray[i]);
      //places square div into grid when created
      grid.appendChild(square);
      //adds the create square into the squares array
      squares.push(square);
    }

    //add numbers to squares
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains('safe')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb'))
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains('bomb')
        )
          total++;
        if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
        if (
          i > 11 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains('bomb')
        )
          total++;
        if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb'))
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains('bomb')
        )
          total++;
        if (
          i < 88 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains('bomb')
        )
          total++;
        if (i < 89 && squares[i + width].classList.contains('bomb')) total++;
        squares[i].setAttribute('data', total);
        if (total > 0) {
          squares[i].innerText = `${total}`;
        }
      }

      console.log(squares[i]);
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
