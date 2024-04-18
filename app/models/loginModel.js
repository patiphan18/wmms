var con = require('../config/database');

module.exports = class LoginModel {

    constructor() {
        this.table = "user";
    }

    getLogin(email, password) {
        var sql = 'SELECT * FROM ' + this.table + ' WHERE email = ? AND password = ? LIMIT 1';
        return new Promise((resolve, reject) => {
            con.query(sql, [email, password], function (err, results) {
                return err ? reject(err) : resolve(results[0]);
            }
            );
        });
    }

    addUser(email, password, fname, lname, role) {
        var sql = 'INSERT INTO ' + this.table + ' (email, password, fname, lname, role) VALUES (?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            con.query(sql, [email, password, fname, lname, role], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

    getUserByEmail(email) {
        var sql = 'SELECT * FROM ' + this.table + ' WHERE email = ? LIMIT 1';
        return new Promise((resolve, reject) => {
            con.query(sql, [email], function (err, results) {
                return err ? reject(err) : resolve(results[0]);
            }
            );
        });
    }

    getResetCode(code) {
        var sql = 'SELECT * FROM ' + this.table + ' WHERE reset_code = ? AND code_expire > NOW() LIMIT 1';
        return new Promise((resolve, reject) => {
            con.query(sql, [code], function (err, results) {
                return err ? reject(err) : resolve(results[0]);
            }
            );
        });
    }

    updateResetCode(email, code, expire) {
        var sql = 'UPDATE ' + this.table + ' SET reset_code = ?, code_expire = ? WHERE email = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [code, expire, email], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }

    updateResetPassword(password, code) {
        var sql = 'UPDATE ' + this.table + ' SET password = ?, reset_code = ?, code_expire = ? WHERE reset_code = ?';
        return new Promise((resolve, reject) => {
            con.query(sql, [password, null, null, code], function (err, result) {
                return err ? reject(err) : resolve(1);
            }
            );
        });
    }
}