var GarbageModel = require('../models/garbageModel');
var UserModel = require('../models/userModel');
const Auth = require('../middleware/auth');
const sha256 = require('sha256');

const userView = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.redirect('/');

	return res.render("./user/index", { role: decoded.role });
}

const getProfile = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.render("./template/refresh");

	const objUserModel = new UserModel();
	var result = await objUserModel.getProfile(decoded.id);
	return res.render("./user/profile", { profileData: result });
}

const getPasswordForm = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.render("./template/refresh");

	return res.render("./user/passwordForm");
}

const updatePassword = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const { oldPass, newPass } = req.body;
	if (oldPass.length < 6 || newPass.length < 6) {
		return res.status(200).json({ status: 0, msg: "Password must be at least 6 characters" });
	}

	if (!oldPass || !newPass) {
		return res.status(200).json({ status: 0, msg: "Password is required" });
	}

	const objUserModel = new UserModel();
	var data = await objUserModel.getProfile(decoded.id);
	if (sha256(oldPass) != data.password) {
		return res.status(200).json({ status: 0, msg: "Incorrect old password" });
	} else {
		var result = await objUserModel.updatePassword(sha256(newPass), decoded.id);
		if (result == 1) {
			return res.status(200).json({ status: 1 });
		} else {
			return res.status(200).json({ status: 0, msg: "Error" });
		}
	}
}

const updateProfile = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.status(200).json({ status: 0, msg: "Not login" });

	const { fname, lname } = req.body;
	if (!fname || !lname) {
		return res.status(200).json({ status: 0, msg: "Please input data" });
	}

	const objUserModel = new UserModel();
	var result = await objUserModel.updateProfile(fname, lname, decoded.id);
	if (result == 1) {
		return res.status(200).json({ status: 1 });
	} else {
		return res.status(200).json({ status: 0, msg: "Error" });
	}

}


module.exports = {
	userView, getProfile, getPasswordForm, updatePassword, updateProfile
};