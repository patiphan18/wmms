var con = require('../config/database');

module.exports = class BinModel {

    constructor() {
        this.table = "bin";
    }

    getAll() {
        var sql = 'SELECT * FROM ' + this.table + ' ORDER BY createdate DESC';
        return new Promise((resolve, reject) => {
            con.query(sql, [], function (err, results) {
                return err ? reject(err) : resolve(results);
            }
            );
        });
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

    getImages(binId) {
        var sql = 'SELECT * FROM bin_image WHERE bin_id = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [binId], function (err, results) {
                return err ? reject(err) : resolve(results);
            }
            );
        });
    }

    getImageByName(name) {
        var sql = 'SELECT * FROM bin_image WHERE name = ? LIMIT 1';
        return new Promise((resolve, reject) => {
            con.query(sql, [name], function (err, results) {
                return err ? reject(err) : resolve(results[0]);
            }
            );
        });
    }

    countAll() {
        var sql = 'SELECT COUNT(id) AS countAll FROM ' + this.table;
        return new Promise((resolve, reject) => {
            con.query(sql, [], function (err, result) {
                return err ? reject(err) : resolve(result[0].countAll);
            }
            );
        });
    }

    addBin(lat, lon, title, affiliation, location, description, type, creator) {
        var sql = 'INSERT INTO ' + this.table + ' (latitude, longitude, title, affiliation, location, description, type, creator) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            con.query(sql, [lat, lon, title, affiliation, location, description, type, creator], function (err, result) {
                // console.log(result.insertId);
                return err ? 0 : resolve(result.insertId);
            }
            );
        });
    }

    addImage(id, image, creator) {
        var sql = 'INSERT INTO bin_image (name, bin_id, creator) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            con.query(sql, [image, id, creator], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

    deleteImage(id) {
        var sql = 'DELETE FROM bin_image WHERE id = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [id], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

    deleteImageByName(name) {
        var sql = 'DELETE FROM bin_image WHERE name = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [name], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

    deleteImageByBinID(binID) {
        var sql = 'DELETE FROM bin_image WHERE bin_id = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [binID], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

    updateBin(id, lat, lon, title, affiliation, location, description, type) {
        var sql = 'UPDATE ' + this.table + ' SET latitude = ?, longitude = ?, title = ?, affiliation = ?, location = ?, description = ?, type = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [lat, lon, title, affiliation, location, description, type, id], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

    deleteBin(id) {
        var sql = 'DELETE FROM ' + this.table + ' WHERE id = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [id], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }
}