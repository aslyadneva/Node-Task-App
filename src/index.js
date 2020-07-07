const express = require("express");
// this line runs and connects to db
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

// parses incomeing json data into an object accessible on req.body
app.use(express.json());

// set up routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => console.log(`Server listening on Port ${port}`));
