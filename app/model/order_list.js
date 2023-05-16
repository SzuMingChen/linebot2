// 連接DB
const db = require('../../database')

// 讀取所有訂單
async function getAllByGroup(group_id, status_num = '1'){
    let target = `SELECT * FROM order_list WHERE group_id = ${db.escape(group_id)} AND \`delete\`= 0 AND \`status\` = ${db.escape(status_num)}`;
    console.log(target);
    const [result, field] = await db.query(target);
    if (result.length !== 0)  return result;
    return false;
}

// 新增訂單
async function create(store_name, group_id, create_uid){
    const target = `INSERT INTO order_list ( store_name, group_id, create_uid) VALUES (${db.escape(store_name)}, ${db.escape(group_id)}, ${db.escape(create_uid)})`;
    const [result, field] = await db.query(target);
    // console.log(result.affectedRows);
    if (result?.affectedRows !== 0) {
        console.log(`新增新增::: [order_list] 新增了 ${result.affectedRows} 個訂單`);
        return result;
    }
    return false

}

// 根據group_id去刪除訂單(待優化:加上id的條件)
async function removeOrders(group_id, statusNum, update_uid) {
    const target = `UPDATE \`order_list\` SET \`status\` = ${db.escape(statusNum)}, update_uid = ${db.escape(update_uid)} WHERE ( \`group_id\` = ${db.escape(group_id)} )`;;
    const [result, field] = await db.query(target);
    if (result.length !== 0) {
        console.log(`檢查::: [order_list] 刪除該訂購編號 ${db.escape(group_id)}`);
        return result;
    }
    console.log(`檢查::: [order_list] 沒有刪除該訂購編號 ${db.escape(group_id)}`);
    return false;

}

// 根據group_id關閉訂單(待優化:加上id的條件)
async function closeOrder(group_id, id = ""){
    let target = `UPDATE order_list SET \`status\` = '2' WHERE group_id = ${db.escape(group_id)} AND \`status\` = 1`;
    if (id) {
        target += ` AND \`id\` = ${db.escape(id)}`;
    }
    const [result, field] = await db.query(target);
    if (result.length !== 0) {
        console.log(`關閉::: [order_list] 關閉訂購編號 ${db.escape(group_id)}-${db.escape(id)}`);
        return result;
    }
    console.log(`關閉::: [order_list] 關閉該訂購編號 ${db.escape(group_id)}-${db.escape(id)}`);
    return false;
}

// 尋找上一筆歷史訂單
async function findLastOrder(group_id){
    const target = `SELECT orders FROM order_list WHERE group_id = ${db.escape(group_id)} AND  \`status\` = 2 ORDER BY createtime DESC LIMIT 1 `;
    // console.log('aayyaayyaayyaayy',target);
    const [result, field] = await db.query(target);
    if (result.length !== 0) {
        console.log(`檢查::: [order_list] 前一筆訂購編號 ${db.escape(group_id)}`);
        return result;
    }
    console.log(`檢查::: [order_list] 沒有該訂購編號 ${db.escape(group_id)}`);
    return false;
}

// 新增ordeers欄位裡的文字
async function addOrderText(text, id){
    const target = `UPDATE order_list SET orders = ${db.escape(text)} WHERE \`id\` = ${db.escape(id)}`;
    const [result, field] = await db.query(target);
    if (result.length !== 0) {
        console.log(`新增::: [order_list] 新增ID ${db.escape(id)} 的orders欄位成功`);
        return result;
    }
    console.log(`新增::: [order_list] 新增ID ${db.escape(id)} 的orders欄位失敗`);
    return false;

}

module.exports = {
    getAllByGroup,
    create,
    removeOrders,
    closeOrder,
    findLastOrder,
    addOrderText
}