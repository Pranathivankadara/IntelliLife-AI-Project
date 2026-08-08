const Task = require("../models/Task");


// Get Tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id
        });

        res.json(tasks);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Add Task
const addTask = async (req, res) => {
    try {
        const task = await Task.create({
            user: req.user.id,
            text: req.body.text
        });

        res.status(201).json(task);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Update Task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.text = req.body.text || task.text;
        task.done = req.body.done ?? task.done;

        await task.save();

        res.json(task);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Delete Task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await task.deleteOne();

        res.json({
            message: "Task Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getTasks,
    addTask,
    updateTask,
    deleteTask
};