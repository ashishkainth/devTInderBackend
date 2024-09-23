const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const app = express();

app.use(express.json());

app.patch("/getUserIdUpdate", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "phoneNumber",
      "password",
      "photoURL",
      "age",
      "city",
    ];

    const isUpdatesAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdatesAllowed) {
      throw new Error("Updates not Allowed");
    }
    const users = await UserModel.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    if (users.length !== 0) {
      res.send(users);
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (err) {
    res.status(400).send("Something went wrong!" + err);
  }
});

app.delete("/getUserByEmailAndDelete", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await UserModel.findOneAndDelete({ emailId: userEmail });
    console.log("users ", users);
    if (users.length !== 0) {
      res.send("User Deleted Successfully");
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

app.get("/getAllUsers", async (req, res) => {
  try {
    const users = await UserModel.find({});

    if (users.length !== 0) {
      res.send(users);
    } else {
      res.status(404).send("No User Found!");
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

app.get("/getUserByEmail", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await UserModel.find({ emailId: userEmail });

    console.log("User details ", users);
    if (users.length !== 0) {
      res.send(users);
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

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
      console.log(err);
      res.send("Issue in saving data: " + err);
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
