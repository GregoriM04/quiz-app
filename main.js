//  Quiz questions
// const generalQuestions = [
//   {
//     question:
//       "In the &quot;Call Of Duty: Zombies&quot; map &quot;Moon&quot;, there is a secondary called the QED. What does QED stand for?",
//     answers: [
//       { option: "Portuguese", correct: false },
//       { option: "Spanish", correct: false },
//       { option: "English", correct: true },
//       { option: "Chinese", correct: false },
//       { option: "French", correct: false },
//     ],
//   },
//   {
//     question: "Which is the largest country in America?",
//     answers: [
//       { option: "Russia", correct: false },
//       { option: "United States", correct: false },
//       { option: "Mexico", correct: false },
//       { option: "Brazil", correct: false },
//       { option: "Canada", correct: true },
//     ],
//   },
//   {
//     question: "Which is the lasgest animal in the world?",
//     answers: [
//       { option: "Shark", correct: false },
//       { option: "Elephant", correct: false },
//       { option: "Giraffe", correct: false },
//       { option: "Blue whale", correct: true },
//       { option: "Rino", correct: false },
//     ],
//   },
//   {
//     question: "Which is the smallest coutry in the world?",
//     answers: [
//       { option: "Trinidad and Tobago", correct: false },
//       { option: "Puerto Rico", correct: false },
//       { option: "Vatican City", correct: true },
//       { option: "Austria", correct: false },
//       { option: "Nepal", correct: false },
//     ],
//   },
//   {
//     question: "Romania belongs to: ",
//     answers: [
//       { option: "America", correct: false },
//       { option: "Oceania", correct: false },
//       { option: "Africa", correct: false },
//       { option: "Asia", correct: false },
//       { option: "Europe", correct: true },
//     ],
//   },
// ];

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
      throw new Error("Ops! Something went wrong with the fetch");
    }

    const data = await response.json();

    // console.log(data.results[9]);

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

//   console.log(questionsFetched);


  allAnswers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer;
    button.classList.add("btn");
    answerButtons.appendChild(button);

    // console.log(button.innerText);

    // clicky event
    button.addEventListener("click", (e) => {
        const selectedBtn = e.target;

        if(selectedBtn.innerText === correctAnswer) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
        }

        // look and display the correct answer
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

// function selectAnswer(e) {
//   const selectedBtn = e.target;
//   const isCorrect = selectedBtn.dataset.correct === "true";
//   if (isCorrect) {
//     selectedBtn.classList.add("correct");
//     score++;
//   } else {
//     selectedBtn.classList.add("incorrect");
//   }

//   // look and display correct option
//   Array.from(answerButtons.children).forEach((button) => {
//     if (button.dataset.correct === "true") {
//       button.classList.add("correct");
//     }
//     button.disabled = true;
//   });
//   nextButton.style.display = "flex";
// }

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
