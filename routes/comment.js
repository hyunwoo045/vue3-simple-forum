const express = require("express");
const mysql = require("mysql");
const url = require("url");
const router = express.Router();
const dbconfig = require("../key/config").database;

const authenticateUser = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send("SESSION_EXPIRED");
  }
};

/* READ COMMENTS BY CONTENT ID */
/* /api/comment?id=[] */
router.get("/", authenticateUser, (req, res) => {
  let connection = mysql.createConnection(dbconfig);
  connection.connect();

  let _url = req.url;
  let queryData = url.parse(_url, true).query;
  let id = queryData.id;

  connection.query(
    "SELECT comments.id, user_id, user.nickname AS author, description, created FROM comments LEFT JOIN user ON user_id=user.id WHERE content_id=?",
    [id],
    (err, comments) => {
      if (err) throw err;
      connection.end();
      res.send(comments);
    }
  );
});

/* CREATE COMMENT */
/* /api/comment/add */
router.post("/create", authenticateUser, (req, res) => {
  let connection = mysql.createConnection(dbconfig);
  connection.connect();
  let user_id = req.body.user_id;
  let description = req.body.description;
  let content_id = req.body.content_id;

  connection.query(
    "INSERT INTO comments (user_id, description, created, content_id) VALUES(?, ?, NOW(), ?)",
    [user_id, description, content_id],
    (err) => {
      if (err) throw err;
      connection.end();
      res.send("Comment Added");
    }
  );
});

/* DETELTE COMMENT */
/* /api/comment/delete */
router.post("/delete", authenticateUser, (req, res) => {
  let connection = mysql.createConnection(dbconfig);
  connection.connect();

  let id = req.body.id;
  connection.query("DELETE FROM comments WHERE id=?", [id], (err) => {
    if (err) throw err;
    connection.end();
    res.send("COMMENT DELETED");
  });
});

module.exports = router;
