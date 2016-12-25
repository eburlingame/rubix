
const ORANGE = 0;
const GREEN = 1; 
const YELLOW = 2; 
const BLUE = 3;
const WHITE = 4; 
const RED = 5; 
const COLORS = ["orange", "green", "yellow", "blue", "white", "red"];
const FACES = ["front", "right", "left", "up", "down", "back"];
const MOVES = ["F", "F'", "R", "R'", "L", "L'", "U", "U'", "D", "D'", "B", "B'"];

const FRONT = 0; 
const RIGHT = 9; 
const LEFT  = 18; 
const UP    = 27; 
const DOWN  = 36; 
const BACK  = 45;

const NUMBER_OF_STICKERS = 54; 

const TURN_RIGHT = [29, 32, 35, 2,  5,   8, 38, 41, 44, 47, 50, 53,  9, 10, 11, 14, 17, 16, 15, 12];
const TURN_LEFT  = [51, 48, 45, 42, 39, 36,  6,  3,  0, 33, 30, 27, 23, 26, 25, 24, 21, 18, 19, 20];
const TURN_DOWN  = [45, 46, 47, 17, 16, 15,  8,  7,  6, 26, 25, 24, 41, 44, 43, 42, 39, 36, 37, 38];
const TURN_UP    = [18, 19, 20,  0,  1,  2,  9, 10, 11, 53, 52, 51, 27, 28, 29, 32, 35, 34, 33, 30];
const TURN_FRONT = [20, 23, 26, 36, 37, 38, 15, 12,  9, 35, 34, 33,  0,  1,  2,  5,  8,  7,  6,  3];
const TURN_BACK  = [44, 43, 42, 24, 21, 18, 27, 28, 29, 11, 14, 17, 50, 53, 52, 51, 48, 45, 46, 47];

const TURN_MIDDLE_VERT = [28, 31, 34,  1,  4,  7, 37, 40, 43, 46, 49, 52];
const TURN_MIDDLE_HORZ = [21, 22, 23,  3,  4,  5, 12, 13, 14, 50, 49, 48];
const TURN_MIDDLE_CENT = [19, 22, 25, 39, 40, 41, 16, 13, 10, 32, 31, 30];

const ROTATE_TO_TOP 	= "L M' R'";
const ROTATE_TO_RIGHT 	= "U E D'";
const ROTATE_TO_BOTTOM 	= "L' M R";
const ROTATE_TO_LEFT 	= "U' E' D";
const ROTATE_TO_BACK 	= "R R M M L' L'";

const ROTATE_CUBE 		= "F S B'";
const ROTATE_CUBE_PRIME	= "F' S' B";

const CENTERS = [4, 13, 22, 31, 40, 49];
const EDGES = { 
	1: 34, 
	3: 23, 
	5: 12, 
	7: 37, 
	10: 32, 
	12: 5, 
	14: 50, 
	16: 41, 
	19: 30, 
	21: 48, 
	23: 3, 
	25: 39,
	28: 52, 
	30: 19, 
	32: 10, 
	34: 1, 
	37: 7, 
	39: 25, 
	41: 16, 
	43: 46, 
	46: 43, 
	48: 21, 
	50: 16, 
	52: 28
};

