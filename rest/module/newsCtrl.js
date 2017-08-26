
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    util   = require('util');

function newsCtrl(mkvs, rdb) {

    this.init = function(key) { 
        var ext = {'ext1':'v1Extra-'+key, 'ext2':'v2Extra-'+key};
        return ext;
    };

    // mhomeAct
    this.mhomeAct = function(cb){ 
        var ext = this.init('mhome');
        cb && cb(ext);
    }

    // u123Act
    this.u123Act = function(cb){
        var ext = this.init('u123');
        cb && cb(ext);
    }

    // mtypeAct
    this.mtypeAct = function(cb){
        var ext = this.init('mtype');
        cb && cb(ext);
    }

    // detailAct
    this.detailAct = function(cb){
        var ext = this.init('detail');
        cb && cb(ext);
    }

};
module.exports = newsCtrl;


