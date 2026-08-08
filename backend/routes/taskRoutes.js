const express = require("express");
const router = express.Router();

const {
    getTasks,
    addTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, addTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;