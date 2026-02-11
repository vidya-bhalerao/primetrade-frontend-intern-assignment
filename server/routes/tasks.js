const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

console.log("✅ task routes loaded");

// ================= CREATE TASK =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required ❌" });
    }

    const task = new Task({
      title,
      user: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating task ❌" });
  }
});

// ================= GET TASKS =================
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// ================= UPDATE TASK =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title: req.body.title },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found ❌" });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task ❌" });
  }
});

// ================= DELETE TASK =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found ❌" });
    }

    res.json({ message: "Task deleted ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting task ❌" });
  }
});

module.exports = router;
