
var Config = require('./config'),
    Tools  = require('./tools'),
    Mintpl = require('./mintpl'),
    url    = require("url"),
    util   = require('util'),
    fs     = require("fs");

function ViewOP(req, res) {

    var mkvs = {}; //path, dir, mkv, query, ourl; 
    // 运行入口
    this.run = function() { 
        this.init(req.url);
        // 静态/禁访问:目录
        if(mkvs.dir=='forbid' || mkvs.dir=='static'){
            var code = mkvs.dir=='forbid' ? 403 : 200;
            return this.static(mkvs.path,code);
        }else{
            var fp = '/'+mkvs.dir+'/viewop.js';
            var flag = Tools.fsHas(fp);
            if(flag){
                // 用户扩展处理
                var sRouter = require(_dir+fp); // 子路由
                new sRouter(req, res).run(mkvs);
            }else{
                // sys-mkv-处理
                return this.mkview();
            }
        }
    };
    // 初始化mkv
    this.init = function(requrl){
        ourl = url.parse(requrl, true);
        mkvs.path = ourl.pathname;
        var dir, mkv,
            tmp = mkvs.path.split('/'),
            len = tmp.length;
        if(Config.dircfgs[tmp[1]]){
            dir = Config.dircfgs[tmp[1]];
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
        }
        mkvs.dir = dir;
        mkvs.mkv = mkv;
        mkvs.query = ourl.query;
        delete ourl["query"];
        delete ourl["pathname"];
        delete ourl["path"];
        mkvs.ourl = ourl;
    }
    // mkv显示
    this.mkview = function(){
        var mkv3 = this.mksp(mkvs.mkv);
        var dir = '/'+mkvs.dir+'/';
        var tpl1 = mkv3.mod + '/' + mkv3.key;
        var tpl2 = mkv3.mod + '/' + mkv3.type;
        var flag = 0;
        if(mkv3.key) flag = Tools.fsHas(dir+tpl1+'.htm');
        if(flag){ 
            tpl = tpl1;
        }else{
            tpl = tpl2;
            flag = Tools.fsHas(dir+tpl2+'.htm');
        }
        if(flag){
            this.head('html', 200);
            var mtpl = new Mintpl(tpl,dir);
            var html = mtpl.run(mkvs,mkv3);
            res.write(html);
            res.write('mkv SHOW : template : ['+dir+tpl+']!');
        }else{
            // mkv 显示 
            this.head('html', 400);
            res.write(util.inspect(mkvs)+'<br>');
            res.write(util.inspect(mkv3)+'<br>');
            res.write('NOT found : template : ['+dir+tpl+']!');
        }
        res.end();
    }
    // 分离mkv
    this.mksp = function(mkv3){
        var tmp=[], mod=key=view=type='';
        if(mkv3.indexOf('.')>0){
            tmp = mkv3.split('.');
            type = 'detail';
        }else if(mkv3.indexOf('-')>0){
            tmp = mkv3.split('-');
            type = 'mtype';
        }else{ // /about
            tmp[0] = mkv3;
            type = 'mhome';
        }
        if(tmp.length>3 || !tmp[0] || !tmp[tmp.length-1]) return {"err":1+':a'};
        for (var i = 0; i < tmp.length; i++) {
            var flag = /^[\w]{1,24}$/.test(tmp[i]);
            if(!tmp[i] || !flag) return {"err":1+':b'+':'+tmp[i]+':'+flag};
        }
        mod = tmp[0];
        if(type!='mhome'){
            key = tmp[1];
            view = tmp.length==3 ? tmp[2] : '';
        }else{
            key = 'index';
        }
        return {"err":0,"mod":tmp[0],"key":key,"view":view,"type":type};
    }
    // 静态
    this.static = function(fp, code){
        var f4 = code==403 || code==404;
        var re = Tools.fsRead(f4  ? '/static/_404.htm' : fp);
        if(re.err || f4){
            code = code ? code : 400;
            this.head('html', code);
            res.write(re.data ? re.data.replace('Oops!','Error:'+code+'! ') : 'Error 404!');
        }else{
            this.head(fp, code);
            res.write(re.data);
        }
        res.end();
    }

    // header
    this.head = function(fp, code){
        ext = fp.indexOf('.')>=0 ? fp.substring(fp.lastIndexOf(".")+1,fp.length) : fp;
        cfgs = {
            'text'  : 'text/plain',
            'html'  : 'text/html',
            'css'   : 'text/css',
            'js'    : 'text/javascript', 
            'json'  : 'application/json',
            'jsonp' : 'application/jsonp',
            'xml'   : 'text/xml', 
            'down'  : 'application/octet-stream',
        };
        code = code ? code : 200;
        type = cfgs[ext] ? cfgs[ext] : cfgs['html']; //console.log(code,ext,type,cfgs[ext]);
        res.writeHead(code, {'Content-Type' : type+'; charset=utf-8'});
    }


};
module.exports = ViewOP;