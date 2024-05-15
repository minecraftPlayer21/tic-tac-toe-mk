var turn = "X";
var gameOver = false;
var gameMode = "human"; // Default to human
const cells = document.querySelectorAll(".cell");

document.getElementById("modeHuman").addEventListener("click", function () {
  setGameMode("human");
});

document.getElementById("modeAI").addEventListener("click", function () {
  setGameMode("ai");
});

function nextMove(cell) {
  if (cell.innerHTML === "" && !gameOver) {
    cell.innerHTML = turn;
    checkForWinner();
    switchTurn();
  }
}

function switchTurn() {
  turn = turn === "X" ? "O" : "X";
  // Only call AI move if it is AI's turn and the game is not over
  if (gameMode === "ai" && turn === "O" && !gameOver) {
    setTimeout(aiMove, 500); // Delay AI move to simulate thinking delay
  }
}

function aiMove() {
  const availableCells = Array.from(cells).filter((c) => c.innerHTML === "");
  if (availableCells.length > 0) {
    const randomCell =
      availableCells[Math.floor(Math.random() * availableCells.length)];
    randomCell.innerHTML = turn;
    checkForWinner();
    // Only switch turns if the game is not over
    if (!gameOver) {
      switchTurn();
    }
  }
}
function updateStatus(message) {
  document.querySelector(".status").textContent = message;
}

function checkForWinner() {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let winnerFound = false;

  winCombinations.forEach((comb) => {
    const [a, b, c] = comb;
    if (
      cells[a].innerHTML &&
      cells[a].innerHTML === cells[b].innerHTML &&
      cells[a].innerHTML === cells[c].innerHTML
    ) {
      var winner = cells[a].innerHTML === "X" ? "player1" : "player2";
      alert(
        document.getElementById(winner === "player1" ? "player1" : "player2")
          .value + " wins!"
      );
      scores[winner]++;
      updateScoreboard();
      gameOver = true;
      winnerFound = true;
    }
  });

  if (
    !winnerFound &&
    Array.from(cells).every((cell) => cell.innerHTML !== "")
  ) {
    alert("It's a draw!");
    gameOver = true;
  }
}

function resetGame() {
  cells.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("highlight");
  });
  turn = "X";
  gameOver = false;
}

function setGameMode(mode) {
  console.log("Setting game mode to:", mode); // Debug: log current mode
  gameMode = mode;
  resetGame(); // Ensure the game resets properly
  document.getElementById("modeHuman").classList.remove("selected");
  document.getElementById("modeAI").classList.remove("selected");

  if (mode === "human") {
    document.getElementById("modeHuman").classList.add("selected");
  } else {
    document.getElementById("modeAI").classList.add("selected");
  }

  startGame(); // Call startGame to update the scoreboard based on the selected mode
}

var scores = { player1: 0, player2: 0 };

function startGame() {
  var player1Name = document.getElementById("player1").value || "Player 1";
  if (gameMode === "ai") {
    document.getElementById("score1").textContent =
      player1Name + ": " + scores.player1;
    document.getElementById("score2").textContent = "AI: " + scores.player2;
  } else {
    var player2Name = document.getElementById("player2").value || "Player 2";
    document.getElementById("score1").textContent =
      player1Name + ": " + scores.player1;
    document.getElementById("score2").textContent =
      player2Name + ": " + scores.player2;
  }
}

function updateScoreboard() {
  document.getElementById("score1").textContent =
    document.getElementById("player1").value + ": " + scores.player1;
  document.getElementById("score2").textContent =
    document.getElementById("player2").value + ": " + scores.player2;
}
