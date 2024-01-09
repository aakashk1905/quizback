const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  current: {
    type: Number,
    default: 0,
  },
  teams: [
    {
      teamName: {
        type: String,
        unique: true,
      },
      score: Number,
      teamEmails: [String],
      answers: [
        {
          qno: Number,
          ans: String,
        },
      ],
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
