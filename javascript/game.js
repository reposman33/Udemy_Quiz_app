export class QuizGame {

  constructor() {
    /* HTML ELEMENTS */
    this.gameEl = document.getElementById("game");
    this.questionEl = document.getElementById("question");
    this.feedbackContainerEl = document.querySelector(".feedback-container");
    this.progressBarEl = document.querySelector(".progressBar");
    this.feedbackEl = document.querySelector(".feedback-text");
    this.choicesEl = document.querySelectorAll(".choice-text");
    this.questionCountEl = document.getElementById("questionCount");
    this.scoreEl = document.getElementsByClassName("score")[0];

    // PROGRESSBAR CONSTANTS
    this.progressDelay = 3000
    this.intervalTime = 50
    this.progressbarWidthDelta = 100 / (this.progressDelay / this.intervalTime)

    // QUIZ VARIABELEN
    this.bonusScore = 10
    this.currentQuestion = {};
    this.score = 0;
    this.questionIndex;
    this.nrOfTries = 0;
    this.acceptingAnswers = true;
    this.questions = [];

    /* TEXT CONSTANTS */
    this.TEXT_GAME_OVER = "Alle vragen zijn gesteld."
    this.TEXT_GOED_ANTWOORD = "GOED antwoord!"
    this.TEXT_FOUT_ANTWOORD = "Fout antwoord... Probeer opnieuw"

    this.init()

  }

  init() {
    this.initQuestions()
    this.showNextQuestion()
    this.gameEl.addEventListener('click', (event) => this.onAnswer(event))
  }

  initQuestions() {
    this.questions = [
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

    this.availableQuestions = [ ...this.questions ];
  }


  // GAME LOGIC
  onAnswer (event) {
    
    const choiceContainer = event.target.closest(".choice-container")
    if(!choiceContainer || !this.acceptingAnswers) {
      return // als er nog geen antwoord geaccepteerd wordt, doe niks
    }
    
    const answer = Number(choiceContainer.dataset.answer)
    this.processAnswer(answer)  
  }

  processAnswer(answer) {
    this.nrOfTries++
    
    if(this.currentQuestion.answer === answer) {
      this.handleCorrectAnswer()
    } else {
      this.feedbackEl.textContent = this.TEXT_FOUT_ANTWOORD
    }
  }

  handleCorrectAnswer() {
    this.acceptingAnswers = false
    this.score += this.nrOfTries === 1 ? this.bonusScore : 1 // meer punten als het antwoord in 1 keer goed is
    this.scoreEl.textContent = `Score: ${this.score}`
    this.feedbackEl.textContent = this.TEXT_GOED_ANTWOORD
    
    this.startProgressBar(() => {
      this.nrOfTries = 0
      this.feedbackEl.textContent = ""
      this.acceptingAnswers = true
      this.showNextQuestion()
    })
  }

  startProgressBar(onComplete) {
    let progressbarWidth = 0
    const intervalId = setInterval(() => {
      // laat progressbar niet uit container lopen
      if ( progressbarWidth + this.progressbarWidthDelta <= 100 ) {
        progressbarWidth += this.progressbarWidthDelta
      } else {
        onComplete()
        clearInterval(intervalId)
      }

        this.progressBarEl.style.width = `${progressbarWidth}%`
      }, this.intervalTime
    )
  }

  getNewQuestion(){
    if(this.availableQuestions.length === 0) {
      return null
    }
    this.questionIndex = Math.floor(Math.random() * this.availableQuestions.length);
    return this.availableQuestions.splice(this.questionIndex,1)[0]
  }

  showNextQuestion() {
    // haal een vraag op 
    this.currentQuestion = this.getNewQuestion()
    if ( !this.currentQuestion ) {
      this.resetGame()
      return 
    }

    // toon de vraag
    this.questionEl.textContent = this.currentQuestion.question
    this.questionCountEl.textContent = `Vraag ${this.questions.length - this.availableQuestions.length} van ${this.questions.length}`
    // toon de antwoorden bij de vraag
    this.choicesEl.forEach((choiceEl, index) => {
      choiceEl.textContent = this.currentQuestion.answers[index]
    })
  }

  resetGame() {
    this.feedbackContainerEl.textContent = this.TEXT_GAME_OVER
    this.availableQuestions = [ ...this.questions ];
    this.scoreEl.textContent = `Score: ${this.score}`;
    this.progressBarEl.style.width = "0%";
  }

}

document.addEventListener("DOMContentLoaded", () => {
  new QuizGame();
});
