
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    SockIO = require('socket.io'),
    os     = require('os'),
    util   = require('util');

function someoneCtrl(mkvs, req, res) {

    var room, data;

    this.run = function(type){
        res.writeHead(200);
        res.write('User extra someoneCtrl : [' + mkvs.dir + '/index.js]');
        res.end('\n\nmkv = ' + util.inspect(mkvs));
    }

};
module.exports = someoneCtrl;
