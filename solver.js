
const MAX_STEPS = 100;

function Solver(cube)
{
	var self = this; 
	self.currentSolver;
	self.cube = cube; 

	self.init = function()
	{
		}

	self.solve = function()
	{
		var result = true; 
		for (var i = 0; i < self.stages.length; i++)
		{
			console.log("Starting stage " + i);
			result = self.stages[i].call();
			if (result == false)
			{
				console.log("ALARM - failed on step " + i);
				return false;
			}
		}
	}

	self.solveWhiteCross = function()
	{
		self.currentSolver = new WhiteCrossSolver(self.cube);
		return self.solveCurrentStage();
	}

	self.solveWhiteFace = function()
	{
		self.currentSolver = new WhiteFaceSolver(self.cube);
		return self.solveCurrentStage();
	}

	self.solveSecondLayer = function()
	{
		self.currentSolver = new SecondLayerSolver(self.cube);
		return self.solveCurrentStage();
	}

	self.solveYellowCross = function()
	{
		self.currentSolver = new YellowCrossSolver(self.cube);
		return self.solveCurrentStage();
	}

	self.solveYellowFace = function()
	{
		self.currentSolver = new YellowFaceSolver(self.cube);
		return self.solveCurrentStage();
	}

	self.solveYellowCorners = function()
	{
		self.currentSolver = new YellowCornerSolver(self.cube);
		console.log("Solving yellow corners");
		return self.solveCurrentStage();
	}

	self.solveYellowEdges = function()
	{
		self.currentSolver = new YellowEdgeSolver(self.cube);
		return self.solveCurrentStage();	
	}

	self.solveMultiple = function()
	{
		for (var i = 0; i < 1000; i++)
		{
			self.cube.initCube();
			self.cube.scramble(35);
			console.log(i);
			var result = self.solve();
			if (result == false)
			{
				console.log("Error");
				break;	
			}
		}
	}

	self.solveCurrentStage = function()
	{
		var move = self.currentSolver.getNextMove();
		var i = 0; 
		while(move != true)
		{
			i += 1;
			cube.rotateMultiple(move);
			move = self.currentSolver.getNextMove();
			if (i >= MAX_STEPS)
			{
				return false;
			}
		}
		return true; 
	}

	self.applyNextMove = function()
	{
		move = self.currentSolver.getNextMove();
		cube.rotateMultiple(move);
		console.log(move);
	}

	self.stages = [
		self.solveWhiteCross, 
		self.solveWhiteFace, 
		self.solveSecondLayer,
		self.solveYellowCross,
		self.solveYellowFace,
		self.solveYellowCorners,
		self.solveYellowEdges
	];
}