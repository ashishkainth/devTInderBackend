const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const adminAuth = (req, res, next) => {
  const token = "ABC";
  const isAuthenticated = token === "ABC";
  console.log("IsAuthenticated ", isAuthenticated);
  if (!isAuthenticated) {
    res.status(401).send("User InAuthenticated");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      res.send("Please login again as Token expiress!");
    }

    const decode = jwt.verify(token, "DEV@Tinder$123");
    const user = await UserModel.findById(decode._id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
