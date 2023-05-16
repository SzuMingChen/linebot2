const responseStatus = require('../lib/response-status');
const recordModel = require("../model/record");

const recordController = {
	createRecord: async (req, res) => {
		console.log("createRecord", req.body);
		const { uid, group_id, msg, input_json, data_flow } = req.body;
		try {
			const createResult = await recordModel.createRecord(
				uid,
				group_id,
				msg,
				input_json,
				data_flow
			); //result||false
			if (!createResult) return res.json(responseStatus.RECORD_CREATE_ERROR); //"0600", "新增收發紀錄失敗"
			return res.json({
				code: "0001",
				msg: "成功",
			});
		} catch (error) {
			console.log(error);
			res.json(responseStatus.SQL_ERROR);
			return;
		}
	},
};

module.exports = recordController;