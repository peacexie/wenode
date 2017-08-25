
var mysql  = require('mysql'),
    Tools  = require('./tools'),
    Config = require('./config'),
    conn; // db-conn

// db-error
exports.handle = function(myerr) {
    if(!myerr) return;
    // 如果是连接断开，自动重新连接
    if (myerr.code === 'PROTOCOL_CONNECTION_LOST') {
        conn.connect();
    } else {
        console.error(myerr.code || myerr.message);
    }
}
// db-con
exports.con = function() {
    if(!conn){ // 中断了重连
        conn = mysql.createConnection(Config.mysql);     
        conn.connect();
        //conn.on('error', this.handle); // 
    }
}
// db-query
exports.query = function(sql, params, cb){
    this.con(); 
    conn.query(sql,params,function (myerr, res) {
        if(myerr){
            Tools.debug('mycurd.upd', myerr.message);
            return;
        }else{
            cb && cb(res);
        }
    });
}
// db-table
exports.tab = function(tab){
    return Config.mysql.pre + tab + Config.mysql.suf;
}

// db-ins, 插入数据
exports.ins = function(tab, data, cb){
    var fields = vals = '', params = [];
    for(var key in data){
        fields += (fields ? ',' : '') + key;
        vals += (vals ? ',' : '') + '?';
        params.push(data[key]);
    }
    var sql = 'INSERT INTO '+this.tab(tab)+' ('+fields+') VALUES ('+vals+')';
    this.query(sql, params, cb);
}
/*
Mycurd.ins('chatroom', data, function(res){
    Tools.debug('db.ins, id=',res.insertId);
});
*/

// db-upd, 更新数据
exports.upd = function(tab, data, where, cb){
    var fields = '', params = [];
    for(var key in data){
        fields += (fields ? ',' : '') + key + '=?';
        params.push(data[key]);
    }
    var sql = 'UPDATE '+this.tab(tab)+' SET '+fields+' WHERE '+where;
    this.query(sql, params, cb);
}
/*
Mycurd.upd('chatroom', {"ufrom":"aaa","msgs":"bbb"}, "id=333 AND uto=1251", function(res){
    Tools.debug('db.upd, affected=',res.affectedRows);
});
*/

// db-get, 查询数据
exports.get = function(tab, opt, cb){
    var fields = opt.fields ? opt.fields : '*';
    var where = opt.where ? (' WHERE '+opt.where) : '';
    var order = opt.order ? (' ORDER BY '+opt.order) : '';
    var limit = opt.limit ? (' LIMIT '+opt.limit) : '';
    var sql = 'SELECT '+fields+' FROM '+this.tab(tab)+where+order+limit;
    this.query(sql, {}, cb);
}
/* opt = {fields, where, limit, order}
Mycurd.get('chatroom', {"fields":"id,type,uto,msgs","where":"id>=330"},function(res){
    Tools.debug('db.get, get=', res);
});
*/

// db-del, 删除数据
exports.del = function(tab, where, cb){
    where = where ? where : "1=2";
    var sql = 'DELETE FROM '+this.tab(tab)+' WHERE ' + where;
    this.query(sql, {}, cb);
}
/*
Mycurd.del('chatroom', "id=329", function(res){
    Tools.debug('db.del, affected=',res.affectedRows);
});
*/

