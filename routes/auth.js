const express = require("express");
const router = express.Router();

router.get("/session", (req, res) => {
  console.log(req.user);
  if (req.user) {
    const { id, identifier, provider, displayName } = req.user;
    res.send({ id, identifier, provider, displayName });
  } else {
    console.log("SESSION_EXPIRED");
    res.send("SESSION_EXPIRED");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session.save((err) => {
    if (err) throw err;
    res.send("SUCCESS_LOGOUT");
  });
});

module.exports = router;
