const express = require("express");
const orderController = require("../controller/order");


module.exports = (app) => {
  let router = express.Router();
    router.post("/getOrderList",orderController.getOrderList);//查該群組中有沒有正在進行中的團購
    router.post("/createNewOrder", orderController.createNewOrder);//創建新的訂餐
    router.post("/orderItem", orderController.orderItem);//點餐
    router.post("/dropOrder", orderController.dropOrder);//刪除該群組某下訂編號
    router.post("/getAllOrders", orderController.getAllOrders);//取得該群組進行中的訂單內容
    router.post("/arrangeOrders",orderController.arrangeOrders)//取得整理過的訂購清單
    router.post("/totalMoney",orderController.totalMoney);//取得該群組訂單的總金額
    router.post("/closeOrder", orderController.closeOrder);//結束訂單更改訂單狀態
    router.post("/changeStatus",orderController.changeStatus);//更改下訂的訂單狀態
    router.post("/findLastOrder",orderController.findLastOrder);//取得該群組訂單的前一筆訂單
    router.post("/addOrderText", orderController.addOrderText);//結束訂單的時候將記錄更新在order_list上

  app.use("/order", router);
};