
var mysql  = require('mysql'),
    fs     = require('fs'),
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

// debug/save-log
exports.debug = function(erno,ermsg){
    if(Config.debug){
        var now = new Date();
        var ermsg = typeof(ermsg)=='object' ? JSON.stringify(ermsg) : ermsg;
        var data = now.toLocaleString()+' ['+erno+'] '+ermsg+'\n';
        var fplog = Config.logfile.replace('/Y-','/'+now.getFullYear()+'-');
            fplog = fplog.replace('-m-','-'+(now.getMonth()+1)+'-').replace('-d.','-'+now.getDate()+'.');
        fs.appendFile(_dir+fplog,data,'utf8',function(fserr){  
            if(fserr) console.log(fserr);
        });
    }
    console.log(erno,ermsg);
}

// header
exports.head = function(res,fp,code){
    ext = fp.indexOf('.')>=0 ? fp.substring(fp.lastIndexOf(".")+1,fp.length) : fp;
    cfgs = {
        'text'  : 'text/plain',
        'html'  : 'text/html',
        'css'   : 'text/css',
        'js'    : 'text/javascript', 
        'json'  : 'application/json',
        'jsonp' : 'application/jsonp',
        'xml'   : 'text/xml', 
        'down'  : 'application/octet-stream',
    };
    code = code ? code : 200;
    type = cfgs[ext] ? cfgs[ext] : cfgs['html']; //console.log(code,ext,type,cfgs[ext]);
    res.writeHead(code, {'Content-Type' : type+'; charset=utf-8'});
}

exports.showStatic = function(res,fp,code){
    var _me = this;
    fs.readFile(_dir+fp, 'utf8', function(err, data){
        if(err){
            _me.head(res,'html',404);
            res.write('Error 404!');
        }else{
            _me.head(res,fp,code);
            res.write(data);
        }
        res.end();
    });
}

/*
exports.fileExists = function(path) {
    var flag = false;
    //console.log('aaaa\n'+_dir+path);
    fs.exists(_dir+path, function(exists) {  
        return exists;
        flag = exists; 
        console.log(exists); 
    });
    console.log('aaaa\n'+flag);
    //return falg;
    flag = flag ? fs.lstatSync(_dir+path).isFile() : false;
    console.log('aaaa\n'+flag);
    return flag;
    //return stat.isFile();
}
*/
