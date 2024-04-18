var con = require('../config/database');

module.exports = class CollectModel {

    constructor() {
        this.table = "collect";
    }

    getAll(creator) {
        var sql = 'SELECT * FROM collect LEFT JOIN collect_type ON collect_type.id=collect.type WHERE collect.creator = ? ORDER BY collect.createdate DESC';
        return new Promise((resolve, reject) => {
            con.query(sql, [creator], function (err, results) {
                return err ? reject(err) : resolve(results);
            }
            );
        });
    }

    getLastTenCollect(creator, year) {
        if(year == 0) {
            var sql = 'SELECT * FROM collect LEFT JOIN collect_type ON collect_type.id=collect.type WHERE collect.creator = ? ORDER BY collect.createdate DESC LIMIT 10';
            return new Promise((resolve, reject) => {
                con.query(sql, [creator], function (err, results) {
                    return err ? reject(err) : resolve(results);
                }
                );
            });
        } else {
            var sql = 'SELECT * FROM collect LEFT JOIN collect_type ON collect_type.id=collect.type WHERE collect.creator = ? AND YEAR(collect.createdate) = ? ORDER BY collect.createdate DESC LIMIT 10';
            return new Promise((resolve, reject) => {
                con.query(sql, [creator, year], function (err, results) {
                    return err ? reject(err) : resolve(results);
                }
                );
            });
        }
    }

    getDetail(id) {
        var sql = 'SELECT * FROM ' + this.table + ' WHERE id = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [id], function (err, results) {
                return err ? reject(err) : resolve(results[0]);
            }
            );
        });
    }

    getAllType() {
        var sql = 'SELECT * FROM collect_type ORDER BY name ASC';
        return new Promise((resolve, reject) => {
            con.query(sql, [], function (err, results) {
                return err ? reject(err) : resolve(results);
            }
            );
        });
    }

    getAllCollectGroupByCreator() {
        var sql = 'SELECT SUM(weight) AS weight, SUM(carbon) AS carbon, creator, email, fname, lname, MAX(createdate) AS lastdate FROM collect LEFT JOIN user ON collect.creator=user.id GROUP BY collect.creator ORDER BY carbon DESC';
        return new Promise((resolve, reject) => {
            con.query(sql, [], function (err, results) {
                return err ? reject(err) : resolve(results);
            }
            );
        });
    }

    getSummaryByCreator(id, year) {
        if(year == 0) {
            var sql = 'SELECT SUM(weight) AS weight, SUM(carbon) AS carbon FROM collect WHERE creator = ?';
            return new Promise((resolve, reject) => {
                con.query(sql, [id], function (err, result) {
                    return err ? reject(err) : resolve(result[0]);
                }
                );
            });
        } else {
            var sql = 'SELECT SUM(weight) AS weight, SUM(carbon) AS carbon FROM collect WHERE creator = ? AND YEAR(collect.createdate) = ?';
            return new Promise((resolve, reject) => {
                con.query(sql, [id, year], function (err, result) {
                    return err ? reject(err) : resolve(result[0]);
                }
                );
            });
        }
    }

    getSummary() {
        var sql = 'SELECT SUM(weight) AS weight, SUM(carbon) AS carbon FROM collect ';
        return new Promise((resolve, reject) => {
            con.query(sql, [], function (err, result) {
                return err ? reject(err) : resolve(result[0]);
            }
            );
        });
    }

    addCollect(weight, carbon, image, type, creator) {
        var sql = 'INSERT INTO ' + this.table + ' (weight, carbon, image, type, creator) VALUES (?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            con.query(sql, [weight, carbon, image, type, creator], function (err, result) {
                // console.log(result.insertId);
                return err ? 0 : resolve(result.insertId);
            }
            );
        });
    }

}