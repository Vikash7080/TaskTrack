const express = require("express");
const Task = require("../models/task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

/*
 GET ALL TASKS
*/
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.session.userId,
    }).sort({ order: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
 CREATE TASK
*/
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description = "",
      dueDate = null,
      dueTime = "",
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const taskCount = await Task.countDocuments({
      user: req.session.userId,
    });

    const task = await Task.create({
      title: title.trim(),
      description,
      dueDate,
      dueTime,
      order: taskCount,
      user: req.session.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
 REORDER TASKS
*/
router.put("/reorder", async (req, res) => {
  try {
    const { tasks } = req.body;

    for (let i = 0; i < tasks.length; i++) {
      await Task.findOneAndUpdate(
        {
          _id: tasks[i]._id,
          user: req.session.userId,
        },
        {
          order: i,
        }
      );
    }

    res.status(200).json({
      message: "Tasks reordered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
 UPDATE TASK
*/
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.session.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
 TOGGLE COMPLETE
*/
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.completed = !task.completed;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
 TOGGLE IMPORTANT
*/
router.patch("/:id/important", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.important = !task.important;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
 DELETE TASK
*/
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;