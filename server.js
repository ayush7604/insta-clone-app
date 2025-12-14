const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", require("./routes/users"));
app.use("/api/feed", require("./routes/feed"));


// test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database connected");

    app.listen(5000, () => {
      console.log("server started on port 5000");
    });
  })
  .catch((err) => {
    console.log("database connection error");
    console.log(err.message);
  });
