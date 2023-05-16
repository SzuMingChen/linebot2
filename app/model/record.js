// 連接DB
const db = require("../../database");

// 新增紀錄

async function createRecord(uid, group_id, msg, input_json, data_flow) {
	const target = `INSERT INTO record ( uid, group_id, msg, input_json, data_flow) VALUES (${db.escape(uid)}, ${db.escape(group_id)}, ${db.escape(msg)}, ${db.escape(input_json)}, ${db.escape(data_flow)})`;
	const [result, field] = await db.query(target);
	console.log(result.affectedRows);
	if (result?.affectedRows !== 0) {
		console.log(`新增新增::: [record] 新增了 ${result.affectedRows} `);
		return result;
	}
	return false;
}

module.exports = {
	createRecord,
};
