
const SWAP_TOP_RIGHT = "u r u' r' f r' f' r";
const SWAP_TOP_LEFT  = "u' l' u l f' l f l'";

function SecondLayerSolver(cube)
{
	var self = this; 
	self.cube = cube; 

	self.init = function()
	{
		self.rotateCount = 0;
		self.firstMove = true;
		self.secondMove = false;
	}

	self.getRotation = function(currentColor, destColor)
	{
		var colors = [GREEN, ORANGE, BLUE, RED];
		var idA = colors.indexOf(currentColor);
		var idB = colors.indexOf(destColor);
		var diff = idB - idA;

		if (diff == -3 || diff == 1)
			return "U' " + ROTATE_TO_RIGHT;
		if (diff == 3 || diff == -1)
			return "U " + ROTATE_TO_LEFT;
		if (diff == 2 || diff == -2)
			return "U2 " + ROTATE_TO_LEFT + " " + ROTATE_TO_LEFT;
		return "";
	}

	self.rotateCount = 0; 
	self.getNextMove = function()
	{
		if (self.firstMove)
		{
			self.firstMove = false;
			self.secondMove = true; 
			return self.cube.centerOnColorFace(YELLOW);
		}
		if (self.secondMove)
		{
			self.secondMove = false;
			return ROTATE_TO_BOTTOM;
		}

		if (cube.twoLayersSolved())
			return true; 

		var upColor = self.cube.face(34);
		var topColor = self.cube.face(1);
		var faceColor = self.cube.face(4);
		if (topColor != YELLOW && upColor != YELLOW)
		{
			if (topColor == faceColor)
			{
				if (upColor == self.cube.face(13))
				{
					return SWAP_TOP_RIGHT;
				}
				else if (upColor == self.cube.face(22))
				{
					return SWAP_TOP_LEFT; 
				}
			}
			else
			{
				return self.getRotation(faceColor, topColor);
			}
		}
		if (self.rotateCount >= 4)
		{
			if (self.cube.face(4) != self.cube.face(5) || self.cube.face(12) != self.cube.face(13))
			{
				self.rotateCount = 0; 
				return SWAP_TOP_RIGHT;
			}
			if (self.cube.face(3) != self.cube.face(4) || self.cube.face(22) != self.cube.face(23))
			{
				self.rotateCount = 0; 
				return SWAP_TOP_LEFT;	
			}
		}
		self.rotateCount += 1;
		return ROTATE_TO_RIGHT;
	}

	self.init();
}