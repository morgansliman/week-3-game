function byid(id) {
	return document.getElementById(id);
}

var game = {

	name: "hangman",

	gameOn: false,

	terms: ["mario",
			"peach",
			"boo",
			"bowser",
			"luigi",
			"yoshi"],

	flagPos: 187,

	remainingGuesses: 10,

	userGuess: "",

	newWord: "",

	blanks: [],

	guessedLetters: [],

	newGame: function() {
		this.gameOn = true;
		this.resetPage();
	},

	resetPage: function() {
		this.flagPos = 187;
		this.blanks = [];
		this.guessedLetters = [];
		this.remainingGuesses = 10;
		this.newWord = this.terms[Math.floor(Math.random() * this.terms.length)];
		for (var i=0; i < this.newWord.length; i++) {
			this.blanks.push('_');
		}
		byid('flag-container').style.top = this.flagPos + 'px';
		byid('picture').src = "assets/images/questionBlock.png";
		byid('guessed-letters-list').innerHTML = '-';
		byid('instruction-text').innerHTML = "Try to figure out the word!";
		byid('remaining-guesses-number').innerHTML = this.remainingGuesses;
		byid('current-word-blank').innerHTML = this.blanks.join(' ');
		window.scrollTo(0,document.body.scrollHeight);
	},

	checkGuess: function() {
		if (this.guessedLetters.indexOf(this.userGuess) != -1) {
			return;
		} else if (this.newWord.indexOf(this.userGuess) != -1){
			return true;
		} else {
			return false;
		}
	},

	updateLetters: function() {
		for (var i=0; i < this.newWord.length; i++) {
			if (this.userGuess == this.newWord[i]) {
				this.blanks[i] = this.userGuess;
			}
		}
		byid('current-word-blank').innerHTML = this.blanks.join(' ');
		if (this.blanks.indexOf('_') == -1) {
			this.endGame('win');
		}
	},

	updateNumbers: function() {
		this.remainingGuesses--
		this.moveFlag();
		if (this.remainingGuesses <= 0) {
			this.endGame('loss');
		} else {
			byid('remaining-guesses-number').innerHTML = this.remainingGuesses;
		}
	},

	updateWrongGuesses: function() {
		if (this.gameOn == false && this.remainingGuesses >= 0) {
			return;
		} else {
			this.guessedLetters.push(this.userGuess);
			byid('guessed-letters-list').innerHTML = this.guessedLetters;
		}
	},

	endGame: function(result) {
		this.gameOn = false;

		if (result == 'win') {
			var count = parseInt(byid('win-number').innerHTML);
			var audio = new Audio('assets/sounds/' + this.newWord + '.wav');
			audio.play();
			byid('win-number').innerHTML = count + 1;
			byid('picture').src = "assets/images/" + this.newWord + ".png";
			byid('instruction-text').innerHTML = "You win! Press any key to play again.";
		} else if (result == 'loss') {
			byid('remaining-guesses-number').innerHTML = 0;
			byid('instruction-text').innerHTML = "Game Over<br>Press any key to try again!";
		}
	},

	moveFlag: function() {
		this.flagPos = this.flagPos + 41;
		byid('flag-container').style.top = this.flagPos + 'px';
	}
}

document.onkeyup = function(event) {
	if (game.gameOn == false) {
		game.newGame();
	} else {
		game.userGuess = String.fromCharCode(event.keyCode).toLowerCase();
		if (/[a-z]/.test(game.userGuess)) {
			if (game.checkGuess() && game.remainingGuesses > 0) {
				game.updateLetters();
			} else if (!game.checkGuess() && game.guessedLetters.indexOf(game.userGuess) == -1) {
				game.updateWrongGuesses();
				game.updateNumbers();
			}
		}
	}
}