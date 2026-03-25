import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillvalix';

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, required: true },
  questions: [{
    question: String,
    options: [String],
    correctOptionIndex: Number
  }],
  passingScore: { type: Number, default: 70 }
});

const pythonQuizData = {
  course: '72c9fd68ed2750d1d53d0e9e', // Python Course ID
  passingScore: 70,
  questions: [
    { question: "What is the correct syntax to output 'Hello World' in Python?", options: ["p('Hello World')", "print('Hello World')", "echo('Hello World')", "console.log('Hello World')"], correctOptionIndex: 1 },
    { question: "Which collection is ordered, changeable, and allows duplicate members?", options: ["SET", "DICTIONARY", "LIST", "TUPLE"], correctOptionIndex: 2 },
    { question: "How do you start a comment in Python?", options: ["//", "/*", "#", "--"], correctOptionIndex: 2 },
    { question: "Which keyword is used to create a function in Python?", options: ["function", "def", "fun", "create"], correctOptionIndex: 1 },
    { question: "How do you create a variable with the numeric value 5?", options: ["x = int(5)", "x = 5", "Both A and B", "Neither"], correctOptionIndex: 2 },
    { question: "What is the correct file extension for Python files?", options: [".py", ".pt", ".pyt", ".pyth"], correctOptionIndex: 0 },
    { question: "How do you create a list in Python?", options: ["[]", "{}", "()", "<>"], correctOptionIndex: 0 },
    { question: "Which method can be used to convert all characters to lowercase?", options: ["lower()", "down()", "casefold()", "A and C"], correctOptionIndex: 3 },
    { question: "How do you insert an item at a specific position in a list?", options: ["add()", "insert()", "append()", "put()"], correctOptionIndex: 1 },
    { question: "Which operator is used for exponentiation?", options: ["^", "**", "//", "%%"], correctOptionIndex: 1 },
    { question: "What is the output of 10 // 3?", options: ["3.33", "3", "4", "0"], correctOptionIndex: 1 },
    { question: "Which keyword is used for loops?", options: ["for", "while", "Both A and B", "loop"], correctOptionIndex: 2 },
    { question: "How do you check the type of a variable?", options: ["typeOf()", "check()", "type()", "kind()"], correctOptionIndex: 2 },
    { question: "Which collection is NOT allowed to have duplicate members?", options: ["List", "Tuple", "Set", "None of the above"], correctOptionIndex: 2 },
    { question: "How do you start a WHILE loop?", options: ["while x > y {", "while (x > y)", "while x > y:", "while x > y do:"], correctOptionIndex: 2 },
    { question: "What is a correct way to import a module?", options: ["import mymodule", "include mymodule", "require mymodule", "fetch mymodule"], correctOptionIndex: 0 },
    { question: "Which keyword is used to return a value from a function?", options: ["send", "output", "return", "exit"], correctOptionIndex: 2 },
    { question: "How do you create a dictionary?", options: ["[]", "{}", "()", "None"], correctOptionIndex: 1 },
    { question: "What is the output of bool(0)?", options: ["True", "False", "None", "Error"], correctOptionIndex: 1 },
    { question: "Which method removes an element from a set?", options: ["remove()", "discard()", "Both A and B", "pop()"], correctOptionIndex: 2 },
    { question: "How do you handle exceptions in Python?", options: ["try...except", "try...catch", "do...catch", "handle...error"], correctOptionIndex: 0 },
    { question: "What is 'self' in a Python class?", options: ["The parent class", "The current instance of the class", "A reserved keyword for functions", "None of the above"], correctOptionIndex: 1 },
    { question: "Which function is used to read input from a user?", options: ["read()", "get()", "input()", "prompt()"], correctOptionIndex: 2 },
    { question: "How do you find the length of a string?", options: ["len()", "count()", "length()", "size()"], correctOptionIndex: 0 },
    { question: "Which of these is a Python decorator?", options: ["@staticmethod", "@func", "@app.route", "A and C"], correctOptionIndex: 3 }
  ]
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    const Quiz = mongoose.model('Quiz', quizSchema);
    
    await Quiz.deleteMany({ course: pythonQuizData.course });
    const quiz = new Quiz(pythonQuizData);
    await quiz.save();
    
    console.log('✅ Python Quiz (25 Questions) seeded successfully in MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
