const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 18) {
          throw new Error("Age should be greater than 18");
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png",
    },
    gender: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
