var con = require('../config/database');

module.exports = class GarbageModel {

    getAllGarbageStep() {
        var sql = 'SELECT * FROM garbage_step ORDER BY createdate DESC';
        return new Promise((resolve, reject) => {
            con.query(sql, [], function (err, results) {
                return err ? reject(err) : resolve(results);
            }
            );
        });
    }

    getAllGarbageFound() {
        var sql = 'SELECT * FROM garbage_found WHERE status = 1';
        return new Promise((resolve, reject) => {
            con.query(sql, [], function (err, results) {
                return err ? reject(err) : resolve(results);
            }
            );
        });
    }

    getGarbageFound(id) {
        var sql = 'SELECT * FROM garbage_found WHERE id = ? LIMIT 1';
        return new Promise((resolve, reject) => {
            con.query(sql, [id], function (err, results) {
                return err ? reject(err) : resolve(results[0]);
            }
            );
        });
    }

    getCountByLevelStep() {
        var sql = `SELECT count(case when difficult_level = 1 then 1 else null end) as easy,
            count(case when difficult_level = 2 then 1 else null end) as medium,
            count(case when difficult_level = 3 then 1 else null end) as hard 
            FROM garbage_step`;
        return new Promise((resolve, reject) => {
            con.query(sql, [], function (err, results) {
                return err ? reject(err) : resolve(results[0]);
            }
            );
        });
    }

    addFoundGarbage(lat, lon, description, image, creator) {
        var sql = 'INSERT INTO garbage_found (latitude, longitude, description, image, creator) VALUES (?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            con.query(sql, [lat, lon, description, image, creator], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

    addGarbageStep(lat, lon, type, image1, image2, image3, image4, difficult, description, creator) {
        var sql = 'INSERT INTO garbage_step (latitude, longitude, type, img_before, img_pickup, img_shoot, img_after, difficult_level, description, creator) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            con.query(sql, [lat, lon, type, image1, image2, image3, image4, difficult, description, creator], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

    clearGarbage(id) {
        var sql = 'UPDATE garbage_found SET status = 0 WHERE id = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [id], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }
}