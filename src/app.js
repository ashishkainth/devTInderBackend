const express = require("express");

const app = express();

const { adminAuth } = require("./middleware/auth");

app.get("/getAllData", (req, res, next) => {
  throw new Error("Random Error!");
  res.send("All data!");
});

app.use("/", (err, req, res, next) => {
  if (err) res.status(500).send("Something went wrong!");
});

// app.use("/admin", adminAuth);

// app.get("/admin/getAllUser", (req, res, next) => {
//   res.send("All Data");
// });

// app.post("/admin/addUser", (req, res, next) => {
//   res.send("User addedd Successfully");
// });

// app.delete("/admin/deleteUser", (req, res, next) => {
//   res.send("User Deleted!");
// });

app.listen(3000, () => {
  console.log("Server Started");
});
