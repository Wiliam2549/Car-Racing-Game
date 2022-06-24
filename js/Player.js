class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.rank = 0;
    this.score = 0;
    this.fuel = 185;
    this.life = 185;
  }

  getCount() {
    var c = database.ref("playerCount");
    c.on("value", function(data) {
      playerCount = data.val();
    });
  }

  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    });
  }

  getCarsAtEnd() {
    var c = database.ref("carsAtEnd");
    c.on("value", data => {
      this.rank = data.val();
    });
  }

  static updateCarsAtEnd(rank) {
    database.ref("/").update({
      carsAtEnd: rank
    });
  }

  addPlayer() {
    var playerIndex = "players/player" + this.index;
    if(this.index == 1) {
      this.positionX = width/2 - 100;
    }

    else {
      this.positionX = width/2 + 100;
    }
    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      life: this.life
    });
  }

  update() {
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      life: this.life
    })
  }

  getDistance() {
    var distance = database.ref("players/player" + this.index);
    distance.on("value", data => {
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    });
  }

  static getPlayersInfo() {
    var d = database.ref("players");
    d.on("value", data => {
      allPlayers = data.val();
    });
  }
}
