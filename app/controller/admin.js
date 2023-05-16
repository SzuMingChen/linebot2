const responseStatus = require('../lib/response-status');
const userAccountModel = require('../model/user_account');
const moneyLogModel = require('../model/money_log');

const adminController = {
    updateMoney: async (req,res) => {
        console.log(10, req.body);
        let {data, msg, create_uid} = req.body;// data是一個array
        //! data只有 create_uid, target_name, balance_amount, edit_reason
        try {
            //撈出舊資料
            let emptyName = [];
            // let lowMoneyName = [];
            // let cantDwarName = [];
            for (let i = 0; i < data.length; i++) {
                //!檢查每個名字是否都存在
                let checkexist = await userAccountModel.getAccount({name:data[i].target_name});//result||false
                if (checkexist === false) {
                    emptyName.push(data[i].target_name);
                    continue;
                }
                data[i].uid = checkexist[0].uid;
                data[i].original_amount = checkexist[0]?.money;
                data[i].new_amount = data[i].original_amount + (+data[i].balance_amount);

                //! 檢查是否有足夠金額可以提領
                // if (data[i].edit_reason === "提領" && data[i].new_amount <0) cantDwarName.push(data[i].uid);
                // if (data[i].new_amount <0) lowMoneyName.push(data[i].uid);
            }
            if (emptyName.length !== 0) return res.json({code:"0204", msg:"找不到此名稱", data:emptyName});
            // if (cantDwarName.length !== 0) return res.json({code:"0304", msg:"此單異動錢包失敗，因為data中的uid餘額不足無法提領", data:cantDwarName});
            
            
            //! 編輯帳號表單
            // 統計名字金額(妹妹寫的) 相同名字的金額合在一起
            // console.log(45,data);
            let arr = [];
            for (let n = 0; n < data.length; n++) {
                let same = arr.find((obj)=>obj.target_name === data[n].target_name)
                if(same){
                    same.balance_amount += Number(data[n].balance_amount)
                    same.new_amount = same.original_amount + same.balance_amount;
                }else{
                    arr.push({
                        target_name: data[n].target_name,
                        edit_reason:data[n].edit_reason,
                        original_amount: data[n].original_amount,
                        balance_amount: Number(data[n].balance_amount),
                        new_amount: data[n].new_amount,
                    })
                }
            }
            console.log(arr);
            const result1 = await userAccountModel.updateMoney(arr);//true||false
            if (!result1) return res.json(responseStatus.ACCOUNT_MONEY_EDIT_ERROR);//"0205","錢包異動失敗"
            
            //! 加上異動數量，上錢包記錄
            //data中需要有:target_name, original_amount, balance_amount, new_amount, edit_reason, msg, create_uid
            const result2 = await moneyLogModel.insertMany(arr, msg, create_uid);//true||false
            if (!result2) return res.json(responseStatus.MONEY_LOG_INSERT_ERROR);//"0300", "新增錢包紀錄失敗"

            //! 更新過錢包，錢包紀錄也完成後，將餘額過低的uid回傳讓機器人tag使用
            // if (lowMoneyName.length>0) {
            //     return res.json({code:"0303", msg:"所有人的錢包都異動成功，但是data裡面的uid錢包餘額小於0", data:lowMoneyName});
            // }
            return res.json(responseStatus.SUCCESS);

        } catch (error) {
            console.log(error);
            res.json(responseStatus.SQL_ERROR);
            return
        }
    }
}

module.exports = adminController;