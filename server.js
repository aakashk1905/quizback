const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");

const questionRoutes = require("./routes/questionRoutes");
const mongoose = require("mongoose");
const { initSocket } = require("./socket.js");
const Quiz = require("./models/quizModel.js");
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = initSocket(server);

const PORT = 4000;

const DB_URI = "mongodb+srv://upskillmafia:upskillmafia694@upskillmafia.vdegzfy.mongodb.net/";

mongoose.connect(DB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(bodyParser.json());

app.use("/api", questionRoutes);
app.post("/api/admin/next", async (req, res) => {
  try {
    const { current } = req.body;
    const quiz = await Quiz.findOne();
    quiz.current = current;
    await quiz.save();
    io.emit("newQuestion", current);

    res.json({
      success: true,
      current,
      message: "Question added successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = { server, io };
