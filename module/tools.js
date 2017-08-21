
var Config = require('./config'),
    fs     = require("fs");

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

exports.fsRead = function(fp,basdir){
    var dir = basdir ? basdir : _dir;
    var data='', err=1;
    try{ // 不建议这样使用?!
        data = fs.readFileSync(dir+fp, 'utf-8');
        err = 0;
    }catch(ex){}
    var re = {'err':err, 'data':data};
    return re;
}

exports.fsHas = function(path,basdir) {
    var dir = basdir ? basdir : _dir;
    try{
        fs.accessSync(dir+path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}


/*
exports.fileExists = function(path) {
    var flag = false;

}
*/
