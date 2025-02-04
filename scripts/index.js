import { QuestionFactory, QuestionManager, User } from "./system.js";
import { DOMManager } from "./dom-manager.js"; 

const card = document.querySelector("#card");
const questionContainer = card.querySelector("#question");
const choicesContainer = card.querySelector("#choices");
const answerContainer = card.querySelector("#answer");
const button = card.querySelector("#submitBtn");

const user = new User();
const questionManager = new QuestionManager();
const domManager = new DOMManager(user, questionManager, questionContainer, choicesContainer, answerContainer, button);

// Create the questions' instances from the question json file's data.
async function loadQuestions() {
    try {
        const response = await fetch('../scripts/questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        data.forEach(question => {
            questionManager.addQuestion(QuestionFactory.createQuestion(question.content, question.choices, question.correctAnswer, question.explanation));
        });
        console.log("Loading was successful \n");
    } 
    catch (error) {
        console.error("Error loading questions:", error);
    }
}

await loadQuestions();
domManager.startQuiz();