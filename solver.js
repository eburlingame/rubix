
const MAX_STEPS = 100;

function Solver(cube)
{
	var self = this; 
	self.currentSolver;
	self.cube = cube; 

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
		self.moves = [];
		var move = self.currentSolver.getNextMove();
		var i = 0; 
		while(move != true)
		{
			i += 1;
			self.moves.push(move);
			cube.makeMove(move);
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
		cube.makeMove(move);
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

	self.stageDescriptions = [
		"Solve white cross", 
		"Solve white face",
		"Solve second layer",
		"Solve yellow cross",
		"Solve yellow corners",
		"Solve yellow edges"
	];
}

function SolverStepper(cube)
{
	var self = this; 
	self.cube = cube;
	self.stages = [];

	self.copyCube = function()
	{
		for (var i = 0; i < NUMBER_OF_STICKERS; i++)
		{
			self.solutionCube.cube[i] = self.cube.face(i);
		}
	}

	self.seperateRotationMoves = function(moves)
	{
		var newMoves = [];
		for (var i = 0; i < moves.length; i++)
		{
			var split = moves[i].split(/\s+/);
			var buffer = "";

			for (var j = 0; j < split.length; j++)
			{
				if (split[j].includes("ROT_"))
				{
					if (buffer != "")
						newMoves.push(buffer);
					newMoves.push(split[j]);
					buffer = "";
				}
				else
				{
					buffer += split[j] + " ";
				}
			}
			if (buffer != "")
				newMoves.push(buffer);
		}
		return newMoves;
	}

	self.init = function()
	{
		console.log(self.cube);
		self.solutionCube = new Cube();
		self.copyCube();
		console.log(self.solutionCube);

		self.solver = new Solver(self.solutionCube);

		var result = true; 
		for (var i = 0; i < self.solver.stages.length; i++)
		{
			result = self.solver.stages[i].call();
			var steps = self.seperateRotationMoves(self.solver.moves);
			self.stages.push({
				"name": self.solver.stageDescriptions[i],
				"steps": steps
			});
		}
		console.log(self.stages);
		self.render();
	}

	self.renderStage = function(name, stageNum, steps)
	{
		// <div class="ui segments">
		//   <div class="ui segment">
		//     <p>Solve white edges</p>
		//   </div>
		//   <div class="ui segments">
		//     <div class="ui inverted green segment">
		//       <p>F R U R' U'</p>
		//     </div>
		//     <div class="ui secondary segment">
		//       <p>Rotate clockwise</p>
		//     </div>
		//     <div class="ui segment">
		//       <p>Nested Bottom</p>
		//     </div>
		//   </div>
		// </div>

		var parent = $("<div>").addClass("ui segments");
		var title = $("<div>").addClass("ui segement").append($("<h3>").text(name).css("padding", "10px 0px 0px 10px"));

		var segments = $("<div>").addClass("ui segments");
		for (var i = 0; i < steps.length; i++)
		{
			var element = $("<div>").addClass("ui segment");
			element.append($("<p>").text(steps[i]));
			element.attr("id", "stage_" + stageNum + "_" + i);
			segments.append(element);
		}

		parent.append(title);
		parent.append(segments);

		return parent;
	}

	self.render = function()
	{
		$("#steps").html("");
		for (var i = 0; i < self.stages.length; i++)
		{
			$("#steps").append(self.renderStage(self.stages[i].name, i, self.stages[i].steps))	
		}
		self.activateStep(0, 0);
	}

	self.activateStep = function(stageNum, stepNum)
	{
		$("#stage_" + stageNum + "_" + stepNum).addClass("inverted green");
	}

	self.init();
}