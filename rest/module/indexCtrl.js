
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    util   = require('util');

function indexCtrl(mkvs, rdb) {

    // mhomeAct
    this.mhomeAct = function(cb){ 
        var data = {"hello":"Hi, Rest-API!"};
        cb && cb(data);
    }

};
module.exports = indexCtrl;


