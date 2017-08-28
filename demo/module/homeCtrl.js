
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    Mycurd = require('../../module/mycurd'),
    util   = require('util');

function indexCtrl(mkvs, rdb) {

    var data = {};

    // mhomeAct
    this.mhomeAct = function(cb){ 
        var exeOrder = function(funcs, count, sum, cb){
            if(count==sum){
                cb && cb();
                return; 
            }else{
                funcs[count](function(){
                    count++;
                    exeOrder(funcs, count, sum, cb);
                });
            }  
        }
        var funcs = [this.topNews, this.topPerson, this.topChats, this.topRems];
        var len = funcs.length;
        exeOrder(funcs, 0, len, function(){
            cb && cb(data);
        });
    }

    this.topRems = function(cb){ 
        var opt = {};
        opt.order = 'cid DESC';
        opt.limit = 5;
        Mycurd.get('coms_nrem', opt, function(rdb){
            data.rems = rdb;
            cb && cb();
        });
    }
    this.topChats = function(cb){ 
        var opt = {};
        opt.order = 'id DESC';
        opt.limit = 5;
        Mycurd.get('chatroom', opt, function(rdb){
            data.chats = rdb;
            cb && cb();
        });
    }

    this.topNews = function(cb){ 
        var opt = {};
        opt.order = 'did DESC';
        opt.limit = 3;
        Mycurd.get('docs_news', opt, function(rdb){
            data.news = rdb;
            cb && cb();
        });
    }
    this.topPerson = function(cb){ 
        var opt = {};
        opt.order = 'uid DESC';
        opt.limit = 5;
        Mycurd.get('users_person', opt, function(rdb){
            data.person = rdb;
            cb && cb();
        });
    }

};
module.exports = indexCtrl;


