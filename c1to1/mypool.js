
// 连接数据库
var mysql = require('mysql'),
config = require('./scfg');

var pool = mysql.createPool(config.mysql);

module.exports = function(sql, data, callback){
    pool.getConnection(function(cerr, conn){
        if(cerr){
            callback(cerr, null, null);
        }else{
            conn.query(sql, data, function(qerr, rows, fields){
            conn.release();
            callback(qerr, rows, fields);
          });
        }
    });
};
