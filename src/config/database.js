const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://kainthashish:WmsrDu0JD8OpqlO8@solutionusingnode.mvgm4.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
