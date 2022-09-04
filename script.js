/* Variable */
const URL = "https://raw.githubusercontent.com/aaronnech/Who-Wants-to-Be-a-Millionaire/master/questions.json";
let timer = document.querySelector('.timer');
let btnBox = Array.from(document.querySelectorAll('.answer-btn'));
let answerBox = Array.from(document.querySelectorAll('.answer'));
let question = document.querySelector('.question');
let questionContainer = document.querySelector('.question-container');
let answersContainer = document.getElementById("answer-container");
let progressContainer = document.querySelector('.progress-container');
let nextQuestionContainer = document.querySelector('.next-question');
let gameStatusContainer = document.querySelector('.game-status');
let pointsContainer = document.querySelector('.point-container');
let secondGuessBtn = document.querySelector(".second-chance");
let fiftyFiftyBtn = document.querySelector(".fifty-fifty");
let modalContainer = document.querySelector('.modal');
let info_box = document.querySelector(".info_box");
let start_btn = document.querySelector(".start_btn");
let exit_btn = document.querySelector(".quit");
let continue_btn = document.querySelector(".continue");
let next_btn = document.querySelector('.next-btn');
let startAgainBtn = document.querySelector('.start-again');
let withdrawBtn = document.querySelector('.withdraw');


// selecting audio files
const letsPlayAudio = document.getElementById("lets-play");
const easyAudio = document.getElementById("easy");
const wrongAnswerAudio = document.getElementById("wrong-answer");
const correctAnswerAudio = document.getElementById("correct-answer");

let auth = [
  'Dale Carnegie',
  'Leonardo da Vinci',
  'Thomas Jefferson',
  'Henry Ford',
  'Dwayne Johnson',
  'Marva Collins',
  'Thomas Edison',
  'Stephen Hawking',
  'George S. Patton',
  'Richard Branson',
  'Winston Churchill',
  'Michael Jordan'
];
let quote = [
  'Develop success from failures. Discouragement and failure are two of the surest stepping stones to success.',
  'Learning is the only thing the mind never exhausts, never fears, and never regrets.',
  'I find that the harder I work, the more luck I seem to have.',
  'Failure is the opportunity to begin again more intelligently.',
  "Success isn't overnight. It's when every day you get a little better than the day before. It all adds up.",
  "Success doesn't come to you, you go to it.",
  "Many of life's failures are people who did not realize how close they were to success when they gave up.",
  'Work gives you meaning and purpose and life is empty without it.',
  "I don't measure a man's success by how high he climbs, but how high he bounces when he hits the bottom.",
  "You don't learn to walk by following rules. You learn by doing, and falling over.",
  "If you're going through hell, keep going.",
  "I've failed over and over and over again in my life. And that is why I succeed."
];

let gameOn = false;
let timesToGuess = 1;
let correctAnswer;
let currentTime;
// Variables for the randomQuestionGenerator();
let data;
let currentQuestion = {};
let randomGameNum = 0;
let randomQuestionNum = 0;
let questionsAsked = [];
let timeoutId;
let intervalId;
let points = 0;


let randomQuote = 0;

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 15;
const ALERT_THRESHOLD = 10;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 40;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

function onTimesUp() {
  clearInterval(timerInterval);
};

const resetTimer = () => {
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  const { alert, warning, info } = COLOR_CODES;
  document.getElementById("base-timer-path-remaining").removeAttribute("stroke-dasharray");
  document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
  document.getElementById("base-timer-path-remaining").classList.remove(alert.color);
  document.getElementById("base-timer-path-remaining").classList.add(info.color);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      gameOver(timeLeft);
    }
  }, 1000);
};

function formatTime(time) {
  let seconds = time % 60;
  return seconds;
};

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  } else if (timeLeft > warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
  }
};

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
};

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
};

/* Functions */
const randomNumHelperFunc = num => Math.floor(Math.random() * num);

const dataLoad = async () => {
  data = await fetch(URL).then(res => res.json());
};

const randomQuestionGenerator = () => {
  randomGameNum = randomNumHelperFunc(4);
  randomQuestionNum = randomNumHelperFunc(15);

  const questionAlreadyAsked = questionsAsked.findIndex(item => item[randomGameNum] === randomQuestionNum) === -1;

  if (questionAlreadyAsked) {
    currentQuestion[randomGameNum] = randomQuestionNum;
    questionsAsked.push(currentQuestion);
    currentQuestion = {};
  } else {
    randomQuestionGenerator();
  }
};

const startTimerMusic = () => {
  resetTimer();
  startTimer();
  // start audio
  letsPlayAudio.play();
  letsPlayAudio.volume = 0.3;
  timeoutId = setTimeout(() => {
    easyAudio.play();
    easyAudio.volume = 0.3;
  }, 4000);
};

const stopTimerMusic = () => {
  clearTimeout(timeoutId);
  clearInterval(timerInterval);
  letsPlayAudio.pause();
  letsPlayAudio.currentTime = 0;
  easyAudio.pause();
  easyAudio.currentTime = 0;
  wrongAnswerAudio.pause();
  wrongAnswerAudio.currentTime = 0;
  correctAnswerAudio.pause();
  correctAnswerAudio.currentTime = 0;
};

