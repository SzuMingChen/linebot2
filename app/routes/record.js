const express = require("express");
const recordController = require("../controller/record");

module.exports = (app) => {
	let router = express.Router();
	router.post("/createRecord", recordController.createRecord);

	app.use("/record", router);
};
