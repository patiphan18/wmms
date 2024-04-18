var GarbageModel = require('../models/garbageModel');
var BinModel = require('../models/binModel');
var CollectModel = require('../models/collectModel');
const Auth = require('../middleware/auth');

const reportView = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.redirect('/');

	if (decoded.role != 1) return res.redirect('/');
	return res.render("./report/index", { role: decoded.role });

}

const getBinReport = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.render("./template/refresh");
	if (decoded.role != 1) return res.redirect('/');

	const objBinModel = new BinModel();
	var result = await objBinModel.getAll();
	var arrBinCount = [0, 0, 0, 0];
	const typeList = ["General", "Compostable", "Recycle", "Hazardous"];
	for (let i = 0; i < result.length; i++) {
		var strType = result[i].type;
		for (let j = 0; j < typeList.length; j++) {
			if (strType.search(typeList[j]) != -1) {
				arrBinCount[j] += 1;
			}
		}
	}
	return res.render("./report/tableBin", { binData: result, arrBinCount: arrBinCount });
}

const getGarbageReport = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.render("./template/refresh");
	if (decoded.role != 1) return res.redirect('/');

	const objGarbageModel = new GarbageModel();
	var result = await objGarbageModel.getAllGarbageStep();
	var countLevel = await objGarbageModel.getCountByLevelStep();
	return res.render("./report/tableGarbage", { garbageData: result, countLevel: countLevel });
}

const getCollectReport = async (req, res) => {
	var decoded = await new Auth().refreshToken(req.cookies['token'], res);
	if (!decoded) return res.render("./template/refresh");
	if (decoded.role != 1) return res.redirect('/');

	const objCollectModel = new CollectModel();
	var result = await objCollectModel.getAllCollectGroupByCreator();
	var sum = await objCollectModel.getSummary();

	if (sum.weight == null) sum.weight = 0;
	if (sum.carbon == null) sum.carbon = 0;

	return res.render("./report/tableCollect", { data: result, sum: sum });
}


module.exports = {
	reportView, getBinReport, getGarbageReport, getCollectReport
};