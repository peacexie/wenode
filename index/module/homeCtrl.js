
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    SockIO = require('socket.io'),
    os     = require('os'),
    util   = require('util');

function homeCtrl(mkvs, rdb, req, res) {

    // shttpAct
    this.shttpAct = function(cb){
        // '?aid=1200&uname=更新消息&type=push'>?aid=1200&uname=更新消息
        // '?aid=1600&uname=系统提示&type=push'>?aid=1600&uname=系统提示
        // '?aid=1800&uname=消息推送&type=push'>?aid=1800&uname=消息推送
        msgs = 'xxx消息';
        var mstamp = Date.parse(new Date()); // mstamp:时间戳(ms),取服务器时间
        var stime = Tools.fmtStamp(mstamp,'Y-m-d H:i:s',1);
        var data = {'user':'userSystem', 'msgs':msgs, 'ip':'-', 'stime':stime, 'room':'push.1600'};
        ws.to('push.1600').emit('emsg', data);
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


