const express = require("express");
const router = new express.Router();
const User = "../models/user";

// get all users
router.get("/users", async (req, res) => {
  try {
    // fetches ALL users stored in the db
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// create a user
router.post("/users", async (req, res) => {
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

// get a user by id
router.get("/users/:id", async (req, res) => {
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

// update a user by id
router.patch("/users/:id", async (req, res) => {
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

// delete a user by id
router.patch("/users/:id", async (req, res) => {
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

module.exports = router;
