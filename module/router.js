
var Config = require('./config'),
    Tools  = require('./tools'),
    //ViewOP = require('./viewop'),
    url    = require("url"),
    util   = require('util'),
    fs     = require("fs");

function Router(req, res) {

    var mkvs = {}; //path, dir, mkv, query, ourl; 

    this.run = function() { 
        this.init(req.url);
        var vop = new ViewOP(req, res);
        // 静态/禁访问:目录
        if(mkvs.dir=='forbid' || mkvs.dir=='static'){
            var code = mkvs.dir=='forbid' ? 403 : 200;
            return vop.static(mkvs.path,code);
        }else{
            var fp = '/'+mkvs.dir+'/viewop.js';
            var flag = Tools.fsHas(fp);
            if(flag){
                // 用户扩展处理
                var sRout = require(_dir+fp);
                var sub = new sRout(req, res);
                return sub.run(mkvs); // 子路由
            }else{
                // sys-mkv-处理
                //_me.mkview(mkvs.mkv);
                return vop.mkview(mkvs);
            }
        }
    };

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
        delete ourl['query'];
        mkvs.ourl = ourl;
    }

};
module.exports = Router;

/*



        /*
        }else if(dir=='info'){
            tpl.head('text');
            res.write('path:'+util.inspect(path)+"\n");
            res.write('dir:'+util.inspect(dir)+"\n");
            res.write('mkv:'+util.inspect(mkv)+"\n");
            res.write('query:'+util.inspect(query)+"\n");
            res.write('ourl:'+util.inspect(ourl)+"\n");
            res.write("\n");
            res.end(util.inspect(ourl));
        // index - MVC处理
        }else if(dir=='index'){
            //if(mkv.indexOf('.')<=0) mkv += '.htm';
            var fp = '/index/views/'+mkv;
            tpl.static(fp,200);
            return;
        // mkv - MVC处理
        }else{
            tpl.head('text');
            res.write('mkv deel!');
            res.end();
        }*-/

/rest/module/file.js
/rest/view/style.css
/rest/news-add
/rest/news-edit
/rest/news-del
/rest/news
/rest/news.2017-ab-1234

[/index]/module/
[/index]/view/
[/index]/router.js
[/index]/index.htm
[/index]/about.htm
[/index]/info.htm

    /group/mkv?p1=v1
    /dev/news
    /dev/news-sub1
    /dev/news.1234
    / <_home>
    /abc/efg/xxx/aa
*/

