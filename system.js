export { QuestionManager, QuestionFactory, User };

class User {
    constructor() {
        this.points = 0;
    }

    addPoints(points = 1) {
        this.points += points;
    }

    reset() {
        this.points = 0;
    }
}

class QuestionManager {
    constructor(user, questions = []) {
        this.questions = questions;
        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
        this.user = user;
    }

    startQuiz() {
        this.shuffleQuestions();
        this.displayQuestion();
    }

    addQuestion(question) {
        this.questions.push(question);
    }

    displayQuestion(question = this.currentQuestion) {
        console.log(question.title);
        console.log(question.content);
        this.displayChoices(question);
        this.promptAnswer();   
    }

    displayChoices(question) {
        Object.entries(question.choices).forEach(([choiceKey, choice]) => {
            this.displayChoice(choiceKey, choice);
        })
    }

    displayChoice(choiceKey, choice) {
        console.log(`${choiceKey}) ${choice}`);
    }

    shuffleQuestions() {
        this.questions.sort(() => Math.random() - 0.5);
        this.currentQuestionIndex = 0;
        this.currentQuestion = this.questions[0];
    }

    promptAnswer() {
        const answer = prompt();
        if (!prompt) this.endQuiz();
        else this.checkAnswer(answer);
    }

    checkAnswer(answer) {
        if (this.currentQuestion.correctAnswer === answer) this.win();
        else this.lose();
        console.log("------------");
        
        this.nextQuestion();
    }
    
    win() {
        console.log("Correct!");
        this.user.addPoints()
        console.log(this.currentQuestion.explanation);
    }
    
    lose() {
        console.log("Incorrect!");
        console.log(this.currentQuestion.explanation);
    }
    
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endQuiz();
        }
        else {
            this.currentQuestion = this.questions[this.currentQuestionIndex];
            this.displayQuestion();
        }
    }

    endQuiz() {
        console.log(`You got ${this.user.points}/${this.questions.length}`);
        this.user.reset();
    }

    debugQuestions() {
        console.log(JSON.stringify(this.questions, null, 4));
    }
}

class QuestionFactory {
    static createQuestion(title, content, choices, correctAnswer, explanation) {
        return new Question(title, content, choices, correctAnswer, explanation);
    }
}

class Question {
    constructor(title, content, choices, correctAnswer, explanation) {
        this.title = title;
        this.content = content;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
    }
}