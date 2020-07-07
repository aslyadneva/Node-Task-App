const express = require("express");
const router = new express.Router();
const Task = "../models/task";

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send();
  }
});

router.get("/tasks", async (req, res) => {
  try {
    // fetches ALL tasks stored in the db
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", async (req, res) => {
  // req.params is an object containing all route parameters that were provided in the request
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

// Updating a task by id
router.patch("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body); // evaluates to ex. [ 'description', 'completed' ]
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every((attemptedUpdate) =>
    allowedUpdates.includes(attemptedUpdate)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid property update" });
  }

  try {
    const task = await Task.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (err) {
    // handling validation error
    res.status(400).send(err);
  }
});

// Deleting a task by id
router.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
