
var Config = require('../../module/config'),
    Tools  = require('../../module/tools'),
    util   = require('util');

function indexCtrl(mkvs, rdb, req, res) {

    // indexAct
    this.indexAct = function(cb){ 
        var data = {
            "hello":"Hi, Here are links for Rest-API!",
            "news-home":"/rest/news",
            "news-detail":"/rest/news.2015-9c-m4k1",
            "person-xml":"/rest/person?vtype=xml",
        };
        cb && cb(data);
    }

};
module.exports = indexCtrl;


