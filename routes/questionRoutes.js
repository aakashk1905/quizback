const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/question", questionController.getQuestion);
router.post("/save", questionController.saveAns);
router.post("/register", questionController.registerTeam);

module.exports = router;
