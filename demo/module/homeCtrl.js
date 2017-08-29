
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    Mycurd = require('../../module/mycurd'),
    util   = require('util');

function indexCtrl(mkvs, rdb, req, res) {

    var data = {};

    // indexAct
    this.indexAct = function(cb){ 
        var funcs = [this.topNews, this.topPerson, this.topChats, this.topRems];
        Tools.exeOrder(funcs, 0, funcs.length, function(){
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
        opt.limit = 5;
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

