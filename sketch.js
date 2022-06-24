var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var allPlayers;
var gameState = 0;
var cars = [];
var car1;
var car2;
var car1Img;
var car2Img;
var fuels;
var powerCoins;
var obstacles;
var fuelImg;
var powerCoinImg;
var obstacle1Img;
var obstacle2Img;
var lifeImg;
var blastImg;

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1Img = loadImage("./assets/car1.png");
  car2Img = loadImage("./assets/car2.png");
  trackImg = loadImage("./assets/track.jpg");
  fuelImg = loadImage("./assets/fuel.png");
  powerCoinImg = loadImage("./assets/goldCoin.png");
  obstacle1Img = loadImage("./assets/obstacle1.png");
  obstacle2Img = loadImage("./assets/obstacle2.png");
  lifeImg = loadImage("./assets/th-removebg-preview.png");
  blastImg = loadImage("./assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);

  if(playerCount == 2) {
    game.updateState(1);
  }

  if(gameState == 1) {
    game.play();
  }

  if(gameState == 2) {
    game.showLeaderBoard();
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