const resetBtn = () => {
  fiftyFiftyBtn.disabled = false;
  secondGuessBtn.disabled = false;
  withdrawBtn.disabled = false;
}

const gameOver = (index) => {
  if (index <= 0) {
    // Reset everything!!!
    gameOn = false;
    onTimesUp();
    resetTimer();
    resetProgress();
    points = 0;

    // stopping audio
    // stopTimerMusic();

    // Random Quotes
    let difference = 11 - 0;  // have 12 quotes so max is 11, min is 0 (started)
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + 0;

    nextQuestionContainer.classList.remove("hidden");
    gameStatusContainer.classList.remove("hidden");
    pointsContainer.classList.remove('hidden');
    question.classList.add("hidden");
    gameStatusContainer.textContent = "Game Over";
    pointsContainer.innerHTML = ` "${quote[rand]}" <br/> -${auth[rand]}-`;
    next_btn.textContent = "START AGAIN";
    next_btn.classList.remove('border-green-500');
    next_btn.classList.remove('bg-green-600');
    next_btn.classList.remove('hover:bg-green-700');
    next_btn.classList.add('border-blue-500');
    next_btn.classList.add('bg-blue-600');
    next_btn.classList.add('hover:bg-blue-700');
    next_btn.classList.add('pr-3');
    console.log('Game Over');
  }
};

const updateProgress = (index) => {
  document.getElementById(`point-${index}`).disabled = true;
}

const resetProgress = () => {
  let progressArr = Array.from(document.querySelectorAll('.progress-btn'));
  progressArr.forEach(progressBtn => {
    progressBtn.disabled = false;
  });
}

const correctAnswerFunc = () => {
  points += 1;
  gameOver(999);
  // stopTimerMusic();
  nextQuestionContainer.classList.remove("hidden");
  gameStatusContainer.classList.remove("hidden");
  pointsContainer.classList.remove('hidden');
  if (points < 12) {
    question.classList.add("hidden");
    gameStatusContainer.textContent = "CORRECT";
    pointsContainer.textContent = `You have earned $ ${points}00`;
  } else {
    gameStatusContainer.innerHTML =
      `CONGRATULATIONS! <br/> You've become a Millionaire!`;
    pointsContainer.textContent = `You have earned $ ${points}00`;
    next_btn.textContent = "RESTART";
  }
  updateProgress(points);
};

const fiftyFiftyGenerator = num => {
  let randomFirst;
  let randomSecond;
  // Generate first random number
  randomFirst = randomNumHelperFunc(4);
  while (randomFirst === num) {
    randomFirst = randomNumHelperFunc(4);
  }

  randomSecond = randomNumHelperFunc(4);
  while (randomSecond === randomFirst || randomSecond === num) {
    randomSecond = randomNumHelperFunc(4);
  }
  // hide two wrong answers
  answerBox[randomFirst].textContent = '';
  answerBox[randomSecond].textContent = '';
  btnBox[randomFirst].classList.remove('hover:bg-[#fcb150]');
  btnBox[randomSecond].classList.remove('hover:bg-[#fcb150]');
  btnBox[randomFirst].classList.remove('cursor-pointer');
  btnBox[randomSecond].classList.remove('cursor-pointer');
  btnBox[randomFirst].classList.add('cursor-not-allowed');
  btnBox[randomSecond].classList.add('cursor-not-allowed');
};

const showQuestion = () => {
  gameOn = true;
  startTimerMusic();
  removePreviousClass();
  let answers = "";
  randomQuestionGenerator();

  // correctAnswer = "";
  correctAnswer =
    data["games"][randomGameNum]["questions"][randomQuestionNum]["correct"];
  // console.log(correctAnswer);

  switch (correctAnswer) {
    case 0:
      console.log("A");
      break;
    case 1:
      console.log("B");
      break;
    case 2:
      console.log("C");
      break;
    case 3:
      console.log("D");
      break;
  }

  questionList =
    data["games"][randomGameNum]["questions"][randomQuestionNum]["content"];
  // console.log(questionList);

  questionList.forEach((item, index) => {
    answerBox[index].textContent = item;
    btnBox[index].setAttribute('id', index);
  })

  questionContainer.textContent =
    data["games"][randomGameNum]["questions"][randomQuestionNum]["question"];
};

/* remove hover effect */
const removeClass = () => {
  btnBox.forEach(btn => {
    btn.classList.remove("hover:bg-[#fcb150]");
  })
};

const removePreviousClass = () => {
  btnBox.forEach(btn => {
    btn.classList.remove("bg-[#11a8ab]");
    btn.classList.remove("bg-[#e64c65]");
    btn.classList.add("hover:bg-[#fcb150]");
    btn.classList.remove('cursor-not-allowed');
    btn.classList.remove('cursor-not-allowed');
    btn.classList.add('cursor-pointer');
    btn.classList.add('cursor-pointer');
  })
}

