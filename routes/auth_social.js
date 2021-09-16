const express = require("express");
const router = express.Router();
const passport = require("passport");
const endpoint = require("../key/config").endpoint;

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${endpoint}`,
    failureRedirect: `${endpoint}login`,
  })
  // (request, response) => {
  //   response.redirect(`${endpoint}`);
  // }
);

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: `${endpoint}login`,
  }),
  (request, response) => {
    response.redirect(`${endpoint}`);
  }
);

module.exports = router;
