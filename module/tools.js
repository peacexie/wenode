
var Config = require('./config'),
    fs     = require('fs');

// * 工具

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
// 同步读取文件
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
// 同步检测文件存在
exports.fsHas = function(path, basdir) {
    var dir = basdir ? basdir : _dir;
    try{
        fs.accessSync(dir+path, fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}
// 两点定位一段文本
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
exports.exeOrder = function(funcs, count, sum, cb){
    var doFuncs = function(funcs, count, sum, cb){
        if(count==sum){
            cb && cb();
            return; 
        }else{
            funcs[count](function(){
                count++;
                doFuncs(funcs, count, sum, cb);
            });
        }  
    }
    doFuncs(funcs, count, sum, cb);
}
/*
    var funcs = [func1,func2,func3];
    var len = funcs.length;
    Tools.exeOrder(funcs,0,len);
*/
// 安全过滤
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
// 客户端IP
exports.clientIp = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    /*if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }*/
    return ip;
};

exports.cutStr = function(str, max, dot) {
    var now = 0, slen = 0;
    str_cut = new String();
    max = max * 2;
    slen = str.length;
    for (var i = 0; i < slen; i++) {
        a = str.charAt(i);
        now++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4  
            now++;
        }
        str_cut = str_cut.concat(a);
        if (now >= max) {
            str_cut = str_cut.concat(dot ? dot : '');
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；  
    if (now < max) {
        return str;
    }
}

exports.fmtStamp = function(stamp,format,mstamp){
    if(!format) format = 'y-m-d H:i';
    if(!mstamp) stamp *= 1000;
    var D = new Date(parseInt(stamp));
    var date = {
      "Y+": D.getFullYear(),
      "y+": D.getFullYear().toString().substr(2,2),
      "m+": D.getMonth() + 1,
      "d+": D.getDate(),
      "H+": D.getHours(),
      "i+": D.getMinutes(),
      "s+": D.getSeconds(),
      "S+": D.getMilliseconds()
    };
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            var val = date[k]>9 ? date[k] : '0'+date[k];
            format = format.replace(RegExp.$1, val);
        }
    }
    return format;
}
