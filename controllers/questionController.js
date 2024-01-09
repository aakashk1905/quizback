const Question = require("../models/questionModel.js");
const Quiz = require("../models/quizModel.js");

exports.getQuestion = async (req, res) => {
  try {
    const currentQuestion = await Question.find();

    const quiz = await Quiz.findOne();
    const current = quiz.current;

    res.status(200).json({ currentQuestion, current });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.registerTeam = async (req, res) => {
  try {
    const { teamName, emails } = req.body;
    const team = {
      teamName: teamName,
      teamEmails: emails,
    };
    const quiz = await Quiz.findOne();
    if (!quiz.teams) quiz.teams = [];
    if (quiz.teams.some((team) => team.teamName === teamName))
      return res.status(400).json({
        success: false,
        message: "Team Name Already Taken Please Use Another Team Name",
      });
    quiz.teams.push(team);
    await quiz.save();

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.saveAns = async (req, res) => {
//   try {
//     const { teamName, ans, qno, correct } = req.body;

//     if (!teamName || !ans || !qno || !correct) {
//       return res.status(200).json({ success: true, message: "No data found" });
//     }
//     const quiz = await Quiz.findOne();

//     const team = quiz.teams.find((team) => team.teamName === teamName);

//     if (!team) {
//       return res.status(404).json({ message: "Team not found" });
//     }
//     if (!team.answers) team.answers = [];

//     if (team.answers.some((answ) => answ.qno === qno)) {
//       return res.status(200).json({
//         success: true,
//         quiz,
//         score: team.score,
//         message: "DoubleTime",
//       });
//     }

//     team.answers.push({
//       qno: qno,
//       ans: ans,
//     });

//     if (!team.score) team.score = 0;

//     if (correct === "true" || correct === true) {
//       team.score += 3;
//     } else {
//       team.score -= 1;
//     }

//     await quiz.save();
//     return res.status(200).json({
//       success: true,
//       quiz,
//       score: team.score,
//     });
//   } catch (error) {
//     console.error("Error in saveAns:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.saveAns = async (req, res) => {
//   try {
//     const { teamName, ans, qno, correct } = req.body;

//     if (!teamName || !ans || !qno || !correct) {
//       return res.status(400).json({ success: false, message: "Invalid data" });
//     }

//     const quiz = await Quiz.findOne({});

//     const updatedQuiz = await Quiz.findOneAndUpdate(
//       { "teams.teamName": teamName },
//       {
//         $addToSet: { "teams.$.answers": { qno, ans } },
//         $inc: { "teams.$.score": correct === "true" ? 3 : -1 },
//       },
//       { new: true }
//     );

//     if (!updatedQuiz) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Team not found" });
//     }

//     const updatedTeam = updatedQuiz.teams.find(
//       (team) => team.teamName === teamName
//     );

//     return res.status(200).json({
//       success: true,
//       quiz: updatedQuiz,
//       score: updatedTeam.score,
//     });
//   } catch (error) {
//     console.error("Error in saveAns:", error);
//     return res
//       .status(500)
//       .json({ success: false, error: "Internal Server Error" });
//   }
// };

exports.saveAns = async (req, res) => {
  try {
    const { teamName, ans, qno, correct } = req.body;

    if (!teamName || !ans || !qno || !correct) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const quiz = await Quiz.findOneAndUpdate({}, { new: true });
    const team = quiz.teams.find((t) => t.teamName === teamName);

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    if (team.answers.some((answ) => answ.qno === qno)) {
      return res.status(200).json({
        success: true,
        quiz,
        score: team.score,
        message: "DoubleTime",
      });
    }

    team.answers.push({
      qno,
      ans,
    });

    if (!team.score) team.score = 0;

    if (correct === "true" || correct === true) {
      team.score += 3;
    } else {
      team.score -= 1;
    }

    await quiz.save();

    return res.status(200).json({
      success: true,
      quiz,
      score: team.score,
    });
  } catch (error) {
    console.error("Error in saveAns:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
