const circle = document.getElementById("circle");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const gameContainer = document.querySelector(".game-container");
const bonusSound = document.getElementById("bonus-sound");
const wordHolder = document.getElementById("wordHolder");

const textContent = [
  '0', '1', '2', '1', '0',
  '1', '2', '4', '2', '1',
  '2', '4', '8', '4', '2',
  '1', '2', '4', '2', '1',
  '0', '1', '2', '1', '0',
];

const correctWords = [
  "Trust your instincts when you sense narcissistic behavior early.",
  "Look out for a partner who is overly self-centered or constantly demands attention.",
  "Be cautious if they always talk about themselves and disregard your feelings.",
  "Recognize the tendency to gaslight—narcissists often make you question your reality.",
  "Watch for inconsistency in their behavior. One moment they seem charming, the next cold and distant.",
  "Pay attention if they seem to have a lack of empathy toward others, especially in tough situations.",
  "Set clear boundaries and notice if they respect them. Narcissists will often push limits.",
  "If your partner is always looking for validation and admiration, it might be a red flag.",
  "A healthy relationship requires mutual respect, not just admiration of one person.",
  "Watch how they treat others in your social circle. Narcissists may belittle or manipulate people."
];

const incorrectWords = [
  "Always ignore your gut feelings in a relationship.",  // Gut feelings are often your best guide.
  "Accept constant criticism without questioning it.",  // Healthy relationships should be supportive.
  "Ignore your own needs and always prioritize their wants.",  // A relationship should be mutual, not one-sided.
  "Allow them to gaslight you into questioning your reality.",  // Gaslighting is emotional abuse.
  "Let them control your life and make decisions for you.",  // Healthy relationships require shared control.
  "Acknowledge every little thing they do as amazing, even if it's not.",  // Narcissists thrive on excessive praise.
  "If they talk negatively about others, dismiss it as nothing.",  // Constant negativity can be a sign of narcissism.
  "Overlook disrespectful behavior to avoid conflict.",  // Don't compromise your values for peace.
  "Ignore warning signs when their behavior is manipulative or self-centered.",  // Awareness is key to avoiding narcissistic relationships.
  "Believe everything they say without questioning, even if it doesn’t make sense.",  // Always trust your own judgment.
  "Let them belittle you in public and accept it as normal.",  // Public humiliation is a major red flag.
  "Let them isolate you from your friends and family for ‘your own good.’",  // Isolation is a classic narcissistic tactic.
  "Compromise your own emotional well-being for their ego.",  // A balanced relationship supports both partners' mental health.
  "Allow them to make you feel guilty without reason.",  // Narcissists often use guilt-tripping as manipulation.
  "Ignore your own self-worth and only focus on their achievements.",  // A relationship should elevate both partners.
  "Avoid setting boundaries because they might get upset.",  // Boundaries are necessary for a healthy relationship.
  "Give up on your personal goals just to accommodate them.",  // A relationship should support both partners' aspirations.
  "Let them manipulate you with charm and emotional blackmail.",  // Manipulation is never acceptable.
  "Believe their promises of change without seeing real actions.",  // Narcissists rarely change without genuine self-awareness.
  "Accept lies and dishonesty as part of the relationship.",  // Honesty is crucial for trust in any relationship.
  "Keep forgiving their repeated toxic behaviors in the name of love.",  // Toxic behavior shouldn't be tolerated.
  "Ignore red flags, thinking that things will get better over time.",  // Red flags are often signs to walk away early.
];


let currentWord = "";
let score = 0;
let awarded_15 = false;
let awarded_30 = false;
let awarded_60 = false;
let timeLeft = 120;
let gameInterval;
let timerInterval;
let bonusMessageVisible = false;
let lastClickedTextValue = 0;
const normalSize = 120;

// === INSTRUCTION OVERLAY TRIGGER ===
window.onload = () => {
  document.getElementById("instructionsOverlay").style.display = "flex";
};

// === CALLED ON OK BUTTON PRESS ===
function startGameWithOverlay() {
  document.getElementById("instructionsOverlay").style.display = "none";
  startGame();
}

function createGrid() {
  const grid = document.querySelector('.grid');
  grid.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const square = document.createElement('div');
    square.classList.add('square');

    const span = document.createElement('span');
    span.textContent = textContent[i];
    square.appendChild(span);

    square.addEventListener('click', function () {
      square.classList.add('clicked');
      lastClickedTextValue = parseInt(span.textContent);
    });

    grid.appendChild(square);
  }
}

