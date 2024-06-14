/** global */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/** bottom left */
let snake = [[2, 47], [1, 47], [0, 47]];
let direction = [1, 0]
let orb = [
	Math.floor(Math.random() * canvas.width),
	Math.floor(Math.random() * canvas.height)
]
let isPaused = false;

/** functions */
function drawCell(x, y) {
	ctx.fillRect(x, y, 1, 1);
}

function placeOrb() {
	orb = [
		Math.floor(Math.random() * canvas.width),
		Math.floor(Math.random() * canvas.height)
	];
}

function updateSnake() {
	if (!isPaused) {
		const newHead = [
			snake[0][0] + direction[0],
			snake[0][1] + direction[1]
		];
	
		snake.unshift(newHead);
		if (newHead[0] === orb[0] && newHead[1] === orb[1]) {
			placeOrb();
		} else {
			snake.pop();
		}
	
		if (newHead[0] < 0 || newHead[0] >= canvas.width || newHead[1] < 0 || newHead[1] >= canvas.height) {
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
	snake.forEach(segment => drawCell(segment[0], segment[1]));
}
function drawOrb() {
	drawCell(orb[0], orb[1]);
}

function gameOver() {
	isPaused = true;

	function keydownHandler(event) {
		document.removeEventListener("keydown", keydownHandler);
		isPaused = false;
		resetGame();
	}

	document.addEventListener("keydown", keydownHandler);
}

function resetGame() {
	snake = [[2, 47], [1, 47], [0, 47]];
	direction = [1, 0];
	placeOrb();
}

function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateSnake();
	drawSnake();
	drawOrb();
}

/** event listener */
document.addEventListener("keydown", e => {
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