var CollectModel = require('../models/collectModel');
const Auth = require('../middleware/auth');
const fileUpload = require("express-fileupload");
const path = require('path');

const collectView = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.redirect('/');

	return res.render("./collect/index", { role: decoded.role });

}

const reportView = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.redirect('/');

	return res.render("./collect/report", { role: decoded.role, id: decoded.id });

}

const getTable = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.render("./template/refresh");

	const objCollectModel = new CollectModel();
	var data = await objCollectModel.getAll(decoded.id);
	var sum = await objCollectModel.getSummaryByCreator(decoded.id);
	if (sum.weight == null) sum.weight = 0;
	if (sum.carbon == null) sum.carbon = 0;
	return res.render("./collect/table", { data: data, sum: sum });

}

const getGraph = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.render("./template/refresh");

	const { id, year } = req.body;

	const objCollectModel = new CollectModel();
	var data = await objCollectModel.getLastTenCollect(id, year);
	if(data === undefined) {
		data = [];
	}
	var sum = await objCollectModel.getSummaryByCreator(id, year);
	if (sum.weight == null) sum.weight = 0;
	if (sum.carbon == null) sum.carbon = 0;
	return res.render("./collect/graph", { data: data, sum: sum });

}

const addCollectView = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.render("./template/refresh");

	const objCollectModel = new CollectModel();
	var data = await objCollectModel.getAllType();
	return res.render("./collect/formAdd", { data: data });

}

const addCollect = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const { weight, type, carbon } = req.body;
	if (weight <= 0 || carbon <= 0) return res.status(200).json({ status: 0, msg: "error" });
	// console.log(req.body)
	const files = req.files
	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1;
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const dateToday = yyyy + '' + mm + '' + dd;
	var fileName = "";
	var count = 0;
	Object.keys(files).forEach(key => {
		if (count > 0) return;
		var name = files[key].name;
		var index = name.lastIndexOf('.');
		var ext = name.substring(index, name.length);
		if (['.jpeg', '.jpg', '.png', '.webp'].includes(ext)) {
			var randomName = Math.random().toString().slice(2, 10);
			fileName = dateToday + "_" + randomName + ext;
			const filepath = path.join(__dirname, '../uploads/garbages', fileName);
			files[key].mv(filepath, (err) => {
				if (err) return res.status(500).json({ result: 0 });
			})
		}
		count++;
	})
	var result = 0;
	if (fileName != "") {
		const objCollectModel = new CollectModel();
		result = await objCollectModel.addCollect(weight, carbon, fileName, type, decoded.id);
	}
	if (result != 0) {
		return res.status(200).json({ status: 1 });
	} else {
		return res.status(200).json({ status: 0, msg: "Error" });
	}

}


module.exports = {
	collectView, getTable, addCollectView, addCollect, reportView, getGraph
};