
var Config = require('./config'),
    Tools  = require('./tools'),
    Mintpl = require('./mintpl'),
    Mycurd = require('./mycurd'),
    url    = require('url'),
    util   = require('util'),
    fs     = require('fs');

function dbData(mkvs) {

    var data={}, cdb=[], tab='', kid=''; // 

    // 运行入口
    this.run = function(cb0) { 
        var _me = this;
        this.dbRes(function(){
            //cb(data);
            //*
            _me.dbExt(function(){
                cb0(data);
            });//*/
        });
    };

    // dbRes
    this.dbRes = function(cb){
        // mkv:data
        if(Config['dbmod'][mkvs.mod]){
            cdb = Config['dbmod'][mkvs.mod]; // ["docs", 'did']
            tab = (cdb[0] ? cdb[0]+'_' : '')+mkvs.mod; kid = cdb[1];
            if(mkvs.type=='mhome' || mkvs.type=='mtype'){
                this.dbList(function(res){
                    data.res = res;
                    cb && cb();
                });
            }else if(mkvs.type=='detail'){
                this.dbDetail(function(res){
                    data.res = res;
                    cb && cb();
                });
            }
        }
    }
    // dbExt
    this.dbExt = function(cb){
        // 用户扩展处理
        var cp = '/'+mkvs.dir+'/module/'+mkvs.mod+'Ctrl.js';
        var flag = Tools.fsHas(cp);
        if(flag){
            var modCtrl = require(_dir+cp);
            var ctrl = new modCtrl(mkvs, data); // 控制器
            var act = mkvs.type+'Act';
            if(typeof(ctrl[act])=='function'){
                ctrl[act](function(res){
                    data.ext = res;
                    cb && cb();
                });
            }
        }
    }

    // dbList
    this.dbList = function(cb){
        var opt = {};
        if(mkvs.query.pid){ opt.where = "pid='"+mkvs.query.pid+"'"; }
        opt.order = kid + ' DESC';
        opt.limit = 10;
        Mycurd.get(tab, opt, function(res){
            cb && cb(res);
        });
    }

    // dbDetail
    this.dbDetail = function(cb){
        var opt = {};
        opt.where = kid+"='"+mkvs.kid+"'";
        Mycurd.get(tab, opt, function(res){
            cb && cb(res);
        });
    }

    // !!! 自行扩展,执行前自行判断权限 !!! 

    // dbAdd
    this.dbAdd = function(cb){
        //xxx
    }
    // dbUpd
    this.dbUpd = function(cb){
        //xxx
    }
    // dbDel
    this.dbDel = function(cb){
        //xxx
    }

};
module.exports = dbData;

/*
--------------------------------- POST 
        
Tools.debug('xxx1:', typeof(this['test1'])); // xxx1: function
Tools.debug('xxx1:', typeof(this['test2'])); // xxx1: undefined
this['test1'](123); // xxx2 test1:123
this.test1= function(aaa){
    Tools.debug('xxx2', 'test1:'+aaa);
}

news-add + post
news-upd + post
news-del + id:2017-ab-1234
news
news-n1002
news.2017-ab-1234

--------------------------------- POST 

http://www.runoob.com/nodejs/node-js-get-post.html

var http = require('http');
var querystring = require('querystring');
 
http.createServer(function(req, res){
    // 定义了一个post变量，用于暂存请求体的信息
    var post = '';     
 
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    req.on('data', function(chunk){    
        post += chunk;
    });
 
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function(){    
        post = querystring.parse(post);
        res.end(util.inspect(post));
    });
}).listen(3000);

------------------------------ 

*/
