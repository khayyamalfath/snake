/** TO DO:
 * bugfix: pressing two arrow keys very fast causes snake to commit suicide
 * replicate snake and border patterns from nokia 5110: https://www.youtube.com/watch?v=8kvKQ00Uc3o
 */

/** global */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


let snake = [[2, 15], [1, 15], [0, 15]];	/** bottom left */
let direction = [1, 0]
let orb = [
	Math.floor(Math.random() * canvas.width / 3),
	Math.floor(Math.random() * canvas.height / 3)
]

let isPaused = false;
let score = 0;
let topScore = 0;

/** functions */
function drawCell(x, y) {
	/** cell is 3x3px */
	const cellSize = 3;

	ctx.fillStyle = "black";
	ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function placeOrb() {
	/** orb spawn is random */
	orb = [
		Math.floor(Math.random() * canvas.width / 3),
		Math.floor(Math.random() * canvas.height / 3)
	];
}

function updateSnake() {
	/** spawns new head and pops tail to simulate movement, doesn't pop tail if orb is eaten, triggers game over if collision with wall or head is detected */
	if (!isPaused) {
		const newHead = [
			snake[0][0] + direction[0],
			snake[0][1] + direction[1]
		];
	
		snake.unshift(newHead);
		if (newHead[0] === orb[0] && newHead[1] === orb[1]) {
			placeOrb();
			score++;
			updateScore();
		} else {
			snake.pop();
		}
	
		if (newHead[0] < 0 || newHead[0] >= canvas.width /3 || newHead[1] < 0 || newHead[1] >= canvas.height / 3) {
			gameOver()
		}

		for (let i = 1; i < snake.length; i++) {
			if (snake[i][0] === newHead[0] && snake[i][1] === newHead[1]) {
				gameOver()
			}
		}
	}
}

function drawSnake() {
	/** calls drawCell() to draw snake */
	snake.forEach(segment => drawCell(segment[0], segment[1]));
}

function drawOrb(x, y) {
	/** cell is 3x3 px, in order to draw the classic orb pattern from snake we use a matrix where true means draw and false means not draw */
	const cellSize = 3;
	const pixelSize = 1;

	const pattern = [
		[false, true, false],
		[true, false, true],
		[false, true, false]
	];

	for (let i = 0; i < cellSize; i++) {
		for (let j = 0; j < cellSize; j++) {
			if (pattern[i][j]) {
				ctx.strokeStyle = "black";
				ctx.fillRect((x * cellSize) + i, (y * cellSize) + j, pixelSize, pixelSize);
			}
		}
	}
}

function updateScore() {
	/** updates output-box in html */
	const outputBox = document.getElementById("output-box");
	outputBox.innerHTML = "Score " + score + "<br>Top score " + topScore;
}

function updateTopScore() {
	/** saves to browser storage */
	if (score > topScore) {
		topScore = score;
		localStorage.setItem("topScore", topScore);
	}
	updateScore();
}

function gameOver() {
	/** game over state, game is paused, pressing a key restarts */
	isPaused = true;

	function keydownHandler(event) {
		document.removeEventListener("keydown", keydownHandler);
		isPaused = false;
		resetGame();
	}

	document.addEventListener("keydown", keydownHandler);
}

function resetGame() {
	/** initial conditions and top score */
	snake = [[2, 15], [1, 15], [0, 15]];
	direction = [1, 0];
	updateTopScore();
	score = 0;
	updateScore();
	placeOrb();
}

function gameLoop() {
	/** main loop */
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateSnake();
	drawSnake();
	drawOrb(orb[0], orb[1]);
}

/** event listener */
window.addEventListener("load", () => {
	/** loads top score from browser local storage */
	topScore = localStorage.getItem("topScore") || 0;
	updateScore();
})

document.addEventListener("keydown", e => {
	/** maps keys */
	switch (e.key.toLowerCase()) {
		case "arrowup":
			if (direction[1] === 0) {
				direction = [0, -1];
			}
			break;
		case "arrowright":
			if (direction[0] === 0) {
				direction = [1, 0];
			}
			break;
		case "arrowdown":
			if (direction[1] === 0) {
				direction = [0, 1];
			}
			break;
		case "arrowleft":
			if (direction[0] === 0) {
				direction = [-1, 0];
			}
			break;
		case "p":
			isPaused = !isPaused;
			break;
	}
});

/** init */
console.log("Thank you for playing my game.");
setInterval(gameLoop, 100);