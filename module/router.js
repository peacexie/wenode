
var Config = require('./config'),
    Tools  = require('./tools'),
    ViewOP = require('./viewop'),
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
        if(mkvs.dir=='forbid' || mkvs.dir=='static' || mkvs.path=='/favicon.ico'){
            var code = mkvs.dir=='forbid' ? 403 : 200;
            return vop.static(mkvs.path, code);
        }
        // 用户扩展处理
        var fop = '/'+mkvs.dir+'/viewop.js';
        var flag = Tools.fsHas(fop);
        if(flag){
            var sop = require(_dir+fop); // 子路由
            return new sop(req, res).run(mkvs);
        }
        // mkv-处理
        return vop.view(mkvs);
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
            mkvs.err = 'Error mkv [a]';
            return;
        } 
        for (var i = 0; i < tmp.length; i++) {
            var flag = /^[0-9a-z]{1}[\w]{0,24}$/.test(tmp[i]);
            if(!tmp[i] || !flag){
                mkvs.err = 'Error mkv [b]';
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

