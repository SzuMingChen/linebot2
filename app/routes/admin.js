const express = require("express");
const adminController = require("../controller/admin");


module.exports = (app) => {
  let router = express.Router();
    router.post("/updateMoney",adminController.updateMoney);//更新單個帳號或多個帳號均可

  app.use("/admin", router);
};