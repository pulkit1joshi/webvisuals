var angle=0.00;
function setup() {
  createCanvas(windowWidth, 300);
}

function draw() {
  background(0);
  var arr= [];
  var y=[];
  for(var i=0;i<200;i++)
  {
    arr[i] = angle+i/20;
    y[i] = 150+sin(arr[i])*100;
    ellipse(10+i*20,y[i],10,10);
    ellipse(10+i*20,y[i]+10,10,10);
    ellipse(10+i*20,y[i]+20,10,10);
    ellipse(10+i*20,y[i]+30,10,10);
    ellipse(10+i*20,y[i]+40,10,10);
    
  }
  ellipse(windowWidth/2+sin(angle/1.5)*windowWidth/2,270,20,20);	
  angle+=0.01;
}
