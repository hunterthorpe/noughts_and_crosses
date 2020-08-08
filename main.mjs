// NOUGHTS AND CROSSES GAME WHERE PLAYER CONTROLS NOUGHTS

//CONSTANTS
const CROSSVAL = 0;
const NOUGHTVAL = 1;
const BLANKVAL = -1;
const WINS = 0;
const LOSSES = 1;
const TIES = 2;

var stats;
// setting stats using local storage
if(localStorage.getItem("stats") === null) {
	stats = [0, 0, 0];
} else {
	stats = JSON.parse(localStorage.getItem("stats"));
} 
$("#wins").html("<h4>" + stats[WINS] + "</h4>");
$("#losses").html("<h4>" + stats[LOSSES] + "</h4>");
$("#ties").html("<h4>" + stats[TIES] + "</h4>");

// defining buttons 
newGameButton = document.getElementById("newgame")
newGameButton.addEventListener ("click", function() {
	location.reload();
});

clearButton = document.getElementById("clearrecord")
clearButton.addEventListener ("click", function() {
	stats = [0, 0, 0];
	$("#wins").html("<h4>" + stats[WINS] + "</h4>");
	$("#losses").html("<h4>" + stats[LOSSES] + "</h4>");
	$("#ties").html("<h4>" + stats[TIES] + "</h4>");
	localStorage.setItem("stats", JSON.stringify(stats));
});

// Defining elements
var game = "ul.game",
gameSquare = "ul.game li.blank",
nought = "ul.game li.nought",
cross = "ul.game li.cross";

// Defining array nought and cross
var gameResult = [nought, cross];

// create a 3x3 matrix that models the game grid
var squareIDs = [[], [], []];
var row;
var col;
for (row = 0; row < 3; row++) {
	for (col = 0; col < 3; col++) {
		squareIDs[row][col] = BLANKVAL;
	}
}

// resets x value 
var x = 0;
function resetClick() {
	x = 0;
    gameSquare.value = x;
}

// given a game grid, returns the value of a winner or -1 otherwise
function findWinner(square) {
	var winner = BLANKVAL;

	// Checking rows
	for (row = 0; row < 3; row++) {
		if (square[row][0] == square[row][1] && square[row][1] == square[row][2] && 
				square[row][1] != BLANKVAL) {
			winner = square[row][0];
		}
	}
	// Checking columns
	for (col = 0; col < 3; col++) {
		if (square[0][col] == square[1][col] && square[1][col] == square[2][col] && 
				square[1][col] != BLANKVAL) {
			winner = square[0][col];
		}
	}
	if (square[1][1] != BLANKVAL) {
		// Checking top left to bottom right diag
		if (square[0][0] == square[1][1] && square[1][1] == square[2][2]) {
			winner = square[1][1];
		}
		// Checking top right to bottom left diag
		if (square[0][2] == square[1][1] && square[1][1] == square[2][0]) {
			winner = square[1][1];
		}
	}
	return winner;
}

// ends game if there is a winner
function isWinner(winner_val) {
	if (winner_val == NOUGHTVAL) {
		$("h1").html("<h1>NOUGHT WINS!</h1>");
		$(gameSquare).unbind();	   
		stats[WINS] = stats[WINS] + 1;
		$("#wins").html("<h4>" + stats[WINS] + "</h4>");
		localStorage.setItem("stats", JSON.stringify(stats));
		return;
	}; 		
	if(winner_val == CROSSVAL) {
		$("h1").html("<h1>CROSS WINS!</h1>");
		stats[LOSSES] = stats[LOSSES] + 1;   
		$(gameSquare).unbind();	 
		$("#losses").html("<h4>" + stats[LOSSES] + "</h4>");
		localStorage.setItem("stats", JSON.stringify(stats));
		return;
	}; 	
}

// returns a random integer
function getRandInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
  }

// increments x value if neccasary 
function count() {
	if(x<1) {
		x += 1;
	} else {
		x = 0;
	}
}

$( "p.reset" ).click(function() {
         location.reload(true);
});

// defining what happens when a square is clicked
$(gameSquare).bind("click", function(){

	// return early when square has already been clicked
	if ($(this).hasClass("blank") == false){
		return;
	}
	count();
	
	// updates page and matrix grid
	$(this).addClass("nought");
	$(this).removeClass("blank");
	squareIDs[$(this).attr("id")[0]][$(this).attr("id")[2]] = NOUGHTVAL;	

	// checking if player has won game
	var possible_winner;
	possible_winner = findWinner(squareIDs)
	isWinner(possible_winner);
	if (possible_winner != BLANKVAL) {
		return;
	}

	// checking for tie
	if ($("ul.game li.blank").length) {

	} else {
		stats[TIES] = stats[TIES] + 1; 
		$("h1").html("<h1>TIE!</h1>");  
		$("#ties").html("<h4>" + stats[TIES] + "</h4>");
		localStorage.setItem("stats", JSON.stringify(stats));
		return;
	};

	// computers move
	var copy;
	var pos;
	var r;
	var c;
	var square;

	// first checks if computer can win game, then checks if player can win game next move and 
	// blocks appropriatley 
	for (pos = 0; pos < 2; pos++){
		for (r = 0; r < 3; r++) {
			for (c = 0; c < 3; c++) {
				if (squareIDs[r][c] == BLANKVAL) {

					copy = squareIDs.map(inner => inner.slice())
					copy[r][c] = pos

					if (findWinner(copy) == pos) {
						squareIDs[r][c] = CROSSVAL;					
						square = document.getElementById(`${r},${c}`);
						square.classList.add("cross");
						square.classList.remove("blank")
						resetClick(); 
						possible_winner = findWinner(squareIDs);
						isWinner(possible_winner);
						return;
					}
				}
			}
		}
	}

	// otherwise picks a random blank spot on grid 
	var canidates = [];
	for (r = 0; r < 3; r++) {
		for (c = 0; c < 3; c++) {
			if (squareIDs[r][c] == BLANKVAL) {
				canidates.push([r, c]);
			}
		}
	}

	var chosen_coord;
	chosen_coord = canidates[getRandInt(canidates.length - 1)];
	r = chosen_coord[0];
	c = chosen_coord[1];
	squareIDs[r][c] = CROSSVAL;
	square = document.getElementById(`${r},${c}`);
	square.classList.add("cross");
	square.classList.remove("blank")
	resetClick(); 			
});
