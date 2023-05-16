const deepFreeze = require("./deep-freeze")
const status = {
    // SUCCESSs:"==================成功(0001)===============",
    SUCCESS: customRes('0001', '成功'),


    // USER_ACCOUNT_ERROR:"===================會員相關異常(02XX)================(user_account)",
    ACCOUNT_CREATE_ERROR: customRes("0200", "註冊失敗"),
    ACCOUNT_UID_DUPLICATED_ERROR: customRes("0201", "帳號重複"),
    ACCOUNT_NAME_DUPLICATED_ERROR: customRes("0202", "姓名重複"),
    ACCOUNT_UID_EMPTY_ERROR: customRes("0203", "此帳號未註冊"),
    ACCOUNT_NAME_EMPTY_ERROR: customRes("0204", "找不到此名稱"),
    ACCOUNT_MONEY_EDIT_ERROR: customRes("0205", "錢包異動失敗"),
    



    // MONEY_LOG:"===================錢包異動紀錄LOG系統相關異常(03XX)================(money_log)",
    MONEY_LOG_INSERT_ERROR:customRes("0300", "新增錢包紀錄失敗"),
    MONEY_LOW_WARN:customRes("0301","異動成功，但是錢包餘額小於0"),
    MONEY_EDIT_ERROR:customRes("0302","異動失敗"),
    MONEY_EDIT_SUCCESS_LOWMONEY:customRes("0303","所有人的錢包都異動成功，但是data裡面的uid錢包餘額小於0"),
    MONEY_DRAW_ERROR:customRes("0304", "此單異動錢包失敗，因為data中的uid餘額不足無法提領"),




    // ORDER_LIST:"===================訂單相關異常(04XX)================(order_list)",
    ORDERLIST_CREATE_ERROR: customRes("0400", "創建訂單失敗"),
    ORDERLIST_GET_ERROR:customRes("0401","此群組沒有進行中的訂單"),
    ORDERLIST_CLOSED_ERROR:customRes("0402","訂單關閉失敗"),
    ORDERLIST_DUPLICATED_ERROR:customRes("0403","此群組有正在進行中的團購"),
    ORDERLIST_SETTLE_STATUS_ERROR:customRes("0404","訂單將狀態改成已結算失敗"),
    ORDERLIST_ADD_ORDERS_TEXT_ERROR:customRes("0405","新增orders欄位的文字紀錄失敗"),
   


    // ORDER_INFO:"===================訂單相關異常(05XX)================(order_info)",
    ORDERINFO_CREATE_ERROR: customRes("0500", "新增點餐失敗"),
    ORDERINFO_DROP_ERROR: customRes("0501", "刪除訂單失敗"),
    ORDERINFO_EMPTY_ERROR:customRes("0502", "這個群組裡面沒有這個訂單編號"),
    ORDERINFO_NO_ING_ORDER:customRes("0503","訂單內容是空的"),
    ORDERINFO_ARRANGE_GET_ERROR:customRes("0504", "沒有人訂東西訂單是空的"),
    ORDERINFO_TOTALMONEY_GET_ERROR:customRes("0505", "取得訂購總金額失敗"),
    ORDERINFO_STATUS_CHANGE_ERROR: customRes("0506", "訂單狀態更改失敗"),


    // ORDER_INFO:"===================訂單相關異常(06XX)================",
    RECORD_CREATE_ERROR: customRes("0600", "新增收發紀錄失敗"),

    // COMMON_ERROR:"==================其他常見錯誤 包含預設錯誤項目(99XX)================",
    SQL_ERROR:customRes("9907", "資料庫錯誤"),
    SYSTEM_ERROR: customRes('9998', '系統錯誤'),
    UNKNOWN_ERROR: customRes('9999', '未知錯誤')

}

function customRes(code, msg) {
    return {
        code: code,
        msg: msg || ""
    };
}

deepFreeze(status)

module.exports = status;