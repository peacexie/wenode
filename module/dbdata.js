
var Config = require('./config'),
    Tools  = require('./tools'),
    Mintpl = require('./mintpl'),
    url    = require('url'),
    util   = require('util'),
    fs     = require('fs');

function dbData(mkvs) {

    var data = {}; // 

    // 运行入口
    this.run = function() { 
        /*
        this.init(req.url);
        if(mkvs.path == "/favicon.ico"){ return; }
        this.imkv();
        if(mkvs.err){
            return this.static(mkvs.err,404);
        }
        // 静态/禁访问:目录
        if(mkvs.dir=='forbid' || mkvs.dir=='static'){
            var code = mkvs.dir=='forbid' ? 403 : 200;
            return this.static(mkvs.path,code);
        }
        var fp = '/'+mkvs.dir+'/viewop.js';
        var flag = Tools.fsHas(fp);
        // 用户扩展处理
        if(flag){
            var sRouter = require(_dir+fp); // 子路由
            return new sRouter(req, res).run(mkvs);
        }
        // sys-mkv-处理
        return this.view();*/
    };

    // exdata
    this.exdata = function(){
        //ourl = url.parse(requrl, true);
        //mkvs.ourl = ourl;
    }

};
module.exports = dbData;