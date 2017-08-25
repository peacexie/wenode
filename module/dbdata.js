
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

        // mkv:data
        if(Config['dbmod'][mkvs.mod]){
            if(mkvs.type=='mhome' || mkvs.type=='mtype'){
                data = this.dbList();
            }else if(mkvs.type=='detail'){
                data = this.dbDetail();
            }
        }

        // 用户扩展处理
        var cp = '/'+mkvs.dir+'/module/'+mkvs.mod+'/Ctrl.js';
        var flag = Tools.fsHas(cp);
        if(flag){
            var Ctrl = require(cp);
            var ctrl = new Ctrl(mkvs, data); // 控制器
            var act = mkvs.type+'Act';
            if(typeof(ctrl[act])=='function'){
                data = ctrl[act](data);
            }
        }

        /*
        Tools.debug('xxx1:', typeof(this['test1'])); // xxx1: function
        Tools.debug('xxx1:', typeof(this['test2'])); // xxx1: undefined
        this['test1'](123); // xxx2 test1:123
        this.test1= function(aaa){
            Tools.debug('xxx2', 'test1:'+aaa);
        }
        */

    };

    // dbList
    this.dbList = function(){
        //xxx
    }

    // dbDetail
    this.dbDetail = function(){
        //xxx
    }

    // !!! 自行扩展,执行前自行判断权限 !!! 

    // dbAdd
    this.dbAdd = function(){
        //xxx
    }
    // dbUpd
    this.dbUpd = function(){
        //xxx
    }
    // dbDel
    this.dbDel = function(){
        //xxx
    }

};
module.exports = dbData;

/*

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
