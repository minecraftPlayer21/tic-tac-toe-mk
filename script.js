var turn = "X";
var gameOver = false;
var gameMode = "human"; // Default to human
const cells = document.querySelectorAll(".cell");
var scores = { player1: 0, player2: 0 };

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
      winnerFound = true;
      updateScoreboard(); // Ensure scoreboard is updated with the correct labels and scores
      gameOver = true;

      // Highlight winning cells
      cells[a].classList.add("highlight");
      cells[b].classList.add("highlight");
      cells[c].classList.add("highlight");

      // Update status with win animation
      updateStatus(
        document.getElementById(winner === "player1" ? "player1" : "player2")
          .value + " wins!"
      );
      document.querySelector(".status").classList.add("win");
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
  updateStatus("Game in progress...");
  document.querySelector(".status").classList.remove("win");
}

function setGameMode(mode) {
  console.log("Setting game mode to:", mode); // Debug: log current mode
  gameMode = mode;
  resetGame(); // Ensure the game resets properly
  document.getElementById("modeHuman").classList.remove("selected");
  document.getElementById("modeAI").classList.remove("selected");

  // Reset scores
  scores = { player1: 0, player2: 0 };

  if (mode === "human") {
    document.getElementById("modeHuman").classList.add("selected");
    document.getElementById("player2").disabled = false;
    document.getElementById("player2").placeholder = "Enter name for Player 2";
    document.getElementById("player2").value = "";
  } else {
    document.getElementById("modeAI").classList.add("selected");
    document.getElementById("player2").disabled = true;
    document.getElementById("player2").value = "AI";
  }

  updateScoreboard(); // Ensure scoreboard is updated after resetting scores
  startGame(); // Call startGame to update the scoreboard based on the selected mode
}

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
  var player1Name = document.getElementById("player1").value || "Player 1";
  var score1 = document.getElementById("score1");
  var score2 = document.getElementById("score2");

  if (gameMode === "ai") {
    score1.textContent = player1Name + ": " + scores.player1;
    score2.textContent = "AI: " + scores.player2;
  } else {
    var player2Name = document.getElementById("player2").value || "Player 2";
    score1.textContent = player1Name + ": " + scores.player1;
    score2.textContent = player2Name + ": " + scores.player2;
  }

  // Animate the scoreboard update
  score1.style.animation = "scoreUpdate 0.3s";
  score2.style.animation = "scoreUpdate 0.3s";

  // Remove animation after it completes
  setTimeout(() => {
    score1.style.animation = "";
    score2.style.animation = "";
  }, 300);
}

// Modal functionality
var modal = document.getElementById("modal");
var modalText = document.getElementById("modal-text");
var closeModal = document.getElementsByClassName("close")[0];

closeModal.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("backgroundCanvas"),
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Particle system
const particleCount = 5000;
const particles = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  particlePositions[i] = (Math.random() - 0.5) * 1000;
}

particles.setAttribute(
  "position",
  new THREE.BufferAttribute(particlePositions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 2,
  sizeAttenuation: true,
});

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

camera.position.z = 200;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  particleSystem.rotation.x += 0.001;
  particleSystem.rotation.y += 0.002;

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
