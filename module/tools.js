
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

exports.fsHas = function(path, basdir) {
    var dir = basdir ? basdir : _dir;
    try{
        fs.accessSync(dir+path, fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

exports.getPos = function(data, k1, k2) {
    if(!k2){ k1 = '<'+k1+'>'; k2 = '</'+k1+'>'; }
    var p1 = data.indexOf(k1),
        p2 = data.indexOf(k2);
    if(p1>=0 && p2>p1){
        return data.substring(p1+k1.length, p2);
    }else{
        return '';
    }
}

// 同步调用
exports.exeOrder = function(funcs,count,sum){
    if(count==sum){
        return; 
    }else{
        funcs[count](function(){
            count++;
            exeOrder(funcs,count,sum);
        });
    }  
}
/*
    var funcs = [func1,func2,func3];
    var len = funcs.length;
    exeOrder(funcs,0,len);
*/

// 
exports.safeFill = function(str, test){
    // fill ", ', <, >
    var reg = new RegExp(/(\%22|\%27|\%3C|\%3E)/, 'gi');
    var rep = {"x22":"&quot;", "x27":"&#039;", "x3C":"[", "x3E":"]",}; 
    if(test){ // &lt; , &gt;
        return str.match(reg); 
    }else{
        return str.replace(reg, function(m, p1) {
            return rep['x'+p1.replace('%','')];
        }); 
    }
}
