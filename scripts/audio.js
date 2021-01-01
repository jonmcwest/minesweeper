//Game Songs
const song1 = new Audio('./music.mp3');
song1.volume = 0.1;
song1.currentTime = 5;

const heartBeat = new Audio('./heartbeat.mp3');
heartBeat.volume = 0.4;

const explosionSFX = new Audio('./explosion.mp3');
explosionSFX.volume = 0.3;

const flagSFX = new Audio('./flag.wav', { loop: 'true' });

const winSFX = new Audio('./win.wav');

const loseSFX = new Audio('./lose.wav');
loseSFX.volume = 0.2;

const gameOverVox = new Audio('./gameovervox.wav');

const tileClose = new Audio('./tileclose.wav');
tileClose.volume = 1;

const ambientMusic = new Audio('./ambient.mp3');
ambientMusic.loop = true;

const audio = {
  themeMusic: [song1, song1, song1],
  SFX: {
    heartBeat: heartBeat,
    explosionSFX: explosionSFX,
    flagSFX: flagSFX,
    winSFX: winSFX,
    loseSFX: loseSFX,
    gameOverVox: gameOverVox,
    tileCloseSFX: tileClose,
    ambientMusic: ambientMusic,
  },
};

module.exports = audio;
