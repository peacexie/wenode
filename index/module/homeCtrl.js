
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    SockIO = require('socket.io'),
    os     = require('os'),
    util   = require('util');

function homeCtrl(mkvs, rdb, req, res) {

    var data;

    this.sinit = function(type){
        var mstamp = Date.parse(new Date()); // mstamp:时间戳(ms),取服务器时间
        var stime = Tools.fmtStamp(mstamp,'Y-m-d H:i:s',1);
        var q = mkvs.query;
        var aid = q.aid ? q.aid : Math.floor(Math.random()*(9876-1234+1)+1234);
        var uname = q.uname ? q.uname : '系统Admin';
        var msgs = q.msgs ? q.msgs+' ('+stime+')' : '系统Message ('+stime+')';
        var room = type+'.'+aid;
        var user = {"uid":room, "uname":uname};
        data = {'user':user, 'msgs':msgs, 'ip':'-', 'stime':stime, 'room':room};
        ws.to(room).emit('emsg', data);
    }
    // spushAct
    this.spushAct = function(cb){
        this.sinit('push');
        cb && cb(data);
    }
    // scansAct
    this.scansAct = function(cb){
        this.sinit('scans');
        cb && cb(data);
    }

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
        data.endianness = os.endianness();
        data.networkInterfaces = os.networkInterfaces();
        data.cpusModels = os.cpus();
        data.cpusModel = os.cpus()[0]['model'];
        data.clientIp = Tools.clientIp(req);
        data.version = process.version;
        data.execPath = process.execPath;
        data.platform = process.platform;
        //this.test(os.networkInterfaces); // os.cpus()
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


