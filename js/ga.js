function nextGeneration()
{

	calculateFitness();
	for(let i=0;i<totalpaddles;i++)
	{
		paddles[i] = pickOne();
	}
	savedpaddles = [];
}

function pickOne() {
	let randpad = new Paddle();
	//console.log(savedpaddles);
	var maxfitness=-100000;
	var index=0;
	for(var i=0;i<savedpaddles.length;i++)
	{
		if(savedpaddles[i].fitness > maxfitness) 
		{
			maxfitness=savedpaddles[i].fitness;
			randpad = savedpaddles[i];
			generationfitness = maxfitness;
		}
	}
	let child = new Paddle(randpad.brain);
	child.mutate(0.1);
	return child;
}
function calculateFitness() {
	let sum = 0;
	let dissum =0;
	for(let paddle of savedpaddles)
	{
		sum+=paddle.score;
		dissum+=paddle.dist;
	}
	for(let paddle of paddles)
	{
		paddle.fitness = paddle.score/sum;
		paddle.fitness += paddle.dist/dissum;
	}
}