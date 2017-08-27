
var Config = require('./config'),
    Tools  = require('./tools'),
    ViewOP = require('./viewop'),
    url    = require('url'),
    util   = require('util');

// 路由分发
function Router(req, res) {

    var mkvs = {}, // path,dir,mkv,query,ourl; type,mod,key,view,err
        vop = null;

    // 运行入口
    this.run = function() { 
        vop = new ViewOP(req, res);
        // init-mkv
        this.init(req.url);
        this.imkv();
        if(mkvs.err){
            return vop.static(mkvs.err, 404);
        }
        // 静态/禁访问:目录
        if(mkvs.dir=='forbid' || mkvs.dir=='static' || !Config.dirv[mkvs.dir] || mkvs.path=='/favicon.ico'){
            var code = 200;
            if(mkvs.dir=='forbid'){
                code = 403;
            }else if(mkvs.dir=='static'){
                code = 200;
            }else if(!Config.dirv[mkvs.dir]){
                code = 404;
            }
            return vop.static(mkvs.path, code);
        }
        // 处理用户扩展
        if(Config.dirv[mkvs.dir]=='viewop.js'){
            var fop = '/'+mkvs.dir+'/viewop.js';
            var sop = require(_dir+fop); // 子路由
            return new sop(req, res).run(mkvs);
        }
        // mkv-处理
        return vop.run(mkvs);
    };
    // 初始化mkv
    this.init = function(requrl){
        var ourl = url.parse(requrl, true);
        mkvs.path = ourl.pathname;
        var dir, mkv,
            tmp = mkvs.path.split('/'),
            len = tmp.length;
        if(Config.dirs[tmp[1]]){
            dir = Config.dirs[tmp[1]];
            mkv = tmp[1];
        }else if(len==3){ // /rest/news-add, /rest/news.2017-ab-1234
            dir = tmp[1];
            mkv = tmp[2] ? tmp[2] : 'index';
        }else if(len==2){ // /, /about.htm
            dir = 'index';
            mkv = tmp[1] ? tmp[1] : 'index';
            var flag = /^[\w]{1,24}$/.test(mkv);
            if(flag) mkv = 'home-' + mkv;
        }else{ // len>3, /rest/css/style.js
            dir = 'static';
            mkv = tmp[1];
        }
        mkvs.dir = dir;
        mkvs.mkv = mkv;
        mkvs.query = ourl.query;
        delete ourl["query"];
        delete ourl["pathname"];
        delete ourl["href"];
        mkvs.ourl = ourl;
    }
    // 分离imkv
    this.imkv = function(){
        // fill ", ', <, >
        if(Tools.safeFill(mkvs.ourl.search, 1)){ 
            mkvs.err = 'Error path [0]: '+Tools.safeFill(mkvs.ourl.search, 0);
            return;
        }
        var tmp=[]; 
        if(mkvs.mkv.indexOf('.')>0){
            tmp = mkvs.mkv.split('.');
            mkvs.type = 'detail';
        }else if(mkvs.mkv.indexOf('-')>0){
            tmp = mkvs.mkv.split('-');
            mkvs.type = 'mtype';
        }else{ // /about
            tmp[0] = mkvs.mkv;
            mkvs.type = 'mhome';
        }
        if(tmp.length>3 || !tmp[0] || !tmp[tmp.length-1]){
            mkvs.err = 'Error mkv [a]: '+util.inspect(mkvs.mkv);
            return;
        }
        for (var i = 0; i < tmp.length; i++) {
            var flag = /^[0-9a-z]{1}[\w]{0,24}$/.test(tmp[i]);
            if(!tmp[i] || !flag){
                mkvs.err = 'Error mkv [b]: '+util.inspect(mkvs.mkv);
                return;
            } 
        }
        mkvs.mod = tmp[0];
        mkvs.view = mkvs.key = '';
        if(mkvs.type!='mhome'){
            mkvs.key = tmp[1];
            mkvs.view = tmp.length==3 ? tmp[2] : '';
        }else{
            mkvs.key = 'index';
        }
    }

};
module.exports = Router;

/*

*/

