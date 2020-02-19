var balls = [];
var total = 20;
var paddle;
var score=0;
var lives=3;
var state=0;
var song;

function preload() {
 song = loadSound("https://github.com/tobehonest/webvisuals/blob/master/backmusic.mp3");
}

function setup() {
createCanvas(windowWidth, windowHeight);
  
 // song.play();
song.loop();
  
}

function draw() {
  background(0);
  
  if(state==0)
  {
    drawintro();
  }
  else if(state==1)
  {
    drawplaying();
  }
  else if(state==2)
  {
    drawend();
  }

}

function drawintro()
{
    fill(255);
  
  textAlign(CENTER,CENTER);
  noStroke();
    textSize(30);
  text("CLICK TO PLAY",0,0,width,height);
    textSize(10);
  text("While we are building",0,height/3,width,height);

     
}

function drawplaying(){
    for(var i=0;i<balls.length;i++)
  {
  balls[i].update();
  balls[i].render();
  }
  paddle.update();
  paddle.render();
  if(lives==0)
  {
    gameOver();
  }
  textSize(20);
  textAlign(LEFT);
  text("Lives: " + lives, 10,40);
  text("Score: " + score, 10, 20);
}

function drawend() {
  
  textAlign(CENTER,CENTER);
  textSize(30);
  text("Looser you lost!",0,0,width,height);
  textSize(20);
  text("Play again to prove your worth",0,40,width,height);
}

function gameOver()
{
  state=2;
}

function startgame()
{
  state=1;
  lives=3;
  score=0;
  paddle = new Paddle();
  for(var i=0;i<total;i++)
  {
  balls[i] = new Ball(paddle);
  }
  textFont("Helvetica");

}
  


function mousePressed() {
  if(state==0 || state==2)
  {
     startgame();
  }
}
function keyPressed() {
  if(keyCode == LEFT_ARROW) {
    paddle.moveleft();
  }
  else if(keyCode == RIGHT_ARROW)
  {
    paddle.moveright();
  }
}



function Ball(paddle) {
  this.paddle = paddle;
  this.size = 10;
  this.speed = 5;
  this.bad = (random(0,100) < 20);
  this.init = function() {
  this.x = random(20,width-20);
  this.y = random(-height,-20);
  }


  this.render = function () {
        noStroke();
    if(this.bad) {
      fill(255,0,0);
    }
    else
    {

    fill(255); 
    }
    ellipse(this.x,this.y,this.size,this.size);
  }
  
  this.update = function()
  {
    this.y += this.speed;
    this.testPaddle();
    if(this.y + this.size > height+20)
    {
          this.init();
    }
  }
  this.testPaddle = function() {
    var top = this.y + this.size/2 > this.paddle.y;
    var bottom = this.y - this.size/2 < this.paddle.y + this.paddle.height;
    var left = this.x+this.size/2 > this.paddle.x;
    var right = this.x + this.size/2 < this.paddle.x + this.paddle.width;
    if(top && bottom && left && right)
    {
      if(this.bad) {
        this.paddle.hit();
      }
      else
      {
      this.paddle.score();
      }
            this.init();
  }
  }
  this.init();
}

function Paddle() {
  this.width = 50;
  this.speed = 30;
  this.height = 30;
  this.color = color(255);
  this.x = width/2 - this.width/2;
  this.y = height - 30;
  this.update = function () {
  }
  
  this.render = function () {
   
     fill(this.color);   rect(this.x,this.y,this.width,this.height);
    this.color = color(255);

  }
  
  this.score = function () {
    this.color = color(0,255,0);
    score++;
    this.width+=10;
  }
  
  this.hit = function() {
    this.color = color(255,0,0);
    lives--;
    this.width -=15;
                       }
  
  this.moveright = function () {
    this.x += this.speed;
    if(this.x + this.width > width) {
      this.x = width - this.width;
    }
  }
  this.moveleft = function () {
    this.x -= this.speed;
    if(this.x  < 0) {
      this.x = 0;
  }
  }
}