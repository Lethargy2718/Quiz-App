import { QuestionFactory, QuestionManager, User } from "./system.js";

const user = new User();
const questionManager = new QuestionManager(user);

// Create the questions' instances from the question json file's data.
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        data.forEach(question => {
            questionManager.addQuestion(QuestionFactory.createQuestion(question.title, question.content, question.choices, question.correctAnswer, question.explanation));
        });
        console.log("Loading was successful \n");
    } 
    catch (error) {
        console.error("Error loading questions:", error);
    }
}

await loadQuestions();
questionManager.startQuiz();