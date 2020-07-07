const express = require("express");
// this line runs and connects to db
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

// parses incomeing json data into an object accessible on req.body
app.use(express.json());

// Creating a user
app.post("/users", async (req, res) => {
  const user = new User(req.body);

  // Promise syntax
  // user
  //   .save()
  //   .then(() => {
  //     res.status(201).send(user);
  //   })
  //   .catch((err) => {
  //     res.status(400).send(err);
  //   });

  // Async/await syntax
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Getting all users
app.get("/users", async (req, res) => {
  try {
    // fetches ALL users stored in the db
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Getting a user by id
app.get("/users/:id", async (req, res) => {
  // req.params is an object containing all route parameters that were provided in the request
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
});

// Updating a user by id
app.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body); // evaluates to ex. [ 'name', 'age' ]
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidUpdate = updates.every((attemptedUpdate) =>
    allowedUpdates.includes(attemptedUpdate)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid property update" });
  }

  try {
    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (err) {
    // handling validation error
    res.status(400).send(err);
  }
});

// Deleting a user
app.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
});

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send();
  }
});

app.get("/tasks", async (req, res) => {
  try {
    // fetches ALL tasks stored in the db
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/tasks/:id", async (req, res) => {
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
app.patch("/tasks/:id", async (req, res) => {
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
app.delete("/tasks/:id", async (req, res) => {
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

app.listen(port, () => console.log(`Server listening on Port ${port}`));
