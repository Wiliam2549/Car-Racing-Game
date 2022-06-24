class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Enter your name");
    this.playButton = createButton("Play");
    this.titleImg = createImg("./assets/title.png", "game title");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  setElementPosition() {
    this.input.position(width/2 - 90, height/2 - 80);
    this.playButton.position(width/2 - 70, height/2);
    this.titleImg.position(170, 170);
    this.greeting.position(width/2 - 300, height/2 - 50);
  }

  setElementsStyle() {
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.titleImg.class("gameTitle");
    this.greeting.class("greeting");
  }

  handleMousePressed() {
    this.playButton.mousePressed(() =>{
      this.playButton.hide();
      this.input.hide();
      var message = `Hello ${this.input.value()}
      </br> wait for another player to join...`
      this.greeting.html(message);
      playerCount = playerCount + 1;
      player.index = playerCount;
      player.name = this.input.value();
      player.addPlayer();
      player.updateCount(playerCount);
      player.getDistance();
    });
  }

  display() {
    this.setElementPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }

}
