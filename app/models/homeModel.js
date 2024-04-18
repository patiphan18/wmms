var con = require('../config/database');

module.exports = class HomeModel {

    constructor() {
        this.table = "users";
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

}