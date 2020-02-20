
var balls = [];
var balls2 = [];
var total = 300;
function setup() {
  createCanvas(1000, 600);
  for(var i=0;i<total;i++)
  {
  balls2[i] = new Ball2();
  }
  for(var i=0;i<100;i++)
  {
  balls[i] = new Ball();
  }
}

function draw() {
  background(0);
  for(var i=0;i<balls.length;i++)
  {
  balls[i].update();
  balls[i].render();

  }
  for(var i=0;i<balls2.length;i++)
  {
  
  balls2[i].update();
  balls2[i].render();
  }

}

function Ball() {
  this.size = 4;
  this.speed = 0;
  this.speedx=0;
  this.init = function() {
  this.x = random(20,width-20);
  this.y = random(20,width-20);
  }
  this.init();

  this.render = function () {
    fill(255);               
    ellipse(this.x,this.y,this.size,this.size);
  }
  
  this.update = function()
  {
    this.y += this.speed;
    this.speed+=3.8;
    this.x += this.speedx;
    if(this.y + this.size > height || this.x < 0 || this.x > width)
    {

          this.speed = -1*random(10,20);
          this.speedx = -1*random(-10,10);
    }
  }

}

function Ball2() {
  this.size = 4;
  this.speed = 0;
  this.init = function() {
  this.x = random(20,width-20);
  this.y = random(-20,1000);
  }
  this.init();

  this.render = function () {
    fill(255);               
    ellipse(this.x,this.y,this.size,this.size);
  }
  
  this.update = function()
  {
    this.y += this.speed;
    this.speed+=3.8;
    if(this.y + this.size > height)
    {
          this.init();
    }
  }

}


