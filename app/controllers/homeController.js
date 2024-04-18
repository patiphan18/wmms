var GarbageModel = require('../models/garbageModel');
var BinModel = require('../models/binModel');
const Auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const homeView = async (req, res, next) => {
	var role = 0;
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (decoded) role = decoded.role;

	var filterData = [
		{ id: "bin3", name: "Recycle Bin", color: "#FFC24D" },
		{ id: "bin4", name: "Hazardous Bin", color: "#CE0202" },
		{ id: "bin2", name: "Compostable Bin", color: "#4ECC80" },
		{ id: "bin1", name: "General Bin", color: "#150098" },
		{ id: "garbageFound", name: "Found Garbage", color: "#000000" },
		// { id: "filter6", name: "Garbage", color: "#B6018E" },
		// { id: "filter7", name: "Clean Up", color: "#3EA9E5" },
	]

	const objBinModel = new BinModel();
	var binData = await objBinModel.getAll();
	const objGarbageModel = new GarbageModel();
	var garbageData = await objGarbageModel.getAllGarbageFound();
	const typeList = ["General", "Compostable", "Recycle", "Hazardous"];
	// General Waste = 1, Compostable Waste = 2, Recycle Waste = 3, Hazardous Waste = 4
	// Ex: data from db is "General Waste-Compostable Waste" convert to 12
	for (let i = 0; i < binData.length; i++) {
		var type = binData[i].type;
		var tempType = "";
		for (let j = 1; j <= typeList.length; j++) {
			if (type.search(typeList[j - 1]) != -1) {
				tempType += j;
			}
		}
		binData[i].type = tempType;
	}
	return res.render("index", { filterData: filterData, role: role, locationBin: binData, locationGarbageFound: garbageData });
}

const upload = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const files = req.files
	const { id } = req.body;

	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1;
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const dateToday = yyyy + '' + mm + '' + dd;
	var fileName = [];
	var count = 0;
	if (!files) return res.status(200).json({ status: 0, msg: "No file" });
	Object.keys(files).forEach(key => {
		// if(count > 0) return;
		var name = files[key].name;
		var index = name.lastIndexOf('.');
		var ext = name.substring(index, name.length);
		if (['.jpeg', '.jpg', '.png', '.webp'].includes(ext)) {
			var randomName = Math.random().toString().slice(2, 10);
			fileName[count] = dateToday + "_" + randomName + ext;
			if (id == 0) {
				const filepath = path.join(__dirname, '../uploads/temp', fileName[count]);
				files[key].mv(filepath, (err) => {
					if (err) return res.status(500).json({ result: 0 });
				})
			} else {
				const filepath = path.join(__dirname, '../uploads/bins', fileName[count]);
				files[key].mv(filepath, (err) => {
					if (err) return res.status(500).json({ result: 0 });
				})
				const objBinModel = new BinModel();
				var success = objBinModel.addImage(id, fileName[count], decoded.id);
			}
			count++;
		}
	})

	if (count > 0) {
		return res.status(200).json({ status: 1, data: fileName });
	} else {
		return res.status(200).json({ status: 0, msg: "Error" });
	}

}

const deleteImage = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const { fileName, folder } = req.body;

	if (folder == "temp") {
		const imgPath = path.join(__dirname, '../uploads/temp', fileName);
		fs.unlinkSync(imgPath);
		return res.status(200).json({ status: 1, msg: "success" });
	} else {
		const objBinModel = new BinModel();
		var imgData = await objBinModel.getImageByName(fileName);
		if(!imgData) return res.status(200).json({ status: 0, msg: "No image" });
		if (imgData.creator == decoded.id || decoded.role == 1) {
			const imgPath = path.join(__dirname, '../uploads/bins', fileName);
			fs.unlinkSync(imgPath);
			var result = objBinModel.deleteImageByName(fileName);
			return res.status(200).json({ status: 1, msg: "success" });
		}
	}
	return res.status(200).json({ status: 0, msg: "Error" });

}


module.exports = {
	homeView, upload, deleteImage
};