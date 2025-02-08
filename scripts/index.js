export { loadQuestionsFromAPI };
import { QuestionFactory, QuestionManager, User } from "./system.js";
import { DOMManager } from "./dom-manager.js"; 

const card = document.querySelector("#card");
const questionContainer = card.querySelector("#question");
const questionIndicator = document.querySelector("#indicator");
const choicesContainer = card.querySelector("#choices");
const answerContainer = card.querySelector("#answer");
const button = card.querySelector("#submitBtn");

const user = new User();
const questionManager = new QuestionManager();
const domManager = new DOMManager(user, questionManager, questionContainer, choicesContainer, answerContainer, button, questionIndicator);

function decodeHTML(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}
  
async function loadQuestionsFromAPI() {
    const URL = "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple";
    
    try {
        questionManager.questions = [];
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        data.results.forEach(question => {
            questionManager.addQuestion(QuestionFactory.createQuestion(
                decodeHTML(question.question),
                {
                    "a": decodeHTML(question.correct_answer),
                    "b": decodeHTML(question.incorrect_answers[0]),
                    "c": decodeHTML(question.incorrect_answers[1]),
                    "d": decodeHTML(question.incorrect_answers[2]),
                },
                "a"
            ));
        });
        console.log("Successfully loaded from the API.");
    }
    catch(error) {
        console.log("From API: " + error);
        console.log("Resorting to the local JSON file...");
        questionManager.questions = [];
        await loadQuestionsFromJSON();
    }
}
  
// Create the questions' instances from the question json file's data.
async function loadQuestionsFromJSON() {
    try {
        const response = await fetch('../scripts/questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        data.sort(() => Math.random() - 0.5).slice(0, 10).forEach(question => {
            questionManager.addQuestion(QuestionFactory.createQuestion(question.content, question.choices, question.correctAnswer, question.explanation));
        });
        console.log("Loading from the local JSON file was successful \n");
    } 
    catch (error) {
        console.error("Error loading questions: ", error);
    }
}

await loadQuestionsFromAPI();
domManager.startQuiz();