function getRandInt(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function Cube()
{
	var self = this; 
	self.cube; 

	self.initCube = function()
	{
		self.cube = [
			ORANGE, ORANGE, ORANGE, ORANGE, ORANGE, ORANGE, ORANGE, ORANGE, ORANGE,
			BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE,
			GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN,
			YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW,
			WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE,
			RED, RED, RED, RED, RED, RED, RED, RED, RED,
		];
		self.render();
	}

	self.face = function(id)
	{
		return self.cube[id];
	}

	// Returns the location of color A
	self.findEdge = function(colorA, colorB)
	{
		for (var edge in EDGES)
		{
			if (self.cube[edge] == colorA && self.cube[EDGES[edge]] == colorB)
				return edge;
			else if (self.cube[edge] == colorB && self.cube[EDGES[edge]] == colorA)
				return EDGES[edge];
		}
		return null;
	}

	self.isSolved = function()
	{
		for (var i = 0; i < 6; i++)
		{
			var color = self.cube[9 * i];
			for (var j = 1; j < 9; j++)
			{
				if (self.cube[ 9 * i + j ] != color)
					return false;
			}
		}
		return true; 
	}

	self.twoLayersSolved = function()
	{
		var layers = [
			[21, 22, 23, 24, 25, 26],
			[3, 4, 5, 6, 7, 8],
			[12, 13, 14, 15, 16, 17], 
			[45, 46, 47, 48, 49, 50], 
		];
		for (var i = 0; i < layers.length; i++)
		{
			var color = self.cube[ layers[i][0] ];
			for (var j = 1; j < layers[i].length; j++)
			{
				if (self.cube[ layers[i][j] ] != color)
					return false;
			}
		}
		return true;
	}

	self.frontIsSolid = function()
	{
		var color = self.cube[0];
		for (var i = 1; i < 9; i++)
		{
			if (self.cube[i] != color)
				return false;
		}
		return true;
	}

	self.topIsSolid = function()
	{
		var color = self.cube[27];
		for (var i = 28; i < 36; i++)
		{
			if (self.cube[i] != color)
				return false;
		}
		return true;
	}

	self.topHasCross = function()
	{
		var color = self.cube[28];
		return (self.cube[30] == color &&
				self.cube[31] == color && 
				self.cube[32] == color &&
				self.cube[34] == color);
	}

	self.frontCornersCorrect = function()
	{
		var check = [
			[33, 31, 35], 
			[9, 13, 15],
			[38, 40, 36],
			[26, 22, 20]
		];

		for (var i = 0; i < check.length; i++)
		{
			var faceColor = self.cube[ check[i][1] ];
			if (self.cube[ check[i][0] ] != faceColor || self.cube[ check[i][2] ] != faceColor)
			{
				return false;
			}
		}
		return true;
	}

	self.frontHasCross = function()
	{
		var color = self.cube[1];
		return (self.cube[4] == color && 
				self.cube[5] == color &&
				self.cube[3] == color &&
				self.cube[7] == color);
	}

	self.frontHasAlignedCross = function()
	{
		return self.frontHasCross() && 
			(self.cube[34] == self.cube[31]) &&
			(self.cube[12] == self.cube[13]) &&
			(self.cube[37] == self.cube[40]) &&
			(self.cube[22] == self.cube[23]);
	}

	self.isEdge = function(id)
	{
		return id in EDGES;
	}

	self.isCenter = function(id)
	{
		return CENTERS.includes(id);
	}

	self.isCorner = function(id)
	{
		return (!self.isEdge(id) && !self.isCenter(id))
	}

	self.centerOnColorFace = function(color)
	{
		if (self.cube[31] == color)
			self.rotateMultiple(ROTATE_TO_TOP);
		if (self.cube[13] == color)
			self.rotateMultiple(ROTATE_TO_RIGHT);
		if (self.cube[40] == color)
			self.rotateMultiple(ROTATE_TO_BOTTOM);
		if (self.cube[22] == color)
			self.rotateMultiple(ROTATE_TO_LEFT);
		if (self.cube[49] == color)
			self.rotateMultiple(ROTATE_TO_BACK);
	}

	self.rotate = function(rotation_matrix, direction)
	{
		var newCube = self.cube.slice();
		// Shift edges (0-11)
		for (var i = 0; i < 12; i++)
		{
			var shiftR = (i + 3 * (direction == 1)) % 12;
			var shiftL = (i + 3 * (direction != 1)) % 12;
			newCube[ rotation_matrix[shiftL] ] = self.cube[ rotation_matrix[shiftR] ];
		}
		if (rotation_matrix.length == 20)
		{
			// Rotate face (12-19)
			for (var i = 0; i < 8; i++)
			{
				var shiftR = (i + 2 * (direction != 1)) % 8;
				var shiftL = (i + 2 * (direction == 1)) % 8;
				newCube[ rotation_matrix[shiftL + 12] ] = self.cube[ rotation_matrix[shiftR + 12] ];
			}
		}
		self.cube = newCube;
	}

	self.rotateMultiple = function(commands)
	{
		var split = commands.split(/\s+/);
		for (var i = 0; i < split.length; i++)
		{
			var instruction = split[i].toUpperCase();
			if (instruction.includes("2"))
			{
				instruction = instruction.replace("2", "");
				self.rotateDirection(instruction);	
			}
			self.rotateDirection(instruction);
		}
		self.render();
	}

	self.rotateDirection = function(direction)
	{
		if (direction == "R")
			self.rotate(TURN_RIGHT, 1);
		else if (direction == "R'")
			self.rotate(TURN_RIGHT, -1);
		else if (direction == "L")
			self.rotate(TURN_LEFT, 1);
		else if (direction == "L'")
			self.rotate(TURN_LEFT, -1);
		else if (direction == "D")
			self.rotate(TURN_DOWN, 1);
		else if (direction == "D'")
			self.rotate(TURN_DOWN, -1);
		else if (direction == "U")
			self.rotate(TURN_UP, 1);
		else if (direction == "U'")
			self.rotate(TURN_UP, -1);
		else if (direction == "F")
			self.rotate(TURN_FRONT, 1);
		else if (direction == "F'")
			self.rotate(TURN_FRONT, -1);
		else if (direction == "B")
			self.rotate(TURN_BACK, 1);
		else if (direction == "B'")
			self.rotate(TURN_BACK, -1);

		else if (direction == "M")
			self.rotate(TURN_MIDDLE_VERT, 1);
		else if (direction == "M'")
			self.rotate(TURN_MIDDLE_VERT, -1);
		else if (direction == "E")
			self.rotate(TURN_MIDDLE_HORZ, 1);
		else if (direction == "E'")
			self.rotate(TURN_MIDDLE_HORZ, -1);
		else if (direction == "S")
			self.rotate(TURN_MIDDLE_CENT, 1);
		else if (direction == "S'")
			self.rotate(TURN_MIDDLE_CENT, -1);
	}

	self.scramble = function(numTurns)
	{
		for (var i = 0; i < numTurns; i++)
		{
			var move = getRandInt(0, 12);
			self.rotateDirection(MOVES[move]);
			self.render();
		}
	}

	self.render = function()
	{
		for (var i = 0; i < NUMBER_OF_STICKERS; i++)
		{
			var element = $("#sticker" + i);
			element.removeClass(element.attr("class"));
			element.addClass(COLORS[self.cube[i]]);
			element.text(i);
		}
	}
	self.initCube();
}