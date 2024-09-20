const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const app = express();

app.post("/register", async (req, res) => {
  console.log("Enter");
  const userData = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    emailId: req.query.emailId,
    password: req.query.password,
    age: req.query.age,
    gender: req.query.gender,
    phoneNumber: req.query.phoneNumber,
    city: req.query.city,
  };

  if (req.query.password === "") {
    res.status(301).send("Password is required");
  } else {
    const user = new UserModel(userData);
    try {
      await user.save();
      res.send("User Saved Successfully");
    } catch (err) {
      res.send("Issue in saving data");
    }
  }
});

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(7171, () => {
      console.log("Server Started");
    });
  })
  .catch((err) => {
    console.log("There is some error connecting DB");
  });
