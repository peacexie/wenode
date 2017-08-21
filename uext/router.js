var Config    = require('../module/config'),
    Tools     = require('../module/tools'),
    ViewOP = require('../module/viewop'),
    url    = require("url"),
    util   = require('util'),
    fs     = require("fs");

function Router(req, res) {

    this.run = function(mkvs) { 
        res.writeHead(404);
        res.write('User extra deel with : [' + mkvs.dir + '/index.js]');
        res.end('\n\nmkv = ' + util.inspect(mkvs));
    };

};
module.exports = Router;


