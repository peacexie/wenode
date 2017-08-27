
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    os     = require('os'),
    util   = require('util');

function homeCtrl(mkvs, rdb) {

    // aboutAct
    this.aboutAct = function(cb){ 
        var mdstr = Tools.fsRead('/README.md');
        var data = {"md":mdstr.data};
        cb && cb(data);
    }

    // infoAct
    this.infoAct = function(cb){ 
        var data = {};
        data.systype = os.type(); // linux, Darwin, Windows_NT
        data.hostname = os.hostname();
        data.release = os.release();
        data.cpus = os.cpus();
        data.networkInterfaces = os.networkInterfaces();
        data.endianness = os.endianness();
        cb && cb(data);
        // ip
    }

};
module.exports = homeCtrl;


