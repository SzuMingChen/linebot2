// 連接DB
const db = require('../../database')

// 管理人員處理uid的money時新增
async function insertMany(data, msg, create_uid){
    console.log(data);
    let values = [];
    for (let i = 0; i < data.length; i++) {
        values.push('(' + db.escape(data[i].target_name) + ',' + db.escape(data[i].original_amount) + ',' + db.escape(data[i].balance_amount) + ',' + db.escape(data[i].new_amount)+ ',' + db.escape(data[i].edit_reason)+ ',' + db.escape(msg) + ',' + db.escape(create_uid) + ')') 
    }
    console.log(values);
    const target = `INSERT INTO money_log (target_name, original_amount, balance_amount, new_amount, edit_reason, \`msg\`, create_uid) VALUES ${values.join()}`;
    console.log(target);
    const [result, field] = await db.query(target);
    console.log(result.affectedRows);
    if (result?.affectedRows !== 0) {
        console.log(`新增異動紀錄::: [money_log] 新增了 ${result.affectedRows} 條資料`);
        return true
    }
    return false
}

module.exports = {
    insertMany
}