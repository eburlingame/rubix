
const MIDDLE_RIGHT_MOVES = { 
	1: "U2 B' R2", 
	3: "L2 B2 R2", 
	5: "", 
	7: "U2 B R2", 

	10: "U' B' R2 U", 
	12: "R2 B' D' R D", 
	14: "B' D' R D", 
	16: "D B R2 D'",

	19: "U B' R2 U'", 
	21: "B D' R D", 
	23: "L2 B' U R' U'", 
	25: "D' B R2 D",

	28: "U R' U'",
	30: "U2 R' U2",
	32: "R'",
	34: "U' R'",

	37: "D R", 
	39: "D2 R D2", 
	41: "R", 
	43: "D' R D", 

	46: "B R2", 
	48: "B2 R2", 
	50: "R2", 
	52: "B' R2"
};

function WhiteCrossSolver(cube)
{
	var self = this; 
	self.cube = cube;

	self.init = function()
	{
		self.firstMove = true; 
	}

	self.solveRightMove = function()
	{
		var rightColor = self.cube.face(13);
		var edgeLocation = self.cube.findEdge(WHITE, rightColor);
		return MIDDLE_RIGHT_MOVES[edgeLocation];
	}

	self.getNextMove = function()
	{
		if (self.firstMove)
		{
			self.firstMove = false;
			return self.cube.centerOnColorFace(WHITE);
		}

		if (self.cube.frontHasAlignedCross())
			return true;

		if (self.cube.face(5) == WHITE && self.cube.face(12) == self.cube.face(13))
			return ROTATE_CUBE;

		return self.solveRightMove();
	}
	self.init();
}

function WhiteFaceSolver(cube)
{
	var self = this; 
	self.cube = cube;

	self.init = function()
	{
		self.firstMove = true;
	}

	self.getNextMove = function()
	{
		if (self.firstMove)
		{
			self.firstMove = false;
			return self.cube.centerOnColorFace(WHITE);
		}

		if (self.cube.frontIsSolid())
			return true;

		if (self.cube.face(2) == WHITE)
		{
			if (self.cube.face(31) != self.cube.face(35) || self.cube.face(9) != self.cube.face(13))
			{
				return "R' U R U'"; 
			}
		}

		if (self.cube.face(38) == WHITE)
			return "R D' R' D";

		if (self.cube.face(36) == WHITE)
			return "L' D L D'";

		if (self.cube.face(47) == WHITE)
			return "R D' R' D";

		if (self.cube.face(45) == WHITE)
			return "L' D L D'";

		if (self.cube.face(44) == WHITE)
		{
			if (self.cube.face(17) == self.cube.face(13) && self.cube.face(47) == self.cube.face(40))
			{
				return "R D' R' D";
			}
			else if (self.cube.face(17) == self.cube.face(31))
			{
				return "B " + ROTATE_CUBE;
			}
			else if (self.cube.face(17) == self.cube.face(40))
			{
				return "B' " + ROTATE_CUBE_PRIME;
			}
			else if (self.cube.face(17) == self.cube.face(22))
			{
				return "B2 " + ROTATE_CUBE + " " + ROTATE_CUBE;
			}
		}

		if (self.cube.face(42) == WHITE)
		{
			if (self.cube.face(22) == self.cube.face(24) && self.cube.face(45) == self.cube.face(40))
			{
				return "L' D L D'";
			}
			else if (self.cube.face(24) == self.cube.face(31))
			{
				return "B' " + ROTATE_CUBE_PRIME;
			}
			else if (self.cube.face(24) == self.cube.face(13))
			{
				return "B2 " + ROTATE_CUBE + " " + ROTATE_CUBE;
			}
			else if (self.cube.face(24) == self.cube.face(40))
			{
				return "B " + ROTATE_CUBE;
			}
		}

		return ROTATE_CUBE;
	}
}