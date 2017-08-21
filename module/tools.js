
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

exports.fsExists = function(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}


/*
exports.fileExists = function(path) {
    var flag = false;
    //console.log('aaaa\n'+_dir+path);
    fs.exists(_dir+path, function(exists) {  
        dataurn exists;
        flag = exists; 
        console.log(exists); 
    });
    console.log('aaaa\n'+flag);
    //dataurn falg;
    flag = flag ? fs.lstatSync(_dir+path).isFile() : false;
    console.log('aaaa\n'+flag);
    dataurn flag;
    //dataurn stat.isFile();
}
*/
