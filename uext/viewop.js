var Config = require('../cache/config/config'),
    Tools  = require('../module/tools'),
    url    = require("url"),
    util   = require('util'),
    fs     = require("fs");

function ViewOP(req, res) {

    this.run = function(mkvs) { 
        res.writeHead(404);
        res.write('User extra deel with : [' + mkvs.dir + '/index.js]');
        res.end('\n\nmkv = ' + util.inspect(mkvs));
    };

};
module.exports = ViewOP;


