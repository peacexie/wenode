
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    util   = require('util');

function homeCtrl(mkvs, rdb) {

    // aboutAct
    this.aboutAct = function(cb){ 
        var mdstr = Tools.fsRead('/README.md');
        var data = {"md":mdstr.data};
        cb && cb(data);
    }

};
module.exports = homeCtrl;


