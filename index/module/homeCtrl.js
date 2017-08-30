
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    os     = require('os'),
    util   = require('util');

function homeCtrl(mkvs, rdb, req, res) {

    // aboutAct
    this.aboutAct = function(cb){ 
        var mdstr = Tools.fsRead('/README.md');
        var data = {"md":mdstr.data};
        cb && cb(data);
    }

    // infoAct
    this.infoAct = function(cb){ 
        var data = {};
        data.version = process.version;
        data.systype = os.type(); // linux, Darwin, Windows_NT
        data.hostname = os.hostname();
        data.release = os.release();
        data.cpusModels = os.cpus();
        data.cpusModel = data.cpusModels[0]['model'];
        data.networkInterfaces = os.networkInterfaces();
        data.endianness = os.endianness();
        data.clientIp = Tools.clientIp(req);
        data.execPath = process.execPath;
        data.platform = process.platform;
        //this.test(data.networkInterfaces); // os.cpus()
        cb && cb(data);
        // ip
    }

    // for Test
    this.test = function(obj) {
        for(var j in obj) {
            console.log('\n --- testa:', j+':');
            for(var k in obj[j]) {
                console.log(' - '+k+':', obj[j][k]);
            }
        }
        console.log('\n');
        //console.log('Hi!');
    }

};
module.exports = homeCtrl;


