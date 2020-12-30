document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  //Current Grid width in tiles
  let width = 10;
  let tiles = [];
  let bombCount = 15;
  let isGameOver = false;

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
      //create tile div
      const tile = document.createElement('div');
      //apply individual id to the tile
      tile.setAttribute('id', i);
      //applies bomb class based on the shuffled array
      tile.classList.add(shuffledArray[i]);
      //places tile div into grid when created
      grid.appendChild(tile);
      //adds the create tile into the tiles array
      tiles.push(tile);

      //regular click
      tile.addEventListener('click', (e) => {
        click(tile);
      });
    }

    //add numbers to tiles
    for (let i = 0; i < tiles.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (tiles[i].classList.contains('safe')) {
        if (i > 0 && !isLeftEdge && tiles[i - 1].classList.contains('bomb'))
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          tiles[i + 1 - width].classList.contains('bomb')
        )
          total++;
        if (i > 10 && tiles[i - width].classList.contains('bomb')) total++;
        if (
          i > 11 &&
          !isLeftEdge &&
          tiles[i - 1 - width].classList.contains('bomb')
        )
          total++;
        if (i < 98 && !isRightEdge && tiles[i + 1].classList.contains('bomb'))
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          tiles[i - 1 + width].classList.contains('bomb')
        )
          total++;
        if (
          i < 88 &&
          !isRightEdge &&
          tiles[i + 1 + width].classList.contains('bomb')
        )
          total++;
        if (i < 89 && tiles[i + width].classList.contains('bomb')) total++;
        tiles[i].setAttribute('data', total);
      }
    }
  }
  createBoard();

  function click(tile) {
    let currentId = tile.id;
    if (isGameOver) return;
    if (tile.classList.contains('checked') || tile.classList.contains('flag'))
      return;
    if (tile.classList.contains('bomb')) {
      isGameOver = true;
    } else {
      let total = tile.getAttribute('data');
      if (total != 0) {
        tile.classList.add('checked');
        tile.innerHTML = total;
        return;
      }
      checkTile(tile, currentId);
    }
    tile.classList.add('checked');
  }

  //on tile click check neighbour tiles
  function checkTile(tile, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = tiles[parseInt(currentId) - 1].id;
        const newTile = document.getElementById(newId);
        click(newTile);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = tiles[parseInt(currentId) + 1 - width].id;
        const newTile = document.getElementById(newId);
        click(newTile);
      }
      if (currentId > 10) {
        const newId = tiles[parseInt(currentId) - width].id;
        const newTile = document.getElementById(newId);
        click(newTile);
      }
      if (currentId > 10 && !isLeftEdge) {
        const newId = tiles[parseInt(currentId) - 1 - width].id;
        const newTile = document.getElementById(newId);
        click(newTile);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = tiles[parseInt(currentId) + 1].id;
        const newTile = document.getElementById(newId);
        click(newTile);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = tiles[parseInt(currentId) - 1 + width].id;
        const newTile = document.getElementById(newId);
        click(newTile);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = tiles[parseInt(currentId) + 1 + width].id;
        const newTile = document.getElementById(newId);
        click(newTile);
      }
      if (currentId < 80 && !isRightEdge) {
        const newId = tiles[parseInt(currentId) + width].id;
        const newTile = document.getElementById(newId);
        click(newTile);
      }
    }, 1000);
  }

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
