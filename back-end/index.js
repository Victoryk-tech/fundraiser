const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const signinRouter = require("./router/authRoutes");
const signupRouter = require("./router/authRoutes");

const mongooseUrl = process.env.MONGO_URL;
mongoose
  .connect(mongooseUrl)
  .then(() => {
    console.log("Database is connected successful");
  })
  .catch((err) => {
    console.log(err.message);
  });
app.use(cors());
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", signinRouter);
app.use("/api/v1", signupRouter);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
