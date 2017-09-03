var Config = require('../module/config'),
    Tools  = require('../module/tools'),
    url    = require('url'),
    fs     = require('fs'),
    util   = require('util');

function ViewOP(req, res) {

    this.run = function(mkvs) { 

        if(mkvs.mod=='weixin' || mkvs.mod=='someone'){
            var cop = '/'+mkvs.dir+'/module/'+mkvs.mod+'Ctrl.js';
            var ctrl = require(_dir+cop); // 子路由
            return new ctrl(mkvs, req, res).run();
        }else{
            res.writeHead(404);
            res.write('User extra deel with : [' + mkvs.dir + '/index.js]');
            res.end('\n\nmkv = ' + util.inspect(mkvs));
        }
        
    };

};
module.exports = ViewOP;


