var { MongoClient } = require("mongodb");

var CONN_DB_STR = "mongodb://localhost:27017/wuhan"; //公网ip 地址  //wuhan为数据库名



module.exports = {
    conn(callback) {
        MongoClient.connect(CONN_DB_STR, (err, db) => {
            try {
                console.log("数据库连接成功")
                callback(null, db);
            } catch (err) {
                console.log(err);
                callback(err, null);
            }
        })
    }
}