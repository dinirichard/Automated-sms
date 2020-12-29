const express = require("express");
const router = express.Router();

const smsService = require("./sms.service");
const userService = require("./user.service");

router.get("/users", (req, res) => {
  // smsService.getUser(req, res);
  userService.getUsers(req, res);
  // res.send(200, [{ id: 10, name: "Starlord", saying: "oh yeah" }]);
});

router.post("/user", (req, res) => {
  userService.postUser(req, res);
});

router.put("/hero/:uid", (req, res) => {
  userService.putUser(req, res);
});

router.delete("/hero/:uid", (req, res) => {
  userService.deleteUser(req, res);
});

module.exports = router;
