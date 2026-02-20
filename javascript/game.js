/* HTML ELEMENTS */
const gameEl = document.getElementById("game");
const questionEl = document.getElementById("question");
const feedbackContainerEl = Array.from(document.getElementsByClassName("feedback-container"))[0];
const progressBarEl = Array.from(document.getElementsByClassName("progressBar"))[0];
const feedbackEl = Array.from(document.getElementsByClassName("feedback-text"))[0];
const choicesEl = Array.from(document.getElementsByClassName("choice-text"));
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
let availableQuestions = [];
let nrOfTries = 0;
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

availableQuestions = [ ...questions ];

// GAME LOGIC
const onAnswer = async (event) => {
  nrOfTries++
  // toon feedback
  const choiceContainer = event.target.closest(".choice-container")
  if(!choiceContainer) {return} // als er niet op een antwoord is geklikt, doe niks}
  const answer = Number(choiceContainer.dataset.answer)

  if(currentQuestion.answer === answer) {
    score += nrOfTries === 1 ? bonusScore : 1 // meer punten als het antwoord in 1 keer goed is
    scoreEl.textContent = `Score: ${score}`
    feedbackEl.textContent = TEXT_GOED_ANTWOORD
  } else {
    feedbackEl.textContent = TEXT_FOUT_ANTWOORD
  }

  if(currentQuestion.answer === answer) {
    let progressbarWidth = 0
    const intervalId = setInterval(() => {
      // laat progressbar niet uit container lopen
      if ( progressbarWidth + progressbarWidthDelta <= 100 ) {
        progressbarWidth += progressbarWidthDelta
      } else {
        progressbarWidth = 0
        feedbackEl.textContent = ""
        nrOfTries = 0
        clearInterval(intervalId)
      }
      
      if ( progressbarWidth === 0 ) {
        if ( availableQuestions.length === 0 ) {
          feedbackContainerEl.textContent = TEXT_GAME_OVER
        } else {
          showNextQuestion()
        }
      }
      progressBarEl.style.width = `${progressbarWidth}%`
    }, intervalTime
  )}
}
const startProgressBar = (onComplete) => {
}


const handleCorrectAnswer = () => {
    score += nrOfTries === 1 ? bonusScore : 1 // meer punten als het antwoord in 1 keer goed is
    scoreEl.textContent = `Score: ${score}`
    feedbackEl.textContent = TEXT_GOED_ANTWOORD
    startProgressBar
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


// START SPEL
document.addEventListener('DOMContentLoaded', () => {
  progressBarEl.style.width = "0%";
  
  gameEl.addEventListener('click', onAnswer)
  showNextQuestion()
})