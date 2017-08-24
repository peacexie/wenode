
var Config = require('./config'),
    Tools  = require('./tools'),
    Mintpl = require('./mintpl'),
    url    = require("url"),
    util   = require('util'),
    fs     = require("fs");

function ViewOP(req, res) {

    var mkvs = {}; // path,dir,mkv,query,ourl; type,mod,key,view,err

    // 运行入口
    this.run = function() { 
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
        return this.view();
    };
    // 初始化mkv
    this.init = function(requrl){
        ourl = url.parse(requrl, true);
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
            var flag = /^[a-z]{1}[\w]{0,24}$/.test(tmp[i]);
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
    // 显示操作
    this.view = function(){
        var data = {'test':'valabc', 'title':'vtitle',}; //xxx();
        // 直接返回数据:vtype(html,json,jsonp,xml),callback
        var q = mkvs.query;
        if( (q.callback && !q.vtype) || (q.vtype && q.vtype!='html') ){
            vtype = (q.callback && !q.vtype) ? 'jsonp' : q.vtype;
            this.head(vtype, 200);
            res.write(util.inspect(data));
            res.end();
            Tools.debug('data:'+vtype, q);
            return 
        }
        // 找模板
        var mtpl = new Mintpl(mkvs);
        var tplname = mtpl.get();
        if(tplname){
            // 模板显示
            this.head('html', 200);
            var html = mtpl.fill(data);
            res.write(html);
            res.end();
            Tools.debug('http:'+200, mkvs.dir+'/'+tplname);
        }else{
            // 模板错误
            var tpl = mkvs.dir+'/'+mkvs.mod+'/('+(mkvs.key+'|'+mkvs.type)+')';
            this.static('NOT found template : '+tpl+'.htm',404);
        }
    }

    // 静态显示
    this.static = function(fp, code){
        var f4 = code==403 || code==404;
        if(!f4){
            var re = Tools.fsRead(fp);
            code = re.err ? 404 : 200;
        }
        if(code==200){
            this.head(fp, code);
            res.write(re.data);
        }else{
            this.head('text', code);
            res.write('Error '+code+'!\n'+fp);
        }
        res.end();
        Tools.debug('http:'+code, fp);
    }

    // header
    this.head = function(fp, code){
        ext = fp.indexOf('.')>=0 ? fp.substring(fp.lastIndexOf(".")+1,fp.length) : fp;
        cfgs = {
            // text,html
            'txt'   : 'text/plain',
            'text'  : 'text/plain',
            // asp,aspx,jsp,php
            'htm'   : 'text/html',
            'html'  : 'text/html',
            // css,js,data(xml,json,jsonp)
            'css'   : 'text/css',
            'js'    : 'text/javascript', 
            'xml'   : 'text/xml', 
            'json'  : 'application/json',
            'jsonp' : 'application/jsonp',
            // image
            'ico'   : 'image/x-icon',
            'jpg'   : 'image/jpeg',
            'jpeg'  : 'image/jpeg',
            'gif'   : 'image/gif',
            'png'   : 'image/png',
            'tif'   : 'image/tiff',
            // down
            'down'  : 'application/octet-stream',
        };
        code = code ? code : 200;
        type = cfgs[ext] ? cfgs[ext] : cfgs['html']; 
        res.writeHead(code, {'Content-Type' : type+'; charset=utf-8'});
    }
};
module.exports = ViewOP;