
const PERMUTE_EDGES = "f r u r' u' f'";

function YellowCrossSolver(cube)
{
	var self = this; 
	self.cube = cube; 

	self.init = function()
	{
		self.cube.centerOnColorFace(YELLOW);
		self.cube.rotateMultiple(ROTATE_TO_BOTTOM);
	}

	self.getNextMove = function()
	{
		if (self.cube.topHasCross())
			return true;

		// Horizontal line or L in upper left
		if (self.cube.face(30) == YELLOW && self.cube.face(32) == YELLOW || self.cube.face(27) == YELLOW)
			return PERMUTE_EDGES;

		if (self.cube.face(28) == YELLOW && self.cube.face(30) == YELLOW)
			return PERMUTE_EDGES;

		// Vertical line
		if (self.cube.face(28) == YELLOW && self.cube.face(34) == YELLOW)
			return "U";

		if (self.cube.face(33) == YELLOW)
			return "U";
		if (self.cube.face(29) == YELLOW)
			return "U'";
		if (self.cube.face(35) == YELLOW)
			return "U";

		return PERMUTE_EDGES;
	}

	self.init();
}


const PERMUTE_CORNERS = "r u r' u r u2 r'";
function YellowFaceSolver(cube)
{
	var self = this; 
	self.cube = cube; 

	self.init = function()
	{
		self.cube.centerOnColorFace(YELLOW);
		self.cube.rotateMultiple(ROTATE_TO_BOTTOM);
	}

	self.getNextMove = function()
	{
		if (self.cube.topIsSolid())
			return true;

		if (self.cube.face(27) != YELLOW && self.cube.face(29) != YELLOW && 
			self.cube.face(33) != YELLOW && self.cube.face(35) != YELLOW)
		{
			if (self.cube.face(20) == YELLOW)
				return PERMUTE_CORNERS;
			else
			{
				if (self.cube.face(51) == YELLOW)
					return "U'";
				else if (self.cube.face(2) == YELLOW)
					return "U";
				else if (self.cube.face(11) == YELLOW)
					return "U2";
			}
		}

		if (self.cube.face(27) != YELLOW && self.cube.face(29) != YELLOW && 
			self.cube.face(33) == YELLOW && self.cube.face(35) != YELLOW)
		{
			return PERMUTE_CORNERS;
		}

		if (self.cube.face(0) == YELLOW)
			return PERMUTE_CORNERS;

		return "U";
	}

	self.init();
}


const PERMUTE_YELLOW_CORNERS = "r' d r' u2 r d' r' u2 r2";

function YellowCornerSolver(cube)
{
	var self = this; 
	self.cube = cube; 

	self.init = function()
	{
		self.cube.centerOnColorFace(YELLOW);
	}

	self.getRotation = function(currentColor, destColor)
	{
		var colors = [GREEN, ORANGE, BLUE, RED];
		var idA = colors.indexOf(currentColor);
		var idB = colors.indexOf(destColor);
		var diff = idB - idA;

		if (diff == -3 || diff == 1)
			return "F' " + ROTATE_CUBE;
		if (diff == 3 || diff == -1)
			return "F " + ROTATE_CUBE_PRIME;
		if (diff == 2 || diff == -2)
			return "F2 " + ROTATE_CUBE + " " + ROTATE_CUBE;
		return "";
	}

	self.noHeadlights = function()
	{
		var check = [
			[33, 31, 35], 
			[9, 13, 15],
			[38, 40, 36],
			[26, 22, 20]
		];

		for (var i = 0; i < check.length; i++)
		{
			if (self.cube.face(check[i][0]) == self.cube.face(check[i][2]))
			{
				return false;
			}
		}
		return true;
	}

	self.getNextMove = function()
	{
		if (self.cube.frontCornersCorrect())
			return true;

		if (self.noHeadlights())
			return PERMUTE_YELLOW_CORNERS;

		var topColor = self.cube.face(31);
		if (self.cube.face(35) == topColor && self.cube.face(33) == topColor)
		{
			return PERMUTE_YELLOW_CORNERS;
		}

		if (self.cube.face(35) == self.cube.face(33))
		{
			return self.getRotation(topColor, self.cube.face(35));
		}

		return "F";
	}

	self.init();
}

const PERMUTE_YELLOW_EDGES = "r2 u r u r' u' r' u' r' u r'";

function YellowEdgeSolver(cube)
{
	var self = this; 
	self.cube = cube; 

	self.init = function()
	{
		self.cube.centerOnColorFace(YELLOW);
		self.cube.rotateMultiple(ROTATE_TO_BOTTOM);
	}
	
	self.getNextMove = function()
	{
		if (self.cube.isSolved())
			return true;

		if (self.cube.face(10) == self.cube.face(13))
		{
			return ROTATE_TO_LEFT;
		}

		if (self.cube.face(19) == self.cube.face(22))
		{
			return ROTATE_TO_RIGHT;
		}

		if ((self.cube.face(1) == self.cube.face(4)))
		{
			return ROTATE_TO_RIGHT + " " + ROTATE_TO_RIGHT;
		}

		return PERMUTE_YELLOW_EDGES;
	}

	self.init();
}