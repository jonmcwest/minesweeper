//TODO
//random music
//score screen after
//timer DONE
//remaining flags DONE
//pause between difficulty and init
//red tint on explosion
//export scripts into bitesize modules and integrate OOP
//resize grid for mobile

//Global scope declarations

///Menu screen declarations
const loadScreen = document.getElementById('loadScreen');
const loadWheel = document.getElementById('loading');
const connect = document.getElementById('connect');

const menuScreen = document.getElementById('menuScreen');
const easyDiff = document.getElementById('easy');
const mediumDiff = document.getElementById('medium');
const hardDiff = document.getElementById('hard');
const highScore = document.getElementById('highScore');

///UI Declarations
const gameOverTitle = document.getElementById('gameOverTitle');
const gameOverImage = document.getElementById('gameOverImage');
const flagsRemaining = document.getElementById('flagsRemaining');
const timer = document.getElementById('timer');

///Audio Declarations
const music = new Audio('./music.mp3');
music.volume = 0.1;
music.currentTime = 5;
const heartBeat = new Audio('./heartbeat.mp3');
heartBeat.volume = 0.4;
const explosionSFX = new Audio('./explosion.mp3');
explosionSFX.volume = 0.3;
const flagSFX = new Audio('./flag.wav', { loop: 'true' });
explosionSFX.volume = 0.4;
const winSFX = new Audio('./win.wav');
const loseSFX = new Audio('./lose.wav');
loseSFX.volume = 0.2;
const gameOverVox = new Audio('./gameovervox.wav');
const tileClose = new Audio('./tileclose.wav');
tileClose.volume = 1;
const ambientMusic = new Audio('./ambient.mp3');
ambientMusic.loop = true;

//Functionality Declarations
const grid = document.querySelector('.grid');
let isGameOver = false;

///Score Declarations
let totalSecs = 0;
const topScore = 99999;
const easyScore = 1253;
const mediumScore = 727;
const hardScore = 256;
let gameScore = 0;

function startTimer() {
  let secs = totalSecs;
  let mins = totalSecs / 60;

  setInterval(() => {
    if (!isGameOver) {
      if (secs < 59) {
        secs++;
        totalSecs++;
        timer.innerHTML =
          `${mins < 10 ? '0' + mins : mins}:` +
          `${secs < 10 ? '0' + secs : secs}`;
      } else {
        secs = 0;
        totalSecs++;
        mins++;
        timer.innerHTML =
          `${mins < 10 ? '0' + mins : mins}:` +
          `${secs < 10 ? '0' + secs : secs}`;
      }
    }
  }, 1000);
}

