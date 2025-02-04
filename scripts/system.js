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
    constructor(questions = []) {
        this.questions = questions;
        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
    }

    addQuestion(question) {
        this.questions.push(question);
    }

    shuffleQuestions() {
        this.questions.sort(() => Math.random() - 0.5);
        this.currentQuestionIndex = 0;
        this.currentQuestion = this.questions[0];
    }

    checkAnswer(answer) {
        if (this.currentQuestion.correctAnswer === answer) return true;
        return false;
    }

    getAnswerValue(question = this.currentQuestion) {
        return question.choices[question.correctAnswer];
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            return false;
        }
        else {
            this.currentQuestion = this.questions[this.currentQuestionIndex];
            return true;
        }
    }

    reset() {
        this.questions = [];
        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
    }

    debugQuestions() {
        console.log(JSON.stringify(this.questions, null, 4));
    }
}

class QuestionFactory {
    static createQuestion(content, choices, correctAnswer, explanation) {
        return new Question(content, choices, correctAnswer, explanation);
    }
}

class Question {
    constructor(content, choices, correctAnswer, explanation) {
        this.content = content;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
    }
}