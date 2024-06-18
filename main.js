//  Quiz - main functionality
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-btn");
const nextButton = document.getElementById("next-btn");
let nextButtonIcon = document.createElement("ion-icon");

let currentQuestionIndex = 0;
let score = 0;

// fetching questions and answers
const questionsFetched = [];
(async function () {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple"
    );

    if (!response.ok) {
      questionElement.innerHTML = "Ops! Something went wrong. Reload the page!";
    }

    const data = await response.json();

    // load data in once global array
    data.results.forEach((result) => {
      questionsFetched.push(result);
    });
  } catch (error) {
    console.error("Error fetching data", error);
  }
})();

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  nextButtonIcon.setAttribute("name", "chevron-forward-outline");
  nextButton.appendChild(nextButtonIcon);
  showQuestion();
}

function showQuestion() {
  // remove previous answer options
  resetState();

  // load and display the current question
  let currentQuestion = questionsFetched[currentQuestionIndex].question;
  let questionNumber = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNumber + ".) " + currentQuestion;

  // load and display answers
  let allAnswers = [];
  let correctAnswer = questionsFetched[currentQuestionIndex].correct_answer;
  let otherAnswers = questionsFetched[currentQuestionIndex].incorrect_answers;

  allAnswers = otherAnswers.slice();
  allAnswers.push(correctAnswer);

  allAnswers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer;
    button.classList.add("btn");
    answerButtons.appendChild(button);

    // clicky event
    button.addEventListener("click", (e) => {
      const selectedBtn = e.target;

      if (selectedBtn.innerText === correctAnswer) {
        selectedBtn.classList.add("correct");
        score++;
      } else {
        selectedBtn.classList.add("incorrect");
      }

      // look and display the correct answer when wrong is selected
      Array.from(answerButtons.children).forEach((button) => {
        if (button.innerText === correctAnswer) {
          button.classList.add("correct");
        }
        button.disabled = true;
      });
      nextButton.style.display = "flex";
    });
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function showScore() {
  resetState();

  questionElement.innerHTML = `You get ${score} out of ${questionsFetched.length}!`;
  nextButton.innerHTML = "Play Again";
  nextButtonIcon.setAttribute("name", "play");
  nextButton.appendChild(nextButtonIcon);
  nextButton.style.display = "flex";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questionsFetched.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questionsFetched.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

setTimeout(() => {
  startQuiz();
}, 500);
