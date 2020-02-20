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
	var index=0;
	var r = random(1)

	while(r >0) {
		console.log(index)
		r = r - savedpaddles[index].fitness;
		index++;
	}
	index--;
	let child = new Paddle(savedpaddles[index].brain);
	child.mutate(0.1);
	return child;
}
function calculateFitness() {
	let sum = 0;
	let dissum =0;
	if(sum > generationfitness)
	{
	generationfitness=sum;
	}
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