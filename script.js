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
    const emptyArray = Array(width * width - bombCount).fill('safe');

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
});
