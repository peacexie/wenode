
var Config = require('./config'),
    Tools  = require('./tools'),
    url    = require("url"),
    util   = require('util'),
    fs     = require("fs");

function Router(req, res) {

    var ourl, path, dir, mkv, query; 

    this.run = function() { 
        this.init(req.url);
        // 静态/禁访问:目录
        if(dir=='-dircfgs'){
            var fp = mkv=='forbid' ? '/static/_404.htm' : path;
            var code = mkv=='forbid' ? 404 : 200;
            Tools.showStatic(res,fp,code);
            return;
        }else if(dir=='info'){
            Tools.head(res,'text');
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
            Tools.showStatic(res,fp,200);
            return;
        // mkv - MVC处理
        }else{
            Tools.head(res,'text');
            res.write('mkv deel!');
            res.end();
        }
    };

    this.init = function(requrl){
        ourl = url.parse(requrl, true);
        query = ourl.query;
        path = ourl.pathname;
        var tmp = path.split('/');
        var len = tmp.length;
        if(len>=3 && Config.dircfgs[tmp[1]]){
            dir = '-dircfgs';
            mkv = tmp[1];
        }else if(len==3){ // /doc/mkv
            dir = tmp[1];
            mkv = tmp[2] ? tmp[2] : 'index';
        }else{ // /index, /about
            dir = 'index';
            mkv = tmp[1] ? tmp[1] : 'index';
        }
    }

};
module.exports = Router;

/*
    /group/mkv?p1=v1
    /dev/news
    /dev/news-sub1
    /dev/news.1234
    / <_home>
    /abc/efg/xxx/aa
*/

