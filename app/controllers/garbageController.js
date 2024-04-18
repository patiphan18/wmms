var GarbageModel = require('../models/garbageModel');
const Auth = require('../middleware/auth');
const fileUpload = require("express-fileupload");
const path = require('path');

const foundGarbageModal = async (req, res) => {
	const { lat, lon } = req.body;
	return res.render("./garbage/formFound", { lat: lat, lon: lon });
}

const GarbageStepModal = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const { lat, lon, foundID } = req.body;
	return res.render("./garbage/formStep", { lat: lat, lon: lon, foundID: foundID });
}

const addFoundGarbage = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const { lat, lon, description } = req.body;
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
		const objGarbageModel = new GarbageModel();
		result = await objGarbageModel.addFoundGarbage(lat, lon, description, fileName, decoded.id);
	}
	if (result == 1) {
		return res.status(200).json({ status: 1 });
	} else {
		return res.status(200).json({ status: 0, msg: "Error" });
	}

}

const addGarbageStep = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const { lat, lon, type, difficult, description, foundID } = req.body;
	// console.log(req.body)
	const objGarbageModel = new GarbageModel();
	if (foundID != 0) {
		var isFound = await objGarbageModel.getGarbageFound(foundID);
		if (isFound.status == 0) return res.status(200).json({ status: 1 });
	}

	const files = req.files
	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1;
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const dateToday = yyyy + '' + mm + '' + dd;
	var fileName = [null, null, null, null];
	var count = 0;
	Object.keys(files).forEach(key => {
		if (count == 4) return;
		var name = files[key].name;
		var index = name.lastIndexOf('.');
		var ext = name.substring(index, name.length);
		if (['.jpeg', '.jpg', '.png', '.webp'].includes(ext)) {
			var randomName = Math.random().toString().slice(2, 10);
			fileName[count] = dateToday + "_" + randomName + ext;
			const filepath = path.join(__dirname, '../uploads/garbages', fileName[count]);
			files[key].mv(filepath, (err) => {
				if (err) return res.status(500).json({ result: 0 });
			})
		}
		count++;
	})
	var result = 0;
	if (count == 4) {
		result = await objGarbageModel.addGarbageStep(lat, lon, type, fileName[0], fileName[1], fileName[2], fileName[3], difficult, description, decoded.id);
		if (foundID != 0) {
			result = await objGarbageModel.clearGarbage(foundID);
		}
	}
	if (result == 1) {
		return res.status(200).json({ status: 1 });
	} else {
		return res.status(200).json({ status: 0, msg: "Error" });
	}

}


module.exports = {
	foundGarbageModal, GarbageStepModal, addFoundGarbage, addGarbageStep
};