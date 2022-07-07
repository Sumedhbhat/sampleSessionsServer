const app = require("express").Router();

app.get("/login", (req, res) => {
  req.session.username = "admin";
  res.send("Session secondary route");
});

const info = (req, res) => {
  if (req.session.username) {
    res.send("username" + req.session.username);
  } else {
    res.send("no username");
  }
};
app.route("/info1").get(info);
app.get("/info", (req, res) => {
  if (req.session.username) {
    res.send("username" + req.session.username);
  } else {
    res.send("no username");
  }
});

module.exports = app;
