
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    util   = require('util');

function indexCtrl(mkvs, rdb, req, res) {

    // indexAct
    this.indexAct = function(cb){ 
        var data = {"hello":"Hi, Rest-API!"};
        cb && cb(data);
    }

};
module.exports = indexCtrl;


