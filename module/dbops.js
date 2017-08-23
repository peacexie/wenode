
var mysql  = require('mysql'),
    Config = require('./config'),
    conn; // db-conn

// db-error
exports.myHandle = function(myerr) {
    if(!myerr) return;
    // 如果是连接断开，自动重新连接
    if (myerr.code === 'PROTOCOL_CONNECTION_LOST') {
        conn.connect();
    } else {
        console.error(myerr.code || myerr.message);
    }
}

// db-ins, 插入数据
exports.myIns = function(room,user,msgs,curIP,mstamp){ 
    var arr = room.split('.');
    if(!arr[0] || !arr[1] || !user.uid){
        Tools.debug('myins.501','Empty:room/user');
        return;
    }
    var stamp = parseInt(mstamp/1000);
    // db-conn, 中断了重连
    if(!conn){
        conn = mysql.createConnection(Config.mysql);     
        conn.connect();
        //conn.on('error', myHandle); // 
    }
    // db-insert
    var addSql = 'INSERT INTO '+Config.dbtab+'(type,ufrom,uto,msgs,aip,atime,auser) VALUES (?,?,?,?,?,?,?)';
    var addParams = [arr[0],user.uid,arr[1],msgs,curIP,stamp,user.uname]; 
    conn.query(addSql,addParams,function (myerr, result) {
        if(myerr){
            Tools.debug('myins.502',myerr.message);
            return;
        }
    });
}
