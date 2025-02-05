import { loadQuestionsFromAPI } from "./index.js";

export class DOMManager {
    constructor(user, questionManager, questionContainer, choicesContainer, answerContainer, submitButton) {
        this.user = user;
        this.questionManager = questionManager;
        this.questionContainer = questionContainer;
        this.choicesContainer = choicesContainer;
        this.answerContainer = answerContainer;
        this.strong = answerContainer.querySelector("strong");
        this.explanationContainer = answerContainer.querySelector("#explanation");
        this.submitButton = submitButton;
        this.submitButton.setAttribute("data-type", "submit");

        this.buttonMapping = {
            "submit": () => this.submit(),
            "next": () => this.next(),
            "play-again": async () => { await loadQuestionsFromAPI(); this.startQuiz(); }
        };

        this.submitButton.addEventListener("click", this.manageButton.bind(this));
    }

    startQuiz() {
        this.questionContainer.style.placeSelf = "auto"; // THIS IS TEMPORARY AND WILL BE REMOVED ONCE THERE IS AN ACTUAL "GAME OVER" SCREEN!!!
        this.user.reset();
        // Useless now as the questions are randomized in the first place. Might be reused later.
        // this.questionManager.shuffleQuestions();
        this.questionManager.start(); // Pass "true" to shuffle.
        this.displayQuestion();
    }

    displayQuestion(question = this.questionManager.currentQuestion) {
        this.questionContainer.textContent = question.content;
        this.displayChoices(question);
        this.strong.textContent = "";
        this.explanationContainer.textContent = "";
        this.submitButton.value = "Submit";
        this.submitButton.setAttribute("data-type", "submit");
    }
    
    displayChoices(question) {
        const choices = [];
        this.choicesContainer.innerHTML = "";
        
        // Creates an array of choice divs.
        Object.entries(question.choices).forEach(([key, choice]) => {
            choices.push(this.createChoice(key, choice));
        });
        
        // Randomizes the order of choices.
        choices.sort(() => Math.random() - 0.5);
        choices.forEach(choice => this.choicesContainer.appendChild(choice));
    }
    
    createChoice(key, choice) {
        const div = document.createElement("div");
        
        // Input element
        const input = document.createElement("input");
        input.type = "radio";
        input.id = key;
        input.classList.add("choice");
        input.name = "choice";
        input.value = key;
        
        // Label element
        const label = document.createElement("label");
        label.id = key
        label.htmlFor = key;
        label.textContent = choice;
        
        div.appendChild(input);
        div.appendChild(label);
        
        return div;
    }
    
    /* Button Management */

    manageButton(e) {
        this.buttonMapping[this.submitButton.getAttribute("data-type")](e);
    }
    
    // Submit button
    submit() {
        const choice = this.choicesContainer.querySelector('input:checked');
        if (!choice) {
            this.alertChoose();
            return;
        }
        
        this.toggleChoices(true);
        const correct = this.questionManager.checkAnswer(choice.value);
        if (correct) {
            this.correct(choice);
        }
        else this.incorrect(choice);

        const explanation = this.questionManager.currentQuestion.explanation;
        if (explanation) this.explanationContainer.textContent = "Explanation: " + explanation;

        this.submitButton.value = "Next";
        this.submitButton.setAttribute("data-type", "next");
    }

    // Submit Helpers

    toggleChoices(disable = true) {
        Array.from(this.choicesContainer.querySelectorAll("input")).forEach(input => {
            input.disabled = disable;
        });
    }

    alertChoose() {
        alert("Choose an answer first!");
        
        // Some sort of feedback has to be added here (like the submit or radio buttons shaking)
    }

    correct(input) {
        input.classList.add("correct");
        this.strong.textContent = "Correct!";
        this.user.addPoints();
    }

    incorrect(input) {
        input.classList.add("incorrect");
        this.choicesContainer.querySelector(`input[value = "${this.questionManager.currentQuestion.correctAnswer}"]`).classList.add("correct");
        this.strong.textContent = "Correct answer: " + this.questionManager.getAnswerValue();

    }

    // Next button

    next() {
        if (this.questionManager.nextQuestion()) {
            this.displayQuestion();
        }
        else this.end();
    }

    end() {
        this.submitButton.value = "Play Again";
        this.submitButton.setAttribute("data-type", "play-again");

        // All of this will be modified once there is an actual "game over" screen".
        this.questionContainer.textContent = `You got ${this.user.points}/${this.questionManager.questions.length}`;
        this.choicesContainer.innerHTML = "";
        this.strong.textContent = "";
        let grading = (this.user.points > 5) ? "Good Job!":"Better Luck Next Time!";
        this.explanationContainer.innerHTML = `
                    ${grading}<br>
                    We Hope you had fun.<br>
                    Enjoy your stay.
        `;
        this.explanationContainer.style = "font-size: 24px; text-align: center;";
        this.questionContainer.style.placeSelf = "center";
    }
}
