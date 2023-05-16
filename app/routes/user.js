const express = require("express");
const userController = require("../controller/user");


module.exports = (app) => {
  let router = express.Router();
    router.post("/register", userController.register);//註冊
    router.post("/findAccount", userController.findAccount);//查找帳戶資訊
  app.use("/user", router);
};
