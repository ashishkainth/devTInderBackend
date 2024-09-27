const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const { userAuth } = require("./middleware/auth");
const bcrypt = require("bcrypt");
const app = express();
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

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

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log(req.body);
    if (!validator.isEmail(emailId)) {
      res.send("Invalid email Id");
    } else if (!validator.isStrongPassword(password)) {
      res.send("Invalid Password");
    } else {
      const users = await UserModel.find({ emailId: emailId });

      if (users.length !== 0) {
        const isValidPassword = await bcrypt.compare(
          password,
          users[0].password
        );
        if (isValidPassword) {
          const token = await jwt.sign(
            { _id: users[0]._id },
            "DEV@Tinder$123",
            { expiresIn: "1d" }
          );
          res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
          });
          res.send("Login Successful!");
        } else {
          res.send("Invalid Credentials!");
        }
      } else {
        res.send("Invalid Credentials!");
      }
    }
  } catch (err) {
    res.send("Something went wrong" + err);
  }
});

app.post("/register", async (req, res) => {
  const passwordHash = await bcrypt.hash(req.query.password, 10);
  console.log("passwordHash ", passwordHash);
  const userData = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    emailId: req.query.emailId,
    password: passwordHash,
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
