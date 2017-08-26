
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    url    = require("url"),
    util   = require('util'),
    fs     = require("fs");

function newsCtrl(mkvs, data) {

    this.init = function(key) { 
        var ext = {'ext1':'v1Extra-'+key, 'ext2':'v2Extra-'+key};
        return ext;
    };

    // mhomeAct
    this.mhomeAct = function(cb){
        var ext = this.init('mhome');
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


