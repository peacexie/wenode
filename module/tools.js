
var Config = require('./config'),
    fs     = require('fs');

// debug/save-log
exports.debug = function(erno, ermsg){
    if(Config.debug){
        var now = new Date();
        var ermsg = typeof(ermsg)=='object' ? JSON.stringify(ermsg) : ermsg;
        var data = now.toLocaleString()+' ['+erno+'] '+ermsg+'\n';
        var fplog = Config.logfile.replace('/Y-','/'+now.getFullYear()+'-');
            fplog = fplog.replace('-m-', '-'+(now.getMonth()+1)+'-').replace('-d.', '-'+now.getDate()+'.');
        fs.appendFile(_dir+fplog, data, 'utf8', function(fserr){  
            if(fserr) console.log(fserr);
        });
    }
    console.log(erno,ermsg);
}

exports.fsRead = function(fp, encode, redata, basdir){
    var dir = basdir ? basdir : _dir;
    var data='', err=1;
    try{ // 不建议这样使用?!
        if(!encode) encode = 'utf-8';
        data = fs.readFileSync(dir+fp, encode);
        err = 0;
    }catch(ex){}
    if(redata) return data;
    var re = {'err':err, 'data':data};
    return re;
}

exports.fsHas = function(path,basdir) {
    var dir = basdir ? basdir : _dir;
    try{
        fs.accessSync(dir+path, fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

exports.getPos = function(data,k1,k2) {
    if(!k2){ k1 = '<'+k1+'>'; k2 = '</'+k1+'>'; }
    var p1 = data.indexOf(k1),
        p2 = data.indexOf(k2);
    if(p1>=0 && p2>p1){
        return data.substring(p1+k1.length, p2);
    }else{
        return '';
    }
}
