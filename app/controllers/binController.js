var BinModel = require('../models/binModel');
const Auth = require('../middleware/auth');
const fileUpload = require("express-fileupload");
const path = require('path');
const fs = require('fs');

const binView = async (req, res) => {
	return res.render("./bin/index", {});
}

const addBinView = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.render("./template/refresh");

	const { lat, lon } = req.body;
	return res.render("./bin/formAdd", { lat: lat, lon: lon });
}

const editBinView = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);

	const { id } = req.body;
	const objBinModel = new BinModel();
	var binData = await objBinModel.getDetail(id);

	if (binData == null) return res.render("./template/refresh");

	var imageData = await objBinModel.getImages(id);

	var permission = 0;
	if (decoded) {
		if (binData.creator == decoded.id || decoded.role == 1) {
			permission = 1;
		}
	}
	
	// console.log(binData)
	return res.render("./bin/formEdit", { binData: binData, imageData: imageData, permission: permission });
}

const addBin = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const { lat, lon, title, location, description, type, affiliation, arrImage } = req.body;
	// console.log(arrImage);
	if (lat == "" || lon == "" || title == "" || location == "" || description == "" || type == "" || affiliation == "" || arrImage == "") {
		return res.status(500).json({ result: 0, msg: "Required data" });;
	}
	
	const objBinModel = new BinModel();
	var result = await objBinModel.addBin(lat, lon, title, affiliation, location, description, type, decoded.id);

	var splitImage = arrImage.split(",");
	for (let i = 0; i < 5; i++) {
		if (splitImage[i]) {
			var oldPath = path.join(__dirname, '../uploads/temp', splitImage[i]);
			var newPath = path.join(__dirname, '../uploads/bins', splitImage[i]);

			fs.rename(oldPath, newPath, async function (err) {
				if (err) {
					throw err;
				} else {
					var success = await objBinModel.addImage(result, splitImage[i], decoded.id);
				}
			})
		}
	}

	if (result > 0) {
		return res.status(200).json({ status: 1, msg: "Success" });
	} else {
		return res.status(200).json({ status: 0, msg: "Error" });
	}

}

const updateBin = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const { id, lat, lon, title, location, description, type, affiliation } = req.body;

	const objBinModel = new BinModel();
	var binDetail = await objBinModel.getDetail(id);
	if (binDetail == null) return res.status(200).json({ status: 0, msg: "No data" });

	if (binDetail.creator != decoded.id && decoded.role != 1) {
		return res.status(200).json({ status: 0, msg: "No permission" });
	}

	var result = await objBinModel.updateBin(id, lat, lon, title, affiliation, location, description, type);
	if (result == 1) {
		return res.status(200).json({ status: 1, msg: "Success" });
	} else {
		return res.status(200).json({ status: 0, msg: "Error" });
	}

}

const deleteBin = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const { id } = req.body;

	const objBinModel = new BinModel();
	var binDetail = await objBinModel.getDetail(id);
	if (binDetail == null) return res.status(200).json({ status: 0, msg: "No data" });

	if (binDetail.creator != decoded.id && decoded.role != 1) {
		return res.status(200).json({ status: 0, msg: "No permission" });
	}

	var result = await objBinModel.deleteBin(id);
	var deleteSuccess = await objBinModel.deleteImageByBinID(id);

	if (result == 1) {
		return res.status(200).json({ status: 1, msg: "Success" });
	} else {
		return res.status(200).json({ status: 0, msg: "Error" });
	}

}

module.exports = {
	binView, addBinView, addBin, editBinView, updateBin, deleteBin
};