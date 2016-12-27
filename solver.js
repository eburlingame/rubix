
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
		"Solve yellow face",
		"Solve yellow corners",
		"Solve yellow edges"
	];
}

function SolverStepper(cube)
{
	var self = this; 
	self.cube = cube;
	self.stages = [];
	self.activeStage = 0; 
	self.activeStep = 0; 

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
					if (buffer.trim() != "")
						newMoves.push(buffer);
					if (split[j] != "")
						newMoves.push(split[j]);

					buffer = "";
				}
				else
				{
					buffer += split[j] + " ";
				}
			}
			if (buffer.trim() != "")
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
		self.activateStep();
	}

	self.nextStep = function()
	{
		if (self.activeStage >= self.stages.length)
			return true;

		self.cube.makeMove(self.stages[self.activeStage].steps[self.activeStep]);
		self.cube.render();

		self.deactivateStep();
		if (self.activeStep == self.stages[self.activeStage].steps.length - 1)
		{
			self.activeStage += 1;
			self.activeStep = 0;

			if (self.activeStage == self.stages.length)
				return true;

			while(self.stages[self.activeStage].steps.length == 0)
				self.activeStage += 1;
		}
		else
			self.activeStep += 1;

		self.activateStep();
		return false; 
	}

	self.runSolution = function()
	{
		var result = self.nextStep();
		if (result != true)
		{
			setTimeout(self.runSolution, 300);
		}
		return result;
	}

	self.getRotationLabel = function(text)
	{
		if (text == "ROT_UP")
			return "Rotate cube to up face";
		if (text == "ROT_DOWN")
			return "Rotate cube to down face";
		if (text == "ROT_LEFT")
			return "Rotate cube to left face";
		if (text == "ROT_RIGHT")
			return "Rotate cube to right face";
		if (text == "ROT_BACK")
			return "Rotate cube to back face";

		if (text == "ROT_CW")
			return "Rotate cube clockwise";
		if (text == "ROT_CCW")
			return "Rotate cube counterclockwise";
	}

	self.renderStep = function(name, stageNum, stepNumber, stepText)
	{
		var element = $("<div>").addClass("ui segment");

		element.append($("<p>"));
		if (stepText.includes("ROT_"))
		{
			element.addClass("secondary");
			element.text(self.getRotationLabel(stepText));
		}
		else
		{
			element.text(stepText.toUpperCase());
		}
		element.attr("id", "stage_" + stageNum + "_" + stepNumber);

		return element; 
	}

	self.renderStage = function(name, stageNum, steps)
	{
		var parent = $("<div>").addClass("ui segments").attr("id", "stage_" + stageNum);
		var title = $("<div>").addClass("ui segement")
							  .append($("<h3>").text(name).css("padding", "10px 0px 0px 15px"));

		var segments = $("<div>").addClass("ui segments");
		for (var i = 0; i < steps.length; i++)
		{
			segments.append(self.renderStep(name, stageNum, i, steps[i]));
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

	self.deactivateStep = function()
	{
		$("#stage_" + self.activeStage + "_" + self.activeStep).removeClass("inverted green");	
	}

	const TRANSITION_RATE = 100;
	self.activateStep = function()
	{
		var activeSegment = "#stage_" + self.activeStage + "_" + self.activeStep;
		$(activeSegment).addClass("inverted green");

		if (self.activeStep == 0)
		{
			$(".sidebar").scrollTo("#stage_" + self.activeStage, TRANSITION_RATE);
		}
		else
			$(".sidebar").scrollTo(activeSegment, TRANSITION_RATE);
	}

	self.init();
}