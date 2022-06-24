class Game {
  constructor() {
    this.resetButton = createButton("");
    this.resetTitle = createElement("h2");

    this.leaderBoardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.playerMoving = false;

    this.leftKeyActive = false;
    this.blast = false;
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();
    car1 = createSprite(width/2 - 100, height - 100, 10, 30);
    car2 = createSprite(width/2 + 100, height - 100, 10, 30);
    car1.addImage("car1", car1Img);
    car1.addImage("blast", blastImg);
    car2.addImage("car2", car2Img);
    car2.addImage("blast", blastImg);
    car1.scale = 0.07;
    car2.scale = 0.07;
    cars = [car1, car2];

    //creating groups for fuel tanks, power coins, and obstacles
    fuels = new Group();
    powerCoins = new Group();
    obstacles = new Group();
    var obstaclesPosition = [
      {x: width/2 + 250, y: height - 400, image: obstacle1Img},
      {x: width/2 - 150, y: height - 800, image: obstacle2Img},
      {x: width/2 + 250, y: height - 1100, image: obstacle2Img},
      {x: width/2 - 180, y: height - 1600, image: obstacle1Img},
      {x: width/2, y: height - 2000, image: obstacle2Img},
      {x: width/2 - 180, y: height - 2400, image: obstacle1Img},
      {x: width/2 + 250, y: height - 2300, image: obstacle1Img},
      {x: width/2 - 150, y: height - 2800, image: obstacle2Img},
      {x: width/2 + 250, y: height - 3200, image: obstacle1Img},
      {x: width/2, y: height - 3500, image: obstacle2Img},
      {x: width/2 - 180, y: height - 3900, image: obstacle2Img},
      {x: width/2 + 180, y: height - 4200, image: obstacle1Img},
    ];

    //adding four fuel sprites to the game
    this.addSprites(fuels, 4, fuelImg, 0.022);
    this.addSprites(powerCoins, 25, powerCoinImg, 0.07);
    this.addSprites(obstacles, obstaclesPosition.length, obstacle1Img, 0.05, obstaclesPosition);
  }

  addSprites(spriteGroup, numberOfSprite, spriteImage, scale, positions = []) {
    for(var i = 0; i < numberOfSprite; i++) {
      var x, y;
      if(positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      }
      else {
        x = random(width/2 - 150, width/2 + 150);
        y = random(-height * 4.5, height - 300);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  getState() {
    var s = database.ref("gameState");
    s.on("value", function (data) {
      gameState = data.val();
    });
  }

  updateState(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  handleElements() {
    form.hide();
    form.titleImg.position(20, 50);
    form.titleImg.class("gametitleafter");
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2 + 150, 40);
    
    this.resetButton.class("resetButton");
    this.resetButton.position(width/2 + 190, 100);

    this.leaderBoardTitle.html("Leaderboard");
    this.leaderBoardTitle.class("resetText");
    this.leaderBoardTitle.position(width/3 - 60, 40);

    this.leader1.class("leaderText");
    this.leader1.position(width/3 - 50, 80);

    this.leader2.class("leaderText");
    this.leader2.position(width/3 - 50, 130);
  }

  showLeaderBoard() {
    var leader1;
    var leader2;
    var players = Object.values(allPlayers);
    if((players[0].rank == 0 && players[1].rank == 0) || players[0].rank == 1) {
      //&emsp; this tag is used to display 4 consecutive spaces
      leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
      leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    }
    if(players[1].rank == 1) {
      leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
      leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if(!this.blast) {    
      if(keyIsDown(UP_ARROW)) {
        this.playerMoving = true;
        player.positionY = player.positionY + 10;
        player.update();
      }
      if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2 + 280) {
        this.leftKeyActive = false;
        player.positionX = player.positionX + 5;
        player.update();
      }
      if(keyIsDown(LEFT_ARROW) && player.positionX > width/3 - 60) {
        this.LeftKeyActive = true;
        player.positionX = player.positionX - 5;
        player.update();
      }
    }
  }

  handleFuel(index) {
    //adding fuel back to the car when it touches a fuel tank
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      //collected is that specific sprite in the group collectables that has triggered the event
      collected.remove();
    });
    //reducing player fuel
    if(player.fuel > 0 && this.playerMoving) {
      player.fuel = player.fuel - 0.4;
    }
    if(player.fuel <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function(collector, collected) {
      player.score = player.score + 10;
      player.update();
      collected.remove();
    });
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        carsAtEnd: 0,
        players: {}
      });
      window.location.reload();
    });
  }

  handleObstacleCollision(index) {
    if(cars[index - 1].collide(obstacles)) {
      if(this.leftKeyActive) {
        player.positionX = player.positionX + 100;
      }
      else {
        player.positionX = player.positionX - 100;
      }
      if(player.life > 0) {
        player.life = player.life - (185/4);
      }
      player.update();
    }
  }

  handleCarCollision(index) {
    if(index == 1) {
      if(cars[index - 1].collide(cars[1])) {
        if(this.leftKeyActive) {
          player.positionX = player.positionX + 100;
        }
        else {
          player.positionX = player.positionX - 100;
        }
        //reducing player life
        if(player.life > 0) {
          player.life = player.life - (185/4);
        }
        player.update();
      }
    }
    if(index == 2) {
      if(cars[index - 1].collide(cars[0])) {
        if(this.leftKeyActive) {
          player.positionX = player.positionX + 100;
        }
        else {
          player.positionX = player.positionX - 100;
        }
        //reducing player life
        if(player.life > 0) {
          player.life = player.life - (185/4);
        }
        player.update();
        }
    }
  }

  gameOver() {
    swal({
      title: `Game Over!!`,
      text: "Opps, you ran out of fuel",
      imageUrl:
        "http://images.huffingtonpost.com/2016-03-15-1458017882-3614409-EmptyTank.png",
      imageSize: "200x200",
      confirmButtonText: "Thanks for playing"
    });
  }

  showRank() {
    swal({
        title: `Awesome!!!${"\n"}Rank${"\n"}${player.rank}`,
        text: "You Reached The Finish Line!!",
        imageUrl:
          "https://clipartstation.com/wp-content/uploads/2018/10/trophy-cup-clipart-5.jpg",
        imageSize: "200x200",
        confirmButtonText: "Okay"
      },
    );
  }

  showLife() {
    push();
    image(lifeImg, width/2 + 520, height - player.positionY - 300, 40, 40);
    fill("white")
    rect(width/2 + 560, height - player.positionY - 290, 185, 20);
    fill("red");
    rect(width/2 + 560, height - player.positionY - 290, player.life, 20);
    noStroke();
    pop();
  }

  showFuel() {
    push();
    image(fuelImg, width/2 + 515, height - player.positionY - 350, 40, 40);
    fill("white");
    rect(width/2 + 560, height - player.positionY - 340, 185, 20);
    fill("yellow");
    rect(width/2 + 560, height - player.positionY - 340, player.fuel, 20);
    noStroke();
    pop();
  }

  play() {
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    player.getCarsAtEnd();
    if(allPlayers !== undefined) {
      image(trackImg, 0, -height * 5, width, height * 6);
      this.showLife();
      this.showFuel();
      this.showLeaderBoard();
      var index = 0;
      for(var i in allPlayers) {
        index = index + 1;
        var x = allPlayers[i].positionX;
        var y = height - allPlayers[i].positionY;

        //saving the value of player.life in a temporary variable
        var currentLife = allPlayers[i].life;
        if(currentLife <= 0) {
          cars[index - 1].changeImage("blast");
          cars[index - 1].scale = 0.4;
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if(index == player.index) {
          fill("blue");
          stroke("black");
          ellipse(x, y, 70, 70);
          textSize(30);
          textAlign(CENTER);
          text(allPlayers[i].name, x, y - 50);
          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handleCarCollision(index);
          this.handleObstacleCollision(index);

          if(player.life <= 0) {
            this.blast = true;
            this.playerMoving = false;
          }

          //changing camera position for the active car
          //camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
      }
      //remove this later .............................................................................................
      if(this.playerMoving) {
        player.positionY = player.positionY + 5;
        player.update();
      }
      this.handlePlayerControls();
      const finishLine = height * 6 - 100;
      if(player.positionY > finishLine) {
        gameState = 2;
        player.rank = player.rank + 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }
      drawSprites();
    }
  }

  end() {
    console.log("game over");
  }
}