function getRandomWord() {
  if (Math.random() < 0.5) {
    currentWord = correctWords[Math.floor(Math.random() * correctWords.length)];
  } else {
    currentWord = incorrectWords[Math.floor(Math.random() * incorrectWords.length)];
  }
  return currentWord;
}

function showBonusMessage(message, color) {
  if (bonusMessageVisible) return;
  bonusMessageVisible = true;

  const bonusMessage = document.createElement('div');
  bonusMessage.classList.add('bonus-message');
  bonusMessage.textContent = message;
  bonusMessage.style.color = color;
  document.body.appendChild(bonusMessage);

  setTimeout(() => {
    bonusMessage.remove();
    bonusMessageVisible = false;
  }, 3000);
}

function startGame() {
  createGrid();
  score = 0;
  timeLeft = 120;
  awarded_15 = false;
  awarded_30 = false;
  awarded_60 = false;

  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  restartBtn.style.display = "none";

  wordHolder.style.cursor = "pointer";
  wordHolder.style.pointerEvents = "auto";

  wordHolder.textContent = getRandomWord();
  wordHolder.onclick = handleWordClick;

  // === Word changes every 10 seconds ===
  gameInterval = setInterval(() => {
    currentWord = getRandomWord();
    wordHolder.textContent = currentWord;
  }, 10000);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  circle.style.display = "none";
  restartBtn.style.display = "inline-block";
  timerDisplay.textContent = `Game Over! Final Score: ${score}`;
}

function createFireworks() {
  const fireworksContainer = document.createElement("div");
  fireworksContainer.classList.add("fireworks");

  for (let i = 0; i < 10; i++) {
    const spark = document.createElement("div");
    spark.classList.add("firework-spark");
    const angle = Math.random() * 360;
    const distance = Math.random() * 50 + 50;
    const duration = Math.random() * 0.5 + 1;
    spark.style.animationDuration = `${duration}s`;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    spark.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

    fireworksContainer.appendChild(spark);
  }

  document.body.appendChild(fireworksContainer);

  setTimeout(() => {
    fireworksContainer.remove();
  }, 2000);
}

function checkScoreForFireworks() {
  if (score === 15 && !awarded_15) {
    createFireworks();
    showBonusMessage("TIME-BONUS! 15s", "gold");
    timeLeft += 15;
    awarded_15 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
  if (score === 30 && !awarded_30) {
    createFireworks();
    showBonusMessage("TIME-BONUS! 30s", "gold");
    timeLeft += 30;
    awarded_30 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
  if (score === 60 && !awarded_60) {
    createFireworks();
    showBonusMessage("TIME-BONUS! 60s", "gold");
    timeLeft += 60;
    awarded_60 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
}

function handleWordClick() {
  let hoverText = document.createElement("div");
  hoverText.classList.add("hover-feedback");

  const correctSound = document.getElementById("correct-sound");
  const clickSound = document.getElementById("click-sound");

  if (correctWords.includes(currentWord)) {
    score++;
    score += lastClickedTextValue;
    correctSound.currentTime = 0;
    correctSound.play();
    showBonusMessage("Correct!", "green");
    hoverText.textContent = "Good!";
    hoverText.style.color = "green";
  } else if (incorrectWords.includes(currentWord)) {
    score--;
    score -= lastClickedTextValue;
    clickSound.currentTime = 0;
    clickSound.play();
    showBonusMessage("Oops! That's a misspelling!", "red");
    hoverText.textContent = "Ouch!!!!";
    hoverText.style.color = "red";
  }

  const wordRect = wordHolder.getBoundingClientRect();
  hoverText.style.position = "absolute";
  hoverText.style.left = `${wordRect.left + wordRect.width / 2}px`;
  hoverText.style.top = `${wordRect.top - 20}px`;
  hoverText.style.transform = "translateX(-50%)";
  hoverText.style.fontWeight = "bold";
  hoverText.style.fontSize = "20px";
  hoverText.style.pointerEvents = "none";
  hoverText.style.zIndex = "1000";
  hoverText.style.transition = "opacity 1s ease-out, transform 1s ease-out";
  hoverText.style.opacity = "1";

  document.body.appendChild(hoverText);

  setTimeout(() => {
    hoverText.style.opacity = "0";
    hoverText.style.transform = "translateX(-50%) translateY(-30px)";
  }, 50);

  setTimeout(() => {
    hoverText.remove();
  }, 1000);

  scoreDisplay.textContent = `Score: ${score}`;
  checkScoreForFireworks();

  // Load next word immediately after click
  currentWord = getRandomWord();
  wordHolder.textContent = currentWord;
}

restartBtn.addEventListener("click", startGame);
