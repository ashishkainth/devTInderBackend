const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Ashish", lastName: "Kainth" });
});

app.post("/user", (req, res) => {
  res.send({ responseCode: 200, message: "Success" });
});

// app.use("/hello", (req, res) => {
//   res.send("Hello Hello From Server");
// });

// app.use("/test", (req, res) => {
//   res.send("Hello Test From Server");
// });

// app.use("/", (req, res) => {
//   res.send("Hello Home Home From Server");
// });

app.listen(3000, () => {
  console.log("Server Started");
});
