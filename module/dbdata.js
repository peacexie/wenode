
var Config = require('./config'),
    Tools  = require('./tools'),
    Mintpl = require('./mintpl'),
    url    = require("url"),
    util   = require('util'),
    fs     = require("fs");

function dbData(mkvs) {

    //var mkvs = {}; // path,dir,mkv,query,ourl; type,mod,key,view,err

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

    // mhome
    this.mhome = function(){
        ourl = url.parse(requrl, true);
        mkvs.ourl = ourl;
    }
    // mtype
    this.mtype = function(){
        var tmp=[]; 

    }
    // detail
    this.detail = function(){
        var data = {'test':'valabc', 'title':'vtitle',}; //xxx();
        // 直接返回数据:vtype(html,json,jsonp,xml),callback 
    }

    // 静态显示
    this.static = function(fp, code){

    }

};
module.exports = dbData;