var con = require('../config/database');

module.exports = class UserModel {

    constructor() {
        this.table = "user";
    }

    getProfile(id) {
        var sql = 'SELECT * FROM ' + this.table + ' WHERE id = ? ';
        return new Promise((resolve, reject) => {
            con.query(sql, [id], function (err, results) {
                return err ? reject(err) : resolve(results[0]);
            }
            );
        });
    }

    updatePassword(newPass, id) {
        var sql = 'UPDATE ' + this.table + ' SET password = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [newPass, id], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

    updateProfile(fname, lname, id) {
        var sql = 'UPDATE ' + this.table + ' SET fname = ?, lname = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [fname, lname, id], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

}