// 連接DB
const db = require('../../database')

// 使用者新增訂購(已加上團購編號)
async function createOrder({order_uid, group_id, order_list_id, msg, order_item, price, name, remark = ""}){
    const target = `INSERT INTO order_info ( order_uid, group_id, order_list_id, \`msg\`, order_item, \`price\`, \`name\`, \`remark\`) VALUES (${db.escape(order_uid)}, ${db.escape(group_id)}, ${db.escape(order_list_id)}, ${db.escape(msg)}, ${db.escape(order_item)}, ${db.escape(price)}, ${db.escape(name)}, ${db.escape(remark)})`
    // console.log(target);
    const [result, field] = await db.query(target);
    console.log(result.affectedRows);
    if (result?.affectedRows !== 0) {
        console.log(`點餐::: [order_info] 新增了 ${result.affectedRows} 條資料`);
        return result;
    }
    return false
}

// 使用者刪除訂購(編輯)(不需要團購編號)
async function dropOrder(id, deleteNum, group_id){
    const target = `UPDATE order_info SET \`delete\` = ${db.escape(deleteNum)} WHERE \`id\` = ${db.escape(id)} AND group_id = ${db.escape(group_id)}`;
    const [result, field] = await db.query(target);
    // console.log(result);
    if (result?.affectedRows !== 0) {
        console.log(`刪除訂單::: [order_info] 刪除了 ${id} 號訂單`);
        return true;
    }
    return false
}


// 根據訂單編號讀取所有訂單內容(已加上團購編號)
async function getAllOrders(group_id, order_list_id) {
    let target = `SELECT oi.* FROM order_info AS oi LEFT JOIN order_list AS ol ON oi.order_list_id = ol.\`id\` WHERE oi.group_id = ${db.escape(group_id)} AND oi.order_list_id = ${db.escape(order_list_id)} AND oi.\`delete\` = 0 AND ol.\`status\` = 1`;
    console.log(target);
    const [result, field] = await db.query(target);
    if (result.length !== 0) return result;
    return false;
}

// 根據id去查詢訂單是否存在(不需要團購編號)
async function getOneOrder(id, group_id) {
    const target = `SELECT * FROM order_info WHERE \`id\` = ${db.escape(id)} AND group_id = ${db.escape(group_id)} AND \`delete\` = 0`;
    const [result, field] = await db.query(target);
    if (result.length !== 0) {
        console.log(`檢查::: [order_info] 有找到該訂購編號 ${id}`);
        return result;
    }
    console.log(`檢查::: [order_info] 沒有找到該訂購編號 ${id}`);
    return false;

}

// 查找整理過的清單//加上團購編號)
async function arrangeOrders(group_id, order_list_id){
    const target = `SELECT oi.*, COUNT(*) AS amount FROM order_info AS oi LEFT JOIN order_list AS ol ON oi.order_list_id = ol.\`id\` WHERE oi.\`delete\` = '0' and oi.group_id = ${db.escape(group_id)} AND oi.order_list_id = ${db.escape(order_list_id)} GROUP BY  oi.order_item`;
    console.log(56,target);
    const [result, field] = await db.query(target);
    if (result.length !== 0) {
        console.log(`整理訂單::: [order_info] 取得群組ID為 ${group_id} 的所有訂購商品整理清單成功`);
        return result;
    }
    console.log(`整理訂單::: [order_info] 取得群組ID為 ${group_id} 的所有訂購商品整理清單失敗`);
    return false;
}

// 計算訂單總金額(加上團購編號)
async function totalMoney(group_id, order_list_id, id=""){
    let target = `SELECT SUM(oi.price) AS total_amount FROM order_info AS oi LEFT JOIN order_list AS ol ON oi.order_list_id = ol.\`id\` WHERE oi.\`delete\` = '0' and oi.group_id = ${db.escape(group_id)} AND ol.\`status\` = 1 AND oi.order_list_id = ${db.escape(order_list_id)}`;
    if (id) {
        target += ` AND ol.id = ${db.escape(id)}`;
    }
    // console.log(target);
    const [result, field] = await db.query(target);
    if (result.length !== 0) {
        console.log(`總金額::: [order_info] 取得群組ID為 ${group_id} 的所有金額成功`);
        return result;
    }
    console.log(`總金額::: [order_info] 取得群組ID為 ${group_id} 的所有金額失敗`);
    return false;
}

// 全部一起異動status
async function changeStatus(data = [], statusNum = '2'){
    let idList = [];
    for (let i = 0; i < data.length; i++) {
        idList.push(db.escape(data[i].id));
    }
    const target = `UPDATE order_info SET \`status\` = ${db.escape(statusNum)} WHERE \`id\` IN (${idList.join()})`;

    console.log(target);
    const [result, field] = await db.query(target);
    console.log(result);
    if (result?.affectedRows !== 0) return true
    return false
}

module.exports = {
    createOrder,
    getAllOrders,
    dropOrder,
    getOneOrder,
    arrangeOrders,
    totalMoney,
    changeStatus
}