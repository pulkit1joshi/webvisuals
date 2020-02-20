var balls = [];
var total = 50;
var paddle;
var score = 0;
var lives = 1000;
var state = 1;
var song;
var catchs;
var levelup;
var alert;
var speed = 5;
var hard = 20;
var ggravity = 0.03;
var widthadd = 0;

var version = 4;

function preload() {
  song = loadSound("https://raw.githubusercontent.com/tobehonest/webvisuals/master/sounds/backmusic.mp3");
  catchs = loadSound("https://raw.githubusercontent.com/tobehonest/webvisuals/master/sounds/catch.mp3");
  levelup = loadSound("https://raw.githubusercontent.com/tobehonest/webvisuals/master/sounds/NextLevel.mp3");
  alert = loadSound("https://raw.githubusercontent.com/tobehonest/webvisuals/master/sounds/Alert.mp3");
}

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  //song.play();
  song.loop();

}

function draw() {
  background(0);

  if (state == 0) {
    drawintro();
  }
  else if (state == 1) {
    drawplaying();
  }
  else if (state == 2) {
    drawend();
  }
  else if (state == 3) {
    drawwin();
  }

}




function drawwin() {
  textAlign(CENTER, CENTER);
  noStroke();
  textSize(30);
  text("You won this easy game", 0, 0, width, height);
  textSize(10);
  text("Click to play again(V:" + version + ") @by pulkit", 0, height / 3, width, height);
}

function drawintro() {
  fill(255);

  textAlign(CENTER, CENTER);
  noStroke();
  textSize(30);
  text("CLICK TO PLAY", 0, 0, width, height);
  textSize(10);
  text("While we are building (V:" + version + ") @by pulkit", 0, height / 3, width, height);


}

function drawplaying() {
  for (var i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].render();
  }
  paddle.think();
  paddle.update();
  paddle.render();
  if (lives == 0) {
    alert.stop();
    song.loop();
    gameOver();
  }
  textSize(20);
  textAlign(LEFT);
  text("Lives: " + lives, 10, 40);
  text("Score: " + score, 10, 20);
  text("Level: " + (hard - 20) / 5, 10, 60);
  text("Probability: " + paddle.prob, 10, 80);
}

function drawend() {

  textAlign(CENTER, CENTER);
  textSize(30);
  text("Looser you lost!", 0, 0, width, height);
  textSize(20);
  text("Play again to prove your worth", 0, 40, width, height);
}

function gameOver() {
  state = 2;
}

function startgame() {
  state = 1;
  lives = 1000;
  score = 0;
  paddle = new Paddle();
  for (var i = 0; i < total; i++) {
    balls[i] = new Ball(paddle);
  }
  textFont("Helvetica");

}



function mousePressed() {
  if (state == 0 || state == 2 || state == 3) {
    score = 0;
    lives = 3;
    state = 0;
    speed = 5;
    hard = 20;
    ggravity = 0.03;
    widthadd = 0;

    startgame();

  }
}
/*function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    paddle.moveleft();
  }
  else if (keyCode == RIGHT_ARROW) {
    paddle.moveright();
  }
}*/



function Ball(paddle) {
  this.paddle = paddle;
  this.size = 10;
  this.used = 0;
  this.gravity = ggravity;
  this.bad = (random(0, 100) < hard);
  this.init = function () {
    this.bad = (random(0, 100) < hard);
    this.x = random(20, width - 20);
    this.y = random(-height, -20);
    this.speed = 5;
    this.gravity = ggravity;
    this.used = 0;
  }


  this.render = function () {
    noStroke();
    if (this.bad) {
      fill(255, 0, 0);
    }
    else {

      fill(255);
    }
    ellipse(this.x, this.y, this.size, this.size);
  }

  this.update = function () {
    this.y += this.speed;
    this.speed += this.gravity;
    this.testPaddle();
    if (this.y + this.size > height + 20 || this.y + this.size < -40) {
      this.init();
    }
  }
  this.testPaddle = function () {
    var top = this.y + this.size / 2 > this.paddle.y;
    var bottom = this.y - this.size / 2 < this.paddle.y + this.paddle.height;
    var left = this.x + this.size / 2 > this.paddle.x;
    var right = this.x + this.size / 2 < this.paddle.x + this.paddle.width;
    if (top && bottom && left && right) {
      if (this.used == 0) {
        this.speed = this.speed * -1 + 5;
      }

      if (this.bad && this.used == 0) {
        this.paddle.hit();
        this.used = 1;
      }
      else if (this.used == 0) {

        this.paddle.score();
        this.used = 1;

      }


    }
  }
  this.init();
}

function Paddle() {
  this.prob=0;
  this.width = 80;
  this.speed = 30;
  this.height = 30;
  this.color = color(255);
  this.x = width / 2 - this.width / 2;
  this.y = height - 30;
  this.brain = new NeuralNetwork(total*2+3,4,1);
  this.update = function () {
  }

  this.render = function () {

    fill(this.color); rect(this.x, this.y, this.width, this.height);
    this.color = color(255);

  }

  this.score = function () {
    catchs.play();
    this.color = color(0, 255, 0);
    score += 1;
    this.width += 100 / hard;
    if (score > 20) {
      score = 0;
      hard += 5;
      total += 20;
      lives = 3;
      alert.stop();
      if (!song.isPlaying()) song.loop();
      levelup.play();
      widthadd += 10;
      ggravity += 0.05;
      this.width = 50 + widthadd;
      if (hard > 50) {
        state = 3;
      }
    }
  }

  this.hit = function () {
    this.color = color(255, 0, 0);
    lives--;
    this.width -= 15;
    if (lives == 1) {
      song.stop();
      alert.loop();
    }
  }

  this.moveright = function () {
    this.x += this.speed;
    if (this.x + this.width > width) {
      this.x = width - this.width;
    }
  }
  this.moveleft = function () {
    this.x -= this.speed;
    if (this.x < 0) {
      this.x = 0;
    }
  }
  this.think = function() {
    let inputs = [];
    inputs[0] = this.x;
    inputs[1] = this.y;
    inputs[2] =this.width;
    for(var i=0;i<total;i++)
    {
      inputs[i+3] = balls[i].x;
    }
    for(var i=0;i<total;i++)
    {
      inputs[total+i+3] = balls[i].y;
    }
    let output = this.brain.predict(inputs);
    if(output > 0.3) {
      this.moveleft();
    }
    else if(output <= 0.2) this.moveright();
    this.prob=output;
  }
}
