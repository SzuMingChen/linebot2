const responseStatus = require('../lib/response-status');
const userAccountModel = require('../model/user_account');
const orderListModel = require('../model/order_list');
const orderInfoModel = require('../model/order_info');


const ordercontroller = {
    //# 新增團購
    createNewOrder: async (req,res) => {
        const {store_name, group_id, create_uid} = req.body;
        try {
            const createResult = await orderListModel.create(store_name, group_id, create_uid);//result||false
            if (!createResult) return res.json(responseStatus.ORDERLIST_CREATE_ERROR);//"0400", "創建訂單失敗"
            return res.json({code:"0001",msg:"成功", data:createResult.insertId});// 給訂單編號
        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }
    },

    //# 取得order_list中status=1的團購單
    getOrderList: async (req,res) =>{
        const {group_id, statusNum} = req.body;
        try {
            //! 找開啟中的訂單
            let findResult = await orderListModel.getAllByGroup(group_id);//reuslt||false
            if (statusNum) findResult = await orderListModel.getAllByGroup(group_id, statusNum);//reuslt||false
            if (findResult === false) return res.json({code:"0001", msg:"成功" ,data:"沒有正在進行中的團購，可以開啟新團購"});// 可以開啟新團購
            return res.json({code:"0403",msg:"此群組有正在進行中的團購", data:findResult[0]});// 不可以開啟新團購，data:可以團購編號
        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }
    },

    //# 點餐(自己+代點)
    orderItem: async (req,res) => {
        let {order_uid, group_id, msg, order_item, price, remark, name} = req.body;
        console.log(456);
        try {
            let result;
            let findResult;
            const checkResult = await orderListModel.getAllByGroup(group_id);//result||false
            console.log(46, checkResult);
            if (checkResult === false) return res.json(responseStatus.ORDERINFO_NO_ING_ORDER);//"0503","訂單內容是空的"
            const order_list_id = checkResult[0].id
            //! 幫自己點餐
            if (name === undefined) {
                //! 查找此uid是否註冊過
                findResult = await userAccountModel.getAccount({uid:order_uid});
                if (findResult === false) return res.json(responseStatus.ACCOUNT_UID_EMPTY_ERROR);//"0203", "此帳號未註冊")
                name = findResult[0].name;
                msg = name + " " + msg;
                result = await orderInfoModel.createOrder({order_uid, group_id, order_list_id, msg, order_item, price, name, remark});
                if (result === false) return res.json(responseStatus.ORDERINFO_CREATE_ERROR);//"0204", "找不到此名稱"
                return res.json({code:"0001",msg:"成功",data:{orderId : result.insertId}});
            }
            
            //! 幫別人點餐
            //! 查找此name是否註冊過
            findResult = await userAccountModel.getAccount({name});
            if (findResult === false) return res.json(responseStatus.ACCOUNT_NAME_EMPTY_ERROR);//"0206", "尚未在此平台上註冊過"
            msg = findResult[0].name + " " + msg;
            order_uid = findResult[0].uid;
            // console.log(order_uid);
            result = await orderInfoModel.createOrder({order_uid, group_id, order_list_id, msg, order_item, price, name, remark});
            if (result === false) return res.json(responseStatus.ORDERINFO_CREATE_ERROR);//"0400", "新增點餐失敗"
            return res.json({code:"0001",msg:"成功",data:{orderId : result.insertId}});
        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }

    },

    //# 刪除訂單
    dropOrder : async(req,res) => {
        const {group_id, id} = req.body;
        try {
            //! 檢查該訂單編號是否存在
            const checkResult = await orderInfoModel.getOneOrder(id, group_id);//reuslt||false
            if (checkResult ===false) return res.json(responseStatus.ORDERINFO_EMPTY_ERROR);//"0402", "這個群組裡面沒有這個訂單編號"
            //! 如果存在此訂單編號，刪除該訂單編號
            const result = await orderInfoModel.dropOrder(id, '1', group_id);//true||false
            if (result ===false) return res.json(responseStatus.ORDERINFO_DROP_ERROR);//"0401", "刪除訂單失敗"
            return res.json({code:"0001",msg:"成功", data:checkResult[0]});
        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }
    },

    //# 取得該訂單所有下訂資訊//!(加上訂單編號)
    getAllOrders: async (req,res) => {
        const {group_id, order_list_id} = req.body;
        try {
            const result = await orderInfoModel.getAllOrders(group_id, order_list_id);//result||false
            if (result === false) return res.json(responseStatus.ORDERINFO_NO_ING_ORDER);//"0503","訂單內容是空的"
            return res.json({code:"0001",msg:"成功",data:result});
        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }
    },

    //# 關閉訂單:將order_list的status改成2(關閉)
    closeOrder: async (req,res) => {
        const {group_id, update_uid} = req.body;
        try {
            const checkResult = await orderListModel.getAllByGroup(group_id);//result||false(沒有進行中的訂單)
            if (checkResult === false) return res.json(responseStatus.ORDERLIST_GET_ERROR);//"0401","此群組沒有進行中的訂單"
            const result = await orderListModel.removeOrders(group_id, '2', update_uid);//result||false
            if (result ===false) return res.json(responseStatus.ORDERLIST_CLOSED_ERROR);//"0402","訂單關閉失敗"
            return res.json(responseStatus.SUCCESS);
        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }
    },

    //# 將order_info已經結束訂單的下訂status改成2
    changeStatus : async (req,res) => {
        const {data} = req.body;
        try {
            const result = await orderInfoModel.changeStatus(data);//true||flase
            if (!result) return res.json(responseStatus.ORDERINFO_STATUS_CHANGE_ERROR);//"0506", "訂單狀態更改失敗"
            return res.json(responseStatus.SUCCESS)
        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return 
        }
    },

    //# 將進行中的下訂分組整理
    arrangeOrders: async (req,res) =>{
        const {group_id, order_list_id} = req.body;
        try {
            const arrangeResult = await orderInfoModel.arrangeOrders(group_id,order_list_id);//result||false
            // console.log(arrangeResult);
            if (arrangeResult === false) return res.json(responseStatus.ORDERINFO_ARRANGE_GET_ERROR);//"0504", "沒有人訂東西訂單是空的"
            return res.json({code:"0001",msg:"成功",data:arrangeResult});
        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }
    },

    //# 計算訂單總金額
    totalMoney: async (req,res) => {
        const {group_id, order_list_id} = req.body;//id先保留之後要鎖定某張訂單使用，目前只有一張訂單不管id
        try {
                        const moneyResult = await orderInfoModel.totalMoney(group_id, order_list_id);
            // console.log(moneyResult);
            if (moneyResult === false) return res.json(responseStatus.ORDERINFO_TOTALMONEY_GET_ERROR);//"0505", "取得訂購總金額失敗"
            return res.json({code:"0001",msg:"成功",data:moneyResult[0]});
        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }
    },

    //# 查找最近一筆歷史訂單
    findLastOrder: async (req,res) => {
        const {group_id} = req.body;
        try {
            const result = await orderListModel.findLastOrder(group_id);//result||false
            if (result ===false) return res.json(responseStatus.ORDERINFO_ARRANGE_GET_ERROR);//"0504", "沒有人訂東西訂單是空的"
            return res.json({code:"0001",msg:"成功",data:result});
        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }
    },

    //# 結束訂單時加回應文字新增到order_list的orders(以便於查找歷史訂單時使用)
    addOrderText: async (req,res) =>{
        const {text, id} = req.body;
        try {
            const result = await orderListModel.addOrderText(text, id);
            if (!result) return res.json(responseStatus.ORDERLIST_ADD_ORDERS_TEXT_ERROR);//"0405","新增orders欄位的文字紀錄失敗"
            return res.json(responseStatus.SUCCESS)

        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }
    }
}

module.exports = ordercontroller;