// Event Listeners
window.addEventListener("load", async () => {
  await dataLoad();
});

fiftyFiftyBtn.onclick = () => {
  fiftyFiftyGenerator(correctAnswer);
  fiftyFiftyBtn.disabled = true;
  return fiftyFiftyOn = true;
}

secondGuessBtn.onclick = () => {
  // hide the x2 button
  secondGuessBtn.disabled = true;
  // change let timesToGuess to 2
  return timesToGuess = 2;
};

answersContainer.onclick = (e) => {
  let index = parseInt(e.target.id, 10);
  // console.log('index: ', index);
  removeClass();
  if (index === correctAnswer) {
    // console.log('[Correct]  index: ', index);
    btnBox[index].classList.add("bg-[#11a8ab]");
    timesToGuess = 1;  // reset timeToGuess in case secondChance func is on
    stopTimerMusic();
    correctAnswerAudio.play();
    correctAnswerAudio.volume = 0.3;
    setTimeout(() => {
      correctAnswerFunc();
    }, 2000)
  }
  else {
    // console.log('[Wrong]  index: ', index);
    btnBox[index].classList.add("bg-[#e64c65]");
    if (timesToGuess === 1) {
      btnBox[correctAnswer].classList.add("bg-[#11a8ab]");
    }
    if (index !== NaN) {
      timesToGuess -= 1;
    }
    if (timesToGuess <= 0) {
      stopTimerMusic();
      wrongAnswerAudio.play();
      wrongAnswerAudio.volume = 0.3;
      setTimeout(() => {
        gameOver(timesToGuess);
      }, 3000)
    }
  }
};

const restartGame = () => {
  timesToGuess = 1;
  points = 0;
  removePreviousClass();
  resetBtn();
  resetTimer();
  showQuestion();
}

const withdrawFunc = () => {
  gameOver(999);
  setTimeout(() => {
    nextQuestionContainer.classList.remove("hidden");
    gameStatusContainer.classList.remove("hidden");
    pointsContainer.classList.remove('hidden');
    question.classList.add("hidden");
    gameStatusContainer.textContent = "Thanks for Playing!";
    pointsContainer.textContent = '';
    next_btn.textContent = "START AGAIN";
    next_btn.classList.remove('border-green-500');
    next_btn.classList.remove('bg-green-600');
    next_btn.classList.remove('hover:bg-green-700');
    next_btn.classList.add('border-blue-500');
    next_btn.classList.add('bg-blue-600');
    next_btn.classList.add('hover:bg-blue-700');
    next_btn.classList.add('pr-3');

    if (points < 12) {
      if (points > 8) {
        pointsContainer.textContent = '';
        pointsContainer.innerHTML = 'Your reward is $ 900';
        return points = 0;
      }
      if (points > 2) {
        pointsContainer.textContent = '';
        pointsContainer.innerHTML = 'Your reward is $ 300';
        return points = 0;
      }
      if (points < 3) {
        let difference = 11 - 0;  // have 12 quotes so max is 11, min is 0 (started)
        let rand = Math.random();
        rand = Math.floor(rand * difference);
        rand = rand + 0;

        pointsContainer.textContent = '';
        pointsContainer.innerHTML = ` "${quote[rand]}" <br/> -${auth[rand]}-`;
        return points = 0;
      }
    }
  }, 2500);
}

withdrawBtn.onclick = () => {
  gameOn = false;
  withdrawBtn.disabled = true;
  stopTimerMusic();
  letsPlayAudio.play();
  letsPlayAudio.volume = 0.3;
  withdrawFunc();
  onTimesUp();
  resetTimer();
  resetProgress();
}

// if startQuiz button clicked
start_btn.onclick = () => {
  info_box.classList.add("activeInfo"); //show info box
}

// if exitQuiz button clicked
exit_btn.onclick = () => {
  info_box.classList.remove("activeInfo"); //hide info box
}

// if continueQuiz button clicked
continue_btn.onclick = () => {
  info_box.classList.remove("activeInfo"); //hide info box
  modalContainer.classList.add("hidden");
  question.classList.remove("hidden");
  showQuestion();
}

// if nextQuestion button clicked
next_btn.onclick = () => {
  question.classList.remove("hidden");
  nextQuestionContainer.classList.add("hidden");
  gameStatusContainer.classList.add("hidden");
  pointsContainer.classList.add('hidden');
  next_btn.textContent = 'Continue';
  next_btn.classList.add('border-green-500');
  next_btn.classList.add('bg-green-600');
  next_btn.classList.add('hover:bg-green-700');
  next_btn.classList.remove('border-blue-500');
  next_btn.classList.remove('bg-blue-600');
  next_btn.classList.remove('hover:bg-blue-700');
  next_btn.classList.remove('pr-3');
  if (gameOn === false) {
    restartGame();
  } else {
    removePreviousClass();
    resetTimer();
    showQuestion();
  }
}
