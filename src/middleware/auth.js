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

module.exports = {
  adminAuth,
};