connect.addEventListener('click', () => {
  loadScreen.style.display = 'none';
  ambientMusic.play();
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    loading.style.display = 'none';
    connect.style.display = 'block';
    connect.style.opacity = 1;
  }, 10);

  easyDiff.addEventListener('click', () => {
    initGame(10);
  });
  mediumDiff.addEventListener('click', () => {
    initGame(20);
  });
  hardDiff.addEventListener('click', () => {
    initGame(30);
  });

  function initGame(bombs) {
    music.play();
    ambientMusic.pause();
    menuScreen.style.display = 'none';
    gameOverTitle.style.display = 'none';
    gameOverTitle.style.opacity = 0;
    let flagCount = bombs;
    flagsRemaining.innerHTML = `${flagCount}`;
    gameScore = 0;
    grid.innerHTML = '';

    startTimer();

    //Current Grid width in tiles
    let width = 10;
    let tiles = [];
    let bombCount = bombs;
    let flags = 0;

    particlesJS.load('particle-div', 'particle-cfg.json');

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
          heartBeat.pause();
          heartBeat.currentTime = 0;
        });

        tile.addEventListener('mouseenter', (e) => {
          if (
            !tile.classList.contains('flag') &&
            !tile.classList.contains('checked') &&
            !isGameOver
          ) {
            heartBeat.play();
          }
        });

        tile.addEventListener('mouseleave', (e) => {
          heartBeat.pause();
          heartBeat.currentTime = 0;
        });

        tile.oncontextmenu = function (e) {
          e.preventDefault();
          addFlag(tile);
          heartBeat.pause();
          heartBeat.currentTime = 0;
        };
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
          if (i < 90 && tiles[i + width].classList.contains('bomb')) total++;
          tiles[i].setAttribute('data', total);
        }
      }
    }
    createBoard();

    //adds a flag on a right click
    function addFlag(tile) {
      if (isGameOver) return;
      if (!tile.classList.contains('checked') && flags < bombCount) {
        if (!tile.classList.contains('flag')) {
          tile.classList.add('flag');
          tile.innerHTML = '<span class="flag-block"><span>';
          flags++;
          flagCount--;
          flagsRemaining.innerHTML = flagCount;
          flagSFX.play();
          checkWin();
        } else {
          tile.classList.remove('flag');
          tile.innerHTML = '';
          flags--;
          flagCount++;
          flagsRemaining.innerHTML = flagCount;
        }
      }
    }

    function click(tile) {
      let currentId = tile.id;
      if (isGameOver) return;
      if (tile.classList.contains('checked') || tile.classList.contains('flag'))
        return;
      if (tile.classList.contains('bomb')) {
        gameOver(tile, 'lose');
      } else {
        let total = tile.getAttribute('data');
        if (total != 0) {
          tile.classList.add('checked');
          tile.innerHTML = total;
          tile.style.opacity = 1;
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
        tileClose.play();
        if (currentId > 0 && !isLeftEdge) {
          const newId = tiles[parseInt(currentId) - 1].id;
          //const newId = parseInt(currentId) - 1   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 9 && !isRightEdge) {
          const newId = tiles[parseInt(currentId) + 1 - width].id;
          //const newId = parseInt(currentId) +1 -width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 10) {
          const newId = tiles[parseInt(currentId - width)].id;
          //const newId = parseInt(currentId) -width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 11 && !isLeftEdge) {
          const newId = tiles[parseInt(currentId) - 1 - width].id;
          //const newId = parseInt(currentId) -1 -width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 98 && !isRightEdge) {
          const newId = tiles[parseInt(currentId) + 1].id;
          //const newId = parseInt(currentId) +1   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 90 && !isLeftEdge) {
          const newId = tiles[parseInt(currentId) - 1 + width].id;
          //const newId = parseInt(currentId) -1 +width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 88 && !isRightEdge) {
          const newId = tiles[parseInt(currentId) + 1 + width].id;
          //const newId = parseInt(currentId) +1 +width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 90) {
          const newId = tiles[parseInt(currentId) + width].id;
          //const newId = parseInt(currentId) +width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 0 && !isLeftEdge) {
          const newId = tiles[parseInt(currentId) - 1].id;
          //const newId = parseInt(currentId) - 1   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 9 && !isRightEdge) {
          const newId = tiles[parseInt(currentId) + 1 - width].id;
          //const newId = parseInt(currentId) +1 -width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 10) {
          const newId = tiles[parseInt(currentId - width)].id;
          //const newId = parseInt(currentId) -width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 11 && !isLeftEdge) {
          const newId = tiles[parseInt(currentId) - 1 - width].id;
          //const newId = parseInt(currentId) -1 -width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 98 && !isRightEdge) {
          const newId = tiles[parseInt(currentId) + 1].id;
          //const newId = parseInt(currentId) +1   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 90 && !isLeftEdge) {
          const newId = tiles[parseInt(currentId) - 1 + width].id;
          //const newId = parseInt(currentId) -1 +width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 88 && !isRightEdge) {
          const newId = tiles[parseInt(currentId) + 1 + width].id;
          //const newId = parseInt(currentId) +1 +width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 89) {
          const newId = tiles[parseInt(currentId) + width].id;
          //const newId = parseInt(currentId) +width   ....refactor
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
      }, 250);
    }

    function gameOver(tile, result) {
      gameOverTitle.style.display = 'block';

      if (result === 'win') {
        if (bombCount === 10) {
          gameScore = topScore - totalSecs * easyScore;
        } else if (bombCount === 20) {
          gameScore = topScore - totalSecs * mediumScore;
        } else {
          gameScore = topScore - totalSecs * highScore;
        }
        highScore.innerHTML = gameScore;

        gameOverImage.src = '/img/win.png';
        winSFX.play();
        music.pause();
        setTimeout(() => {
          gameOverTitle.style.opacity = 1;
          setTimeout(() => {
            ambientMusic.play();
            menuScreen.style.display = 'flex';
          }, 5000);
        }, 1000);
      }

      if (result === 'lose') {
        setTimeout(() => {
          gameOverTitle.style.opacity = 1;
          gameOverVox.play();
          setTimeout(() => {
            ambientMusic.play();
            menuScreen.style.display = 'flex';
          }, 5000);
        }, 4000);
        gameOverImage.src = '/img/lose.png';
        tile.classList.add('exploded');
        explosionSFX.play();
        loseSFX.play();
        music.pause();
        //Shows every hidden bomb
        tiles.forEach((tile, i) => {
          setTimeout(() => {
            if (
              tile.classList.contains('bomb') &&
              !tile.classList.contains('exploded')
            ) {
              tile.classList.add('exploded');
              explosionSFX.pause();
              explosionSFX.currentTime = 0;
              explosionSFX.play();
            }
          }, i * 40);
        });
      }

      isGameOver = true;
    }

    function checkWin() {
      let matches = 0;

      for (let i = 0; i < tiles.length; i++) {
        if (
          tiles[i].classList.contains('flag') &&
          tiles[i].classList.contains('bomb')
        ) {
          matches++;
        }
        if (matches === bombCount) {
          gameOver('', 'win');
        }
      }
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
  }
});
