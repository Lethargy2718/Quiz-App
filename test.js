class question {
    constructor(body, answer, a, b, c, d){
        this.body = body;
        this.answer = answer;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
}

q1 = new question("How are you?", "Whatever you say", "Whatever you say", "Null", "Nonya business", "No");
q2 = new question("Howdy?", "same as before", "None", "No answer", "same as before", "What?");
q3 = new question("Wow?", "Dunno", "What?", "Dunno", "Ok", "Wow");

let questions = [q1, q2, q3];

function nextQuestion() {
    const display = document.getElementById('question');
    const answer = document.getElementById('answer');
    let num = Math.floor(Math.random() * questions.length);
    display.textContent = questions[num].body;
    
}