// 連接DB
const db = require('../../database')

// 註冊
async function createAccount(uid, name, level){
    const target = `INSERT INTO user_account (\`uid\`, \`name\`, \`level\`) VALUES (${db.escape(uid)}, ${db.escape(name)}, ${db.escape(level)})`
    const [result, field] = await db.query(target);
    // console.log(result.affectedRows);
    if (result.affectedRows !== 0) {
        console.log(`註冊::: [user_account] 新增了 ${result.affectedRows} 條資料`);
        return result;
    }
    console.log('註冊::: [user_account] 註冊失敗');
    return false;
}

// 查找帳號資訊
async function getAccount({uid,name}){
    console.error(uid, name);
    let target = `SELECT * FROM user_account WHERE `;
    uid? target+= `uid = ${db.escape(uid)}`: null;
    name? target+= `name = ${db.escape(name)}`: null;
    // console.log(target);
    const [result, field] = await db.query(target);
    // console.log(result);
    if (result.length !== 0) {
        console.log(`檢查::: [user_account] 有找到該帳號或暱稱`);
        return result;
    }
    console.log(`檢查::: [user_account] 沒有找到該帳號或暱稱`);
    return false;
}

// 全部一起異動money
async function updateMoney(data = []){
    let updatecase = [];
    let nameList = [];
    for (let i = 0; i < data.length; i++) {
        updatecase.push (`WHEN \`name\` = ${db.escape(data[i].target_name)} THEN ${db.escape(data[i].new_amount)}`);
        nameList.push(db.escape(data[i].target_name));
    }
    const target = `UPDATE user_account SET money = ( CASE ${updatecase.join(" ")} END) WHERE \`name\` IN (${nameList.join()})`;

    console.log(target);
    const [result, field] = await db.query(target);
    console.log(result);
    if (result?.affectedRows !== 0) return true
    return false
}

module.exports = {
    createAccount,
    getAccount,
    updateMoney
}