const responseStatus = require('../lib/response-status');
const userAccountModel = require('../model/user_account');

const userController = {
    //# 註冊
    register: async (req,res) => {
        console.log(req.body);
        const {uid, name, level} = req.body;
        try {
            // 檢查此帳號是否已經註冊過
            const checkUid = await userAccountModel.getAccount({uid});//result(Array)查到的結果||false沒有重複
            if (checkUid !== false) return res.json(responseStatus.ACCOUNT_UID_DUPLICATED_ERROR);//"0201", "帳號重複"

            // 檢查註冊姓名是否重複
            const checkName = await userAccountModel.getAccount({name});//result(Array)查到的結果||false沒有重複
            if (checkName !== false) return res.json(responseStatus.ACCOUNT_NAME_DUPLICATED_ERROR);//"0202", "姓名重複"

            // 可以註冊後新增帳戶
            const createAccount = await userAccountModel.createAccount(uid, name, level);//result||false
            if (createAccount) return res.json(responseStatus.SUCCESS);
            return res.json(responseStatus.ACCOUNT_CREATE_ERROR);//"0200", "註冊失敗"

            
        } catch (error) {
            console.log(error);
            console.log(`{register}::: [user_account] 註冊失敗，原因:::${error.sqlMessage}，SQL語法:::${error.sql}`);
            return res.json(responseStatus.SQL_ERROR);
        }
    },

    //# 利用uid或者name查找帳戶
    findAccount: async (req,res) => {
        const {uid, name} = req.body;
        try {
            if (name === undefined) {
                //撈出舊資料
                console.log(uid);
                const findResult = await userAccountModel.getAccount({uid});//result||false
                if (findResult === false) return res.json(responseStatus.ACCOUNT_UID_EMPTY_ERROR);//"0203", "此帳號未註冊"
                return res.json({code:"0001",msg:"成功", data:findResult[0]});
            };
            if (uid === undefined) {
                //撈出舊資料
                console.log(name);
                const findResult = await userAccountModel.getAccount({name});//result||false
                if (findResult === false) return res.json(responseStatus.ACCOUNT_NAME_EMPTY_ERROR);//"0204", "找不到此名稱"
                return res.json({code:"0001",msg:"成功", data:findResult[0]});
            }
        } catch (error) {
            console.log(error);
            return res.json(responseStatus.SQL_ERROR);
        }

    }
}

module.exports = userController