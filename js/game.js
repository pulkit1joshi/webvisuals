const totalpaddles=10;
var balls = [];
var total = 50;
var paddles = [];
var score = 0;
var lives = totalpaddles;
var state = 0;
var song;
var catchs;
var levelup;
var alert;
var speed = 20;
var hard = 20;
var ggravity = 0.08;
var widthadd = 0;
let savedpaddles= [];
var version = 5;
var generation=1;
let slider;
var generationfitness=0;
let hardslider;
let ballsslider;
let speedup=1;

function preload() {
  song = loadSound("https://raw.githubusercontent.com/tobehonest/webvisuals/master/sounds/backmusic.mp3");
  catchs = loadSound("https://raw.githubusercontent.com/tobehonest/webvisuals/master/sounds/catch.mp3");
  levelup = loadSound("https://raw.githubusercontent.com/tobehonest/webvisuals/master/sounds/NextLevel.mp3");
  alert = loadSound("https://raw.githubusercontent.com/tobehonest/webvisuals/master/sounds/Alert.mp3");
}

function setup() {

  createCanvas(windowWidth - 20, windowHeight - 20);

    slider = createSlider(1,500,5);
  hardslider = createSlider(1,100,hard);
  //ballsslider = createSlider(40,1000,50);
  //song.play();
  if (!song.isPlaying()) song.loop();
  for(let i=0;i<totalpaddles;i++)
    {
      paddles[i] = new Paddle();
    }

}

function draw() {
  background(0);
  speedup=slider.value();
  hard = hardslider.value();
 // total= ballsslider.value();
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
    for(let paddle of paddles)
    {
      if(paddle.lives > 0)
      {
      paddle.think();
      paddle.update();
      paddle.render();
      }
    }
  if (lives == 0) {
    //alert.stop();
    if (!song.isPlaying()) song.loop();
    lives=totalpaddles;
    generation+=1;
    if(generation%10==0) hard++;
    if(hard>40) hard=40;
    let sum=0;
    for(let paddle of savedpaddles)
    {
      sum+=paddle.score;
    }
    if(sum > generationfitness)
    {
    generationfitness=sum;
  }
    nextGeneration();

    score=0;
    for(let i=0;i<total;i++)
    {
        balls[i].y = -70;
    }
  }
  textSize(20);
  textAlign(LEFT);
  text("Harshness: " + hard, 10, 100);
  text("Population: " + lives, 10, 40);
  text("Generation Score: " + score, 10, 20);
  //text("Level: " + (hard - 20) / 5, 10, 60);
  text("Generation: " + generation, 10, 60);
  text("Max-Score Fitness: " + generationfitness, 10, 80);
  //text("Probability: " + paddle.prob, 10, 80);
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
  lives = totalpaddles;
  score = 0;
  for (var i = 0; i < total; i++) {
    balls[i] = new Ball(paddles);
  }
  textFont("Helvetica");

}



function mousePressed() {
  if (state == 0 || state == 2 || state == 3) {
    score = 0;
    lives = 3;
    state = 0;
    speed = 10;
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



function Ball(paddles) {
  //this.paddle = paddle;
  this.size = 10;
  this.used = 0;
  this.gravity = ggravity;
  this.speed = speed*speedup;
  this.init = function () {
    this.bad = (random(0, 100) < hard);
    this.x = random(20, width - 20);
    if(this.bad)
    {
      var y = random(0,100);
      if(y>= 70)
      {
      this.x = random(0,50);
      var right = random(0,100);
      if(right >= 50)
      {
        this.x = random(width-this.width,width - 100);
      }
      }
    }
    this.y = random(-height, -20);
    this.gravity = ggravity;
    this.used = 0;
    this.speed = speed*speedup;
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
    if (this.y + this.size > height + 20 || this.y + this.size < -20) {
      this.init();
    }
  }
  this.testPaddle = function () {
    let yes=false;
    for(paddle of paddles)
    {
      if(paddle.lives > 0)
      {
    var top = this.y + this.size / 2 > paddle.y;
    var bottom = this.y - this.size / 2 < paddle.y + paddle.height;
    var left = this.x + this.size / 2 > paddle.x;
    var right = this.x + this.size / 2 < paddle.x + paddle.width;
    if (top && bottom && left && right) {
      if (this.used == 0) {
        //this.speed = this.speed * -1+ 5;
      }

      if (this.bad && this.used == 0) {
        paddle.lives-=1;
        if(paddle.lives==0)
        {
          savedpaddles.push(paddle);
          console.log(paddle);
        }
        paddle.hit();
        //this.used = 1;
        yes=true;
      }
      else if (this.used == 0) {
        paddle.scored();
        //this.used = 1;
        yes=true;
      }
    }
  }

    }
    if(yes==true) 
      {this.used=1;
    this.speed = this.speed*-1;
  }
  }
  this.init();
}

function Paddle(brain) {
  this.dist=0;
  this.score=0;
  this.fitness=0;
  this.lives=1;
  this.prob=0;
  this.width = 80;
  this.speed = 30*slider.value();
  this.height = 30;
  this.color = color(random(100,255));
  this.rcolor = this.color;
  this.x = width / 2 - this.width / 2;
  this.y = height - 30;
  if(brain)
  {
    this.brain = brain.copy();
  }
  else
  {
    this.brain = new NeuralNetwork(total*2+3,1,1);
  }
  this.update = function () {
  }

  this.render = function () {
    if(this.width > 120) 
      {
        this.width=80;
        this.score+=10;
      }
    if(this.lives > 0)
    {
          fill(this.rcolor); rect(this.x, this.y, this.width, this.height);
          this.rcolor=this.color;
    }
    else
    {
      this.width=1;
      this.x=-50;
      this.y=-50;
    }


  }

  this.mutate = function(rate)
  {
      this.brain.mutate(rate);
  }

  this.scored = function () {
    catchs.play();
    this.rcolor = color(0, 255, 0);
    this.score +=1;
    if(this.x != width - this.width && this.x != 0) score+=5;
    score++;
    this.width += 100 / hard;
 /*   if (score < -1) {
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
    }*/
  }

  this.hit = function () {
    this.rcolor = color(255, 0, 0);
    if(this.lives==0) lives--;
    this.width -= 15;
    if (lives == 1) {
      //song.stop();
      //alert.loop();
    }
  }

  this.moveright = function () {
    this.x += this.speed;
    this.dist+=this.speed;
    if (this.x + this.width > width) {
      this.x = width - this.width;
    }
  }
  this.moveleft = function () {
    this.x -= this.speed;
    this.dist+=this.speed;
    if (this.x < 0) {
      this.x = 0;
    }
  }
  this.think = function() {
    if(this.lives > 0)
    {
    let inputs = [];
    inputs[0] = this.x/width;
    inputs[1] = this.y/width;
    inputs[2] =this.width/width;
    for(var i=0;i<total;i++)
    {
      if(balls[i].bad)
      {
      inputs[i+3] = balls[i].x/width;
      }
      else
      {
        inputs[i+3] = 0;
      }
    }
    for(var i=0;i<total;i++)
    {
      //inputs[total+i+3] = balls[i].y/height;
      if(balls[i].bad)
      {
      inputs[i+total+3] = balls[i].x/width;
      }
      else
      {
        inputs[i+total+3] = 0;
      }
    }
    let output = this.brain.predict(inputs);
    if(output[0] > 0.5) {
      this.moveleft();
    }
    else if(output[0] <= 0.5) this.moveright();
    this.prob=output;
  }
  }
}
