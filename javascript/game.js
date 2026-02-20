/* HTML ELEMENTS */
const gameEl = document.getElementById("game");
const questionEl = document.getElementById("question");
const feedbackContainerEl = document.querySelector(".feedback-container");
const progressBarEl = document.querySelector(".progressBar");
const feedbackEl = document.querySelector(".feedback-text");
const choicesEl = document.querySelectorAll(".choice-text");
const questionCountEl = document.getElementById("questionCount");
const scoreEl = document.getElementsByClassName("score")[0];

// PROGRESSBAR CONSTANTS
const progressDelay = 3000
const intervalTime = 50
const progressbarWidthDelta = 100 / (progressDelay / intervalTime)

// QUIZ VARIABELEN
const bonusScore = 10
let currentQuestion = {};
let score = 0;
let questionIndex;
let nrOfTries = 0;
let acceptingAnswers = true;
let questions = [
   {
    "question": "Inside which HTML element do we put the JavaScript??",
    "answers": [
      "<script>",
      "<javascript>",
      "<js>",
      "<scripting>"
    ],
    "answer": 0
  },
  {
    "question": "What is the correct syntax for referring to an external script called 'xxx.js'?",
    "answers": [
      "<script href='xxx.js'>",
      "<script name='xxx.js'>",
      "<script src='xxx.js'>",
      "<script file='xxx.js'>"
    ],
    "answer": 2
  },
  {
    "question": " How do you write 'Hello World' in an alert box?",
    "answers": [
      "msgBox('Hello World');",
      "alertBox('Hello World');",
      "msg('Hello World');",
      "alert('Hello World');"
    ],
    "answer": 3
  }
];

/* TEXT CONSTANTS */
const TEXT_GAME_OVER = "Alle vragen zijn gesteld."
const TEXT_GOED_ANTWOORD = "GOED antwoord!"
const TEXT_FOUT_ANTWOORD = "Fout antwoord... Probeer opnieuw"
let availableQuestions = [ ...questions ];

// GAME LOGIC
const onAnswer = async (event) => {
  if(!acceptingAnswers) {
    return // als er nog geen antwoord geaccepteerd wordt, doe niks
  }

  nrOfTries++
  const choiceContainer = event.target.closest(".choice-container")
  if ( !choiceContainer ) {
    return // als er niet op een antwoord is geklikt, doe niks
  }
  
  const answer = Number(choiceContainer.dataset.answer)
  
  if(currentQuestion.answer === answer) {
    handleCorrectAnswer()
  } else {
    feedbackEl.textContent = TEXT_FOUT_ANTWOORD
  }
}

const startProgressBar = (onComplete) => {
  acceptingAnswers = false
  let progressbarWidth = 0
  const intervalId = setInterval(() => {
    // laat progressbar niet uit container lopen
    if ( progressbarWidth + progressbarWidthDelta <= 100 ) {
      progressbarWidth += progressbarWidthDelta
    } else {
      onComplete()
      clearInterval(intervalId)
    }
    
    progressBarEl.style.width = `${progressbarWidth}%`
  }, intervalTime
)
}

const handleCorrectAnswer = () => {
  score += nrOfTries === 1 ? bonusScore : 1 // meer punten als het antwoord in 1 keer goed is
  scoreEl.textContent = `Score: ${score}`
  feedbackEl.textContent = TEXT_GOED_ANTWOORD
  
  startProgressBar(() => {
    feedbackEl.textContent = ""
    nrOfTries = 0
    acceptingAnswers = true

    if ( availableQuestions.length === 0 ) {
      resetGame()
    } else {
      showNextQuestion()
    }
  })
}

const getNewQuestion = () => {
  questionIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions.splice(questionIndex,1)[0]
}

const showNextQuestion = () => {
  // haal een vraag op 
  currentQuestion = getNewQuestion()
  // toon de vraag
  questionEl.textContent = currentQuestion.question
  questionCountEl.textContent = `Vraag ${questions.length - availableQuestions.length} van ${questions.length}`
  // toon de antwoorden bij de vraag
  choicesEl.forEach((choiceEl, index) => {
    choiceEl.textContent = currentQuestion.answers[index]
  })
}

const resetGame = () => {
  feedbackContainerEl.textContent = TEXT_GAME_OVER
  availableQuestions = [ ...questions ];
  scoreEl.textContent = `Score: ${score}`;
}

// START SPEL
document.addEventListener('DOMContentLoaded', () => {
  progressBarEl.style.width = "0%";
  
  gameEl.addEventListener('click', onAnswer)
  showNextQuestion()
})