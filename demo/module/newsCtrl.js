
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    Mycurd = require('../../module/mycurd'),
    util   = require('util');

function newsCtrl(mkvs, rdb, req, res) {

    this.init = function(key) { 
        var ext = {'ext1':'v1Extra-'+key, 'ext2':'v2Extra-'+key};
        return ext;
    };

    // indexAct
    this.indexAct = function(cb){ 
        var ext = this.init('mhome');
        cb && cb(ext);
    }

    // detailAct
    this.detailAct = function(cb){
        // 处理: pid, page, order, limit ... 
        var opt = {};
        opt.where = "pid='"+mkvs.key+"'";
        opt.order = 'cid DESC';
        opt.limit = 10;
        Mycurd.get('coms_nrem', opt, function(rdb){
            cb && cb(rdb);
        });

    }

};
module.exports = newsCtrl;


