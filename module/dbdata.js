
var Config = require('./config'),
    Tools  = require('./tools'),
    Mintpl = require('./mintpl'),
    Mycurd = require('./mycurd'),
    util   = require('util');

function dbData(mkvs, res) {

    var data={}, cdb=[], tab='', kid=''; // 

    // 运行入口
    this.run = function(cb) { 
        var _me = this;
        this.dbRes(function(){
            _me.dbExt(function(){
                if(!data.rdb) data.rdb = {};
                if(!data.rex) data.rex = {};
                cb(data);
            });
        });
    };

    // dbRes
    this.dbRes = function(cb){
        // mkv:data
        if(Config['dbmod'][mkvs.mod]){ // 有数据模型
            cdb = Config['dbmod'][mkvs.mod]; // ["docs", 'did']
            tab = (cdb[0] ? cdb[0]+'_' : '')+mkvs.mod; 
            kid = cdb[1];
            var act = '';
            if(mkvs.type=='mhome' || mkvs.type=='mtype'){
                act = 'dbList';
            }else if(mkvs.type=='detail'){
                act = 'dbDetail';
            }
            if(act){ // 有相关方法
                this[act](function(rdb){
                    data.rdb = rdb;
                    cb && cb();
                });
            }else{ cb && cb(); }
        }else{ cb && cb(); }
    }
    // dbExt
    this.dbExt = function(cb){
        // 用户扩展处理
        var cp = '/'+mkvs.dir+'/module/'+mkvs.mod+'Ctrl.js';
        var flag = Tools.fsHas(cp);
        if(flag){ // 有控制器
            var modCtrl = require(_dir+cp); 
            var ctrl = new modCtrl(mkvs, data.rdb); // 控制器
            var act = '', tmp1 = mkvs.key+'Act', tmp2 = mkvs.type+'Act';
            if(mkvs.type=='mtype' && typeof(ctrl[tmp1])=='function'){
                act = tmp1; // keyAct;
            }else if(typeof(ctrl[tmp2])=='function'){
                act = tmp2; // typeAct;
            }
            if(act){ // 有方法
                ctrl[act](function(rdb){
                    data.rex = rdb;
                    cb && cb();
                });
            }else{ cb && cb(); }
        }else{ cb && cb(); }
    }

    // dbList
    this.dbList = function(cb){
        // 处理: pid, page, order, limit ... 
        var opt = {};
        opt.where = '';
        if(mkvs.query.pid){ opt.where += "pid='"+mkvs.query.pid+"'"; }
        var stype = '';
        if(kid=='did') stype = 'catid';
        if(kid=='uid') stype = 'grade';
        if(stype && mkvs.key && mkvs.key!='index'){ opt.where += (opt.where ? ' AND ' : '') + stype+"='"+mkvs.key+"'"; }
        opt.order = kid + ' DESC';
        opt.limit = 10;
        Mycurd.get(tab, opt, function(rdb){
            cb && cb(rdb);
        });
    }

    // dbDetail
    this.dbDetail = function(cb){
        var opt = {};
        opt.where = kid+"='"+mkvs.key+"'";
        Mycurd.get(tab, opt, function(rdb){
            cb && cb(rdb[0]);
